import { afterEach, expect, it, vi } from 'vitest'
import { session } from '@/features/auth/session'
import { request } from './client'

const identity = { userId: '9007199254740993', accessToken: 'old-access', refreshToken: 'refresh' }
function respond(code: number, reason: string, metadata: Record<string, string> = {}) {
  const fetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ code, reason, message: '服务端说明', metadata }), {
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  vi.stubGlobal('fetch', fetch)
  session.set(identity)
  return fetch
}
afterEach(() => {
  session.set(null)
  vi.unstubAllGlobals()
})

// 数字独立于前端常量，锁定后端 f6cfcc39 的线上协议，而非仅验证同一份常量。
it.each([
  [3002, '已退出'],
  [3003, 'token缺失'],
  [3004, 'token无效'],
  [3005, '过期且没有新 token'],
  [3006, 'refresh token已过期'],
  [3007, '解析token失败'],
  [3124, 'INVALID_IDENTITY'],
  [3127, 'UNAUTHORIZED'],
  [3128, 'USER_ID_MISSING'],
  [3129, 'INVALID_USER_ID'],
  [401, 'UNAUTHORIZED'],
  [403, 'LEGACY_AUTH'],
])('HTTP 200 中的身份码 %s 清理会话且不重发写操作', async (code, reason) => {
  const fetch = respond(Number(code), String(reason))
  await expect(request('/private', { method: 'POST', body: {} })).rejects.toMatchObject({
    code,
    reason,
  })
  expect(session.get()).toBeNull()
  expect(fetch).toHaveBeenCalledTimes(1)
})

it.each([
  [3008, '创建token失败'],
  [3123, 'INVALID_USER_ID'],
  [3101, 'REGISTRATION_SESSION_FAILED'],
  [3117, 'AVATAR_TOO_LARGE'],
  [4101, 'PASSWORD_SESSION_INVALIDATION_FAILED'],
  [4114, 'INVALID_EMAIL_CODE'],
  [4115, 'EMAIL_CODE_RATE_LIMITED'],
  [4118, 'FAVORITE_NOT_FOUND'],
  [4136, 'DEFAULT_FOLLOW_LIST_DELETE'],
  [5106, 'VIDEO_UPLOAD_FORBIDDEN'],
  [5218, 'FAVORITE_NOT_FOUND'],
  [5220, 'VIDEO_ALREADY_FAVORITED'],
  [5221, 'FAVORITE_RECORD_CHANGED'],
  [5233, 'VIDEO_NOT_FOUND'],
  [3199, 'UNKNOWN_GATEWAY_ERROR'],
])('业务码 %s 不按区间或 reason 误清会话，也不因 metadata 误刷新', async (code, reason) => {
  const fetch = respond(Number(code), String(reason), { access_token: 'must-not-be-used' })
  await expect(request('/private', { method: 'PUT', body: {} })).rejects.toMatchObject({
    code,
    reason,
  })
  expect(session.get()).toEqual(identity)
  expect(fetch).toHaveBeenCalledTimes(1)
})

it.each([
  [3101, 'REGISTRATION_SESSION_FAILED', { user_created: 'true' }],
  [
    4101,
    'PASSWORD_SESSION_INVALIDATION_FAILED',
    { password_changed: 'true', session_revoked: 'false' },
  ],
])('部分成功业务码 %s 保留页面判断依赖的 metadata', async (code, reason, metadata) => {
  respond(code, reason, metadata)
  await expect(
    request('/account', { method: 'POST', auth: false, body: {} }),
  ).rejects.toMatchObject({ code, reason, metadata, status: 200 })
  expect(session.get()).toEqual(identity)
})

it('旧请求的新身份错误不能清除之后登录的账号', async () => {
  let resolve!: (response: Response) => void
  vi.stubGlobal(
    'fetch',
    vi.fn(
      () =>
        new Promise<Response>((done) => {
          resolve = done
        }),
    ),
  )
  session.set(identity)
  const pending = request('/private')
  await vi.waitFor(() => expect(resolve).toBeTypeOf('function'))
  const next = { ...identity, userId: '9007199254740995', accessToken: 'new-user-access' }
  session.set(next)
  resolve(
    new Response(JSON.stringify({ code: 3129, reason: 'INVALID_USER_ID', message: '请先登录' })),
  )
  await expect(pending).rejects.toMatchObject({ code: 3129 })
  expect(session.get()).toEqual(next)
})
