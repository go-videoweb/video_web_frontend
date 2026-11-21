import { afterAll, beforeAll, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

const server = setupServer(...handlers)
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterAll(() => server.close())
const headers = {
  Authorization: 'Bearer demo-access',
  'Refresh-Token': 'Bearer demo-refresh',
  'Content-Type': 'application/json',
}

it.each([
  ['/favorites/999', 'PATCH', {}, 4118, 'FAVORITE_NOT_FOUND'],
  ['/favorites/999/videos', 'GET', undefined, 5218, 'FAVORITE_NOT_FOUND'],
  ['/video/999/info', 'GET', undefined, 5233, 'VIDEO_NOT_FOUND'],
  ['/video/999/upload-status', 'GET', undefined, 5110, 'VIDEO_UPLOAD_STATUS_NOT_FOUND'],
  ['/video/999/comment/999/upvote', 'PUT', { liked: true }, 5209, 'COMMENT_NOT_FOUND'],
  [
    '/video/interaction/999/barrage/upvote',
    'PUT',
    { liked: true, barrageId: '999' },
    5204,
    'BARRAGE_NOT_FOUND',
  ],
  [
    '/follow-lists/batch-delete',
    'POST',
    { idList: ['9007199254780001'] },
    4136,
    'DEFAULT_FOLLOW_LIST_DELETE',
  ],
])('模拟 %s 使用当前业务码而非 HTTP 错误码', async (path, method, body, code, reason) => {
  const response = await fetch('http://localhost/api/v1' + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  expect(response.status).toBe(200)
  expect(await response.json()).toMatchObject({ code, reason })
})

it('未登录模拟请求返回真实鉴权 code/reason 配对', async () => {
  const response = await fetch('http://localhost/api/v1/favorites/list')
  expect(response.status).toBe(200)
  expect(await response.json()).toMatchObject({ code: 3003, reason: 'token缺失' })
})
