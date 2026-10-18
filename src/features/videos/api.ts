import { z } from 'zod'
import { request } from '@/lib/api/client'
import { videoDetailSchema, videoSummarySchema } from '@/lib/api/models'
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
  const result = await request<unknown>(`/video/${positiveId(id)}/info`, { signal })
  return z.object({ videoDetail: videoDetailSchema }).parse(result).videoDetail
}

/** 互动由服务器判定当前状态，客户端不盲目重试切换操作。 */
export function interact(
  id: string,
  action: 'upvote' | 'favorite' | 'throwShells',
  body: Record<string, unknown> = {},
) {
  return request<{ message?: string }>(`/video/interaction/${positiveId(id)}/${action}`, {
    method: 'PUT',
    body,
  })
}

/** 分享虽为 GET 仍属于写操作，只在用户明确操作时调用。 */
export function shareVideo(id: string) {
  return request<{ url?: string; message?: string }>(`/video/interaction/${positiveId(id)}/share`)
}

/** 弹幕发送时间按后端 hh:mm:ss 契约，不虚构弹幕读取能力。 */
export function sendBarrage(id: string, content: string, time: string, color: string) {
  return request(`/video/interaction/${positiveId(id)}/barrage/send`, {
    method: 'POST',
    body: { content, time, color },
  })
}

/** 弹幕 ID 需来自后端读取能力，目前仅保留适配入口。 */
export function upvoteBarrage(videoId: string, barrageId: string) {
  return request(`/video/interaction/${positiveId(videoId)}/barrage/upvote`, {
    method: 'PUT',
    body: { barrageId: positiveId(barrageId) },
  })
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
