import { afterEach, describe, expect, it, vi } from 'vitest'
import { session } from '@/features/auth/session'
import { resetPassword, sendEmailCode } from '@/features/auth/api'
import { getComments, postComment, upvoteComment } from '@/features/comments/api'
import { setVideoFavorite } from '@/features/favorites/api'
import { getBarrages, getVideo } from '@/features/videos/api'
import { getUploadStatus } from '@/features/upload/api'
import { businessError } from './client'

const userId = '9007199254740993'
const videoId = '9007199254740995'
const reply = (data: unknown) =>
  new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
function recorder(data: unknown) {
  const fetch = vi.fn(async (_url: string, _init: RequestInit) => reply(data))
  vi.stubGlobal('fetch', fetch)
  return fetch
}
afterEach(() => {
  session.set(null)
  vi.unstubAllGlobals()
})

describe('ba2604fd HTTP 契约', () => {
  it('保留评论游标的大 ID、零值及纳秒精度', async () => {
    const fetch = recorder({ comments: [], totalCount: 0, hasMore: false, nextCursor: null })
    const createdAt = '2026-11-11T08:00:00.123456789Z'
    await getComments(videoId, 'created_at', {
      videoId,
      rootId: '0',
      sortBy: 'created_at',
      order: 'desc',
      commentId: userId,
      createdAt,
      upvoteCount: '0',
    })
    const params = new URL(fetch.mock.calls[0]![0], 'http://example.test').searchParams
    expect(params.get('cursor.created_at')).toBe(createdAt)
    expect(params.get('cursor.root_id')).toBe('0')
    expect(params.get('cursor.comment_id')).toBe(userId)
    expect(params.has('page_num')).toBe(false)
  })
  it('弹幕游标不丢零秒，区间使用半开边界', async () => {
    const fetch = recorder({ barrages: [], hasMore: false, nextCursor: null })
    await getBarrages(videoId, 0, 60, {
      videoId,
      startSecond: 0,
      endSecond: 60,
      positionSecond: 0,
      barrageId: userId,
    })
    const params = new URL(fetch.mock.calls[0]![0], 'http://example.test').searchParams
    expect(params.get('cursor.position_second')).toBe('0')
    expect(params.get('start_second')).toBe('0')
    expect(params.get('end_second')).toBe('60')
  })
  it('主评论、取消点赞及取消收藏提交明确命令', async () => {
    const fetch = recorder({})
    await postComment(videoId, '内容')
    await upvoteComment(videoId, userId, false)
    await setVideoFavorite(videoId, '18', userId)
    expect(fetch.mock.calls.map(([, init]) => JSON.parse(String(init.body)))).toEqual([
      { parentId: '-1', content: '内容' },
      { liked: false },
      { favorite: -1, favoriteId: '18', favoriteRecordId: userId },
    ])
  })
  it('匿名找回和验证码用途不携带现有双令牌', async () => {
    const fetch = recorder({})
    session.set({ userId, accessToken: 'test-access', refreshToken: 'test-refresh' })
    await sendEmailCode('example@example.test', 'reset_password')
    await resetPassword({
      email: 'example@example.test',
      inputCode: '012345',
      newPassword: 'test-password',
    })
    expect(fetch.mock.calls[0]![0]).toContain('purpose=reset_password')
    for (const [, init] of fetch.mock.calls) {
      expect(new Headers(init.headers).has('Authorization')).toBe(false)
      expect(new Headers(init.headers).has('Refresh-Token')).toBe(false)
    }
    expect(JSON.parse(String(fetch.mock.calls[1]![1].body)).inputCode).toBe('012345')
  })
  it('详情个人状态为空不被改为未点赞或未收藏', async () => {
    recorder({ videoDetail: { videoId, publisherId: userId }, userVideoStatus: null })
    expect((await getVideo(videoId)).userVideoStatus).toBeNull()
  })
  it('保留业务错误 reason 和部分成功元数据', () => {
    expect(
      businessError({
        code: 500,
        reason: 'PASSWORD_SESSION_INVALIDATION_FAILED',
        message: '已更新',
        metadata: { password_changed: 'true', session_revoked: 'false' },
      }),
    ).toMatchObject({
      reason: 'PASSWORD_SESSION_INVALIDATION_FAILED',
      metadata: { password_changed: 'true', session_revoked: 'false' },
    })
  })
  it('状态查询禁用 HTTP 缓存并传递取消信号', async () => {
    const fetch = recorder({ status: 'processing', updatedTime: null, uploadErrorMsg: '' })
    const { signal } = new AbortController()
    await getUploadStatus(videoId, signal)
    expect(fetch.mock.calls[0]![1]).toMatchObject({ cache: 'no-store', signal })
  })
})
