import { z } from 'zod'
import { request } from '@/lib/api/client'
import { videoDetailSchema, videoStatusSchema, videoSummarySchema } from '@/lib/api/models'
import { downloadPath } from '@/lib/api/media'
import { positiveId } from '@/lib/utils'

/** 列表保留后端类别过滤和分页语义，不把空分类解释为全部。 */
export async function getVideos(category: string, page: number, signal?: AbortSignal) {
  const query = new URLSearchParams({ class: category, page_num: String(page), page_size: '12' })
  const result = await request<unknown>(`/video/list?${query}`, { signal })
  return z.object({ VideoSummary: z.array(videoSummarySchema).default([]) }).parse(result)
    .VideoSummary
}

/** 详情读取有计数副作用，调用者禁止自动预取和重试。 */
export async function getVideo(id: string, signal?: AbortSignal) {
  const result = await request<unknown>(`/video/${positiveId(id)}/info`, {
    signal,
    cache: 'no-store',
  })
  const parsed = z
    .object({ videoDetail: videoDetailSchema, userVideoStatus: videoStatusSchema.nullish() })
    .parse(result)
  return { ...parsed.videoDetail, userVideoStatus: parsed.userVideoStatus ?? null }
}

/** 互动由服务器判定当前状态，客户端不盲目重试切换操作。 */
export function interact(
  id: string,
  action: 'upvote' | 'throwShells',
  body: Record<string, unknown> = {},
) {
  return request<{ message?: string }>(`/video/interaction/${positiveId(id)}/${action}`, {
    method: 'PUT',
    body,
  })
}

/** 分享虽为 GET 仍属于写操作，只在用户明确操作时调用。 */
export function shareVideo(id: string) {
  return request<{ url: string; message?: string }>(`/video/interaction/${positiveId(id)}/share`, {
    cache: 'no-store',
  })
}

/** 弹幕按当前播放位置的整数秒发送。 */
export function sendBarrage(id: string, content: string, positionSecond: number, color: string) {
  return request(`/video/interaction/${positiveId(id)}/barrage/send`, {
    method: 'POST',
    body: { content, positionSecond, color },
  })
}

/** 显式提交弹幕点赞目标。 */
export function upvoteBarrage(videoId: string, barrageId: string, liked: boolean) {
  return request<{ isUpvoted: boolean; upvoteCount: string }>(
    `/video/interaction/${positiveId(videoId)}/barrage/upvote`,
    {
      method: 'PUT',
      body: { barrageId: positiveId(barrageId), liked },
    },
  )
}

export type Barrage = {
  barrageId: string
  content: string
  color: string
  positionSecond: number
  isUpvoted: boolean
  upvoteCount: string
}
type BarrageCursor = {
  videoId: string
  startSecond: number
  endSecond: number
  positionSecond: number
  barrageId: string
}

/** 区间前闭后开，游标须和当前区间一致，保留零秒字段。 */
export function getBarrages(
  id: string,
  start: number,
  end: number,
  cursor?: BarrageCursor,
  signal?: AbortSignal,
) {
  const query = new URLSearchParams({ start_second: String(start), end_second: String(end) })
  if (cursor)
    for (const [key, value] of Object.entries(cursor)) {
      query.set('cursor.' + key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase()), String(value))
    }
  return request<{ barrages: Barrage[]; nextCursor: BarrageCursor | null; hasMore: boolean }>(
    `/video/${positiveId(id)}/barrages?${query}`,
    { signal },
  )
}

/** 下载前检查大小；原文件过大时明确报错，避免浏览器内存失控。 */
export async function downloadVideo(id: string) {
  const blob = await request<Blob>(downloadPath(id), { response: 'blob' })
  if (blob.size > 256 * 1024 * 1024) throw new Error('文件超过当前浏览器下载大小限制')
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `video-${id}.mp4`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
