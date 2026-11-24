import { ErrorCode } from './error-codes'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, businessError, request } from './client'
import { session } from '@/features/auth/session'

const identity = { userId: '9007199254740993', accessToken: 'old-access', refreshToken: 'refresh' }
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
beforeEach(() => {
  session.set(null)
  vi.unstubAllGlobals()
})

describe('API 契约与会话', () => {
  it('保留大 ID 并同时发送两个 Bearer 请求头', async () => {
    session.set(identity)
    const fetch = vi.fn().mockResolvedValue(json({ userId: identity.userId }))
    vi.stubGlobal('fetch', fetch)
    expect(await request('/userinfo/9007199254740993')).toEqual({ userId: identity.userId })
    const headers = fetch.mock.calls[0]![1].headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer old-access')
    expect(headers.get('Refresh-Token')).toBe('Bearer refresh')
  })
  it('HTTP 200 的业务错误仍然失败', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(json({ code: 3001, reason: 'INTERNAL', message: '服务异常' })),
    )
    await expect(request('/video/1/info')).rejects.toMatchObject({
      code: 3001,
      message: '服务异常',
    })
  })
  it('明确刷新错误最多重发一次并保存新 token', async () => {
    session.set(identity)
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(
        json({
          code: ErrorCode.AccessTokenExpired,
          reason: 'EXPIRED',
          metadata: { access_token: 'new-access' },
        }),
      )
      .mockResolvedValueOnce(json({ statusCode: 200 }))
    vi.stubGlobal('fetch', fetch)
    await request('/video/interaction/1/upvote', { method: 'PUT', body: {} })
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(session.get()?.accessToken).toBe('new-access')
    expect((fetch.mock.calls[1]![1].headers as Headers).get('Authorization')).toBe(
      'Bearer new-access',
    )
  })
  it('刷新响应再次过期时不会形成重试循环', async () => {
    session.set(identity)
    const fetch = vi.fn().mockImplementation(() =>
      Promise.resolve(
        json({
          code: ErrorCode.AccessTokenExpired,
          reason: 'EXPIRED',
          metadata: { access_token: 'new-access' },
        }),
      ),
    )
    vi.stubGlobal('fetch', fetch)
    await expect(request('/video/interaction/1/upvote', { method: 'PUT' })).rejects.toMatchObject({
      code: ErrorCode.AccessTokenExpired,
    })
    expect(fetch).toHaveBeenCalledTimes(2)
  })
  it('缺少新 token 的错误不会重发操作', async () => {
    session.set(identity)
    const fetch = vi
      .fn()
      .mockResolvedValue(json({ code: ErrorCode.AccessTokenExpired, reason: 'EXPIRED' }))
    vi.stubGlobal('fetch', fetch)
    await expect(
      request('/video/1/comment', { method: 'POST', body: { content: 'test' } }),
    ).rejects.toBeInstanceOf(ApiError)
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  it('代理返回非 JSON 的 HTTP 401 也会清空失效身份且不重试', async () => {
    session.set(identity)
    const fetch = vi.fn().mockResolvedValue(new Response('Unauthorized', { status: 401 }))
    vi.stubGlobal('fetch', fetch)
    await expect(request('/private')).rejects.toMatchObject({ code: 401 })
    expect(session.get()).toBeNull()
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  it('网络中断后不会重发写操作', async () => {
    const fetch = vi.fn().mockRejectedValue(new TypeError('network unavailable'))
    vi.stubGlobal('fetch', fetch)
    await expect(request('/video/1/comment', { method: 'POST', body: {} })).rejects.toThrow(
      'network unavailable',
    )
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  it('并发请求在刷新后统一使用最新凭据', async () => {
    session.set(identity)
    const values: string[] = []
    const fetch = vi.fn().mockImplementation((_url, options) => {
      const authorization = (options.headers as Headers).get('Authorization')!
      values.push(authorization)
      return Promise.resolve(
        authorization === 'Bearer old-access'
          ? json({
              code: ErrorCode.AccessTokenExpired,
              reason: 'EXPIRED',
              metadata: { access_token: 'new-access' },
            })
          : json({ statusCode: 200 }),
      )
    })
    vi.stubGlobal('fetch', fetch)
    await Promise.all([request('/a'), request('/b'), request('/c')])
    expect(values).toEqual([
      'Bearer old-access',
      'Bearer new-access',
      'Bearer new-access',
      'Bearer new-access',
    ])
  })
  it('退出后的旧刷新响应不能恢复会话', async () => {
    session.set(identity)
    let resolve!: (value: Response) => void
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        () =>
          new Promise<Response>((r) => {
            resolve = r
          }),
      ),
    )
    const pending = request('/private')
    await vi.waitFor(() => expect(resolve).toBeTypeOf('function'))
    session.set(null)
    resolve(
      json({
        code: ErrorCode.AccessTokenExpired,
        reason: 'EXPIRED',
        metadata: { access_token: 'late-access' },
      }),
    )
    await expect(pending).rejects.toBeInstanceOf(ApiError)
    expect(session.get()).toBeNull()
  })
  it('排队期间取消的请求不会被发出', async () => {
    session.set(identity)
    let resolve!: (value: Response) => void
    const fetch = vi.fn().mockImplementation(
      () =>
        new Promise<Response>((r) => {
          resolve = r
        }),
    )
    vi.stubGlobal('fetch', fetch)
    const first = request('/first')
    await vi.waitFor(() => expect(resolve).toBeTypeOf('function'))
    const abort = new AbortController()
    const second = request('/second', { signal: abort.signal })
    const rejection = expect(second).rejects.toMatchObject({ name: 'AbortError' })
    abort.abort()
    resolve(json({ statusCode: 200 }))
    await first
    await rejection
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  it('身份失效会清空当前会话', async () => {
    session.set(identity)
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          json({ code: ErrorCode.TokenInvalid, reason: 'INVALID', message: '请重新登录' }),
        ),
    )
    await expect(request('/private')).rejects.toMatchObject({ code: ErrorCode.TokenInvalid })
    expect(session.get()).toBeNull()
  })
  it('下载接口的纯文本 JSON 错误不会被保存成视频', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ code: ErrorCode.TokenMissing, reason: 'MISSING', message: '请先登录' }),
          {
            headers: { 'Content-Type': 'text/plain' },
          },
        ),
      ),
    )
    await expect(request('/0/video/1/file', { response: 'blob' })).rejects.toMatchObject({
      code: ErrorCode.TokenMissing,
    })
  })
  it('提前拒绝超过下载限制的文件响应', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('large', {
          headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(300 * 1024 * 1024) },
        }),
      ),
    )
    await expect(request('/0/video/1/file', { response: 'blob' })).rejects.toMatchObject({
      code: 413,
    })
  })
  it('识别嵌套业务错误，但不误判验证码 code', () => {
    expect(businessError({ common: { status: 400, message: '资料无效' } })?.message).toBe(
      '资料无效',
    )
    expect(businessError({ statusCode: 200, code: '123456' })).toBeNull()
  })
})
