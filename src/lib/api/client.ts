import { config } from '@/lib/config'
import { session } from '@/features/auth/session'

/** 统一业务错误保留业务码，禁止按可能变化的错误文案判断身份。 */
export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public metadata: Record<string, string> = {},
    public status = 200,
    public reason = '',
  ) {
    super(message)
    this.name = 'ApiError'
  }
  get authentication() {
    return [3002, 3003, 3004, 3005, 3006, 3007, 401, 403].includes(this.code)
  }
}

type Options = Omit<RequestInit, 'body'> & {
  body?: unknown
  auth?: boolean
  response?: 'json' | 'blob'
}
const record = (v: unknown): Record<string, unknown> | null =>
  v !== null && typeof v === 'object' ? (v as Record<string, unknown>) : null
let authTail: Promise<void> = Promise.resolve()

/** 在消费响应流时限制文件大小，避免先读完整个大文件才报错。 */
async function boundedBlob(response: Response): Promise<Blob> {
  const limit = 256 * 1024 * 1024
  if (Number(response.headers.get('content-length')) > limit) {
    await response.body?.cancel()
    throw new ApiError(413, '文件超过当前浏览器 256 MB 下载限制')
  }
  if (!response.body) return new Blob()
  const reader = response.body.getReader()
  const chunks: BlobPart[] = []
  let bytes = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > limit) {
        await reader.cancel()
        throw new ApiError(413, '文件超过当前浏览器 256 MB 下载限制')
      }
      chunks.push(new Uint8Array(value))
    }
  } finally {
    reader.releaseLock()
  }
  return new Blob(chunks, {
    type: response.headers.get('content-type') || 'application/octet-stream',
  })
}

/** 提取 HTTP 200 内的业务错误；验证码的字符串 code 不属于错误码。 */
export function businessError(data: unknown, status = 200): ApiError | null {
  const root = record(data)
  if (!root) return null
  if (typeof root.code === 'number' && typeof root.reason === 'string') {
    const metadata = record(root.metadata) || {}
    return new ApiError(
      root.code,
      String(root.message || root.reason || '请求失败'),
      Object.fromEntries(
        Object.entries(metadata).filter(
          (entry): entry is [string, string] => typeof entry[1] === 'string',
        ),
      ),
      status,
      root.reason,
    )
  }
  for (const item of [root, record(root.resp), record(root.common)]) {
    const code = item?.statusCode ?? item?.status
    if (typeof code === 'number' && code !== 0 && (code < 200 || code >= 300))
      return new ApiError(code, String(item?.message || item?.msg || '操作未完成'), {}, status)
  }
  return null
}

/** 请求只在明确的鉴权前置刷新响应后重发一次，未知结果不自动重试。 */
async function perform<T>(path: string, options: Options, retry: boolean): Promise<T> {
  const { body, auth = true, response: responseType = 'json', ...init } = options
  const snapshot = session.get()
  const generation = session.generation()
  const headers = new Headers(init.headers)
  if (auth && snapshot) {
    headers.set('Authorization', `Bearer ${snapshot.accessToken}`)
    headers.set('Refresh-Token', `Bearer ${snapshot.refreshToken}`)
  }
  const form = body instanceof FormData
  if (body !== undefined && !form) headers.set('Content-Type', 'application/json')
  const response = await fetch(`${config.apiBase}${path}`, {
    ...init,
    headers,
    body: body === undefined ? undefined : form ? body : JSON.stringify(body),
  })
  const mime = response.headers.get('content-type') || ''
  const json = responseType === 'json' || !/^(video\/|application\/octet-stream)/i.test(mime)
  const data: unknown = json
    ? await response.json().catch(() => {
        if (!response.ok) return null
        throw new ApiError(
          response.status || 502,
          '服务器返回了无法识别的响应',
          {},
          response.status,
        )
      })
    : await boundedBlob(response)
  const error = businessError(data, response.status)
  if (
    error?.code === 3005 &&
    auth &&
    retry &&
    snapshot &&
    error.metadata.access_token &&
    session.refresh(error.metadata.access_token, generation)
  ) {
    return perform<T>(path, options, false)
  }
  if (error) {
    if (
      auth &&
      (error.authentication || [401, 403].includes(response.status)) &&
      session.generation() === generation
    )
      session.set(null)
    throw error
  }
  if (!response.ok) {
    if (auth && [401, 403].includes(response.status) && session.generation() === generation)
      session.set(null)
    throw new ApiError(
      response.status,
      response.status === 404 ? '内容不存在或已移除' : '服务暂时不可用，请稍后重试',
      {},
      response.status,
    )
  }
  if (auth && session.generation() !== generation)
    throw new ApiError(409, '登录状态已变化，请重新操作')
  if (responseType === 'blob' && !(data instanceof Blob))
    throw new ApiError(502, '下载接口没有返回有效文件')
  return data as T
}

/** 已登录请求串行通过鉴权，保证本标签页不会用旧 token 与刷新请求竞争。 */
export async function request<T>(path: string, options: Options = {}): Promise<T> {
  if (options.auth === false || !session.get()) return perform<T>(path, options, true)
  const generation = session.generation()
  let release!: () => void
  const previous = authTail
  authTail = new Promise<void>((resolve) => {
    release = resolve
  })
  await previous
  try {
    if (options.signal?.aborted) throw new DOMException('请求已取消', 'AbortError')
    if (session.generation() !== generation) throw new ApiError(409, '登录状态已变化，请重新操作')
    return await perform<T>(path, options, true)
  } finally {
    release()
  }
}

/** 普通 UI 仅展示错误说明，不暴露 token 或原始响应。 */
export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : '操作未完成，请稍后重试'
}
