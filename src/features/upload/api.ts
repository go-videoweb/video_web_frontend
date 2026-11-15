import { z } from 'zod'
import { request } from '@/lib/api/client'
import { positiveId } from '@/lib/utils'

/** 元信息只创建一次，返回的 videoId 用于后续独立步骤。 */
export async function createVideo(
  userId: string,
  values: {
    title: string
    description: string
    classes: string[]
    tags: string[]
    publisherName: string
  },
) {
  return z.object({ videoId: z.string().regex(/^[1-9]\d*$/) }).parse(
    await request(`/${positiveId(userId)}/video/metaInfo`, {
      method: 'POST',
      body: { videoInfo: { ...values, publisherId: userId } },
    }),
  ).videoId
}

/** 上传响应只代表当前文件步骤被接收，播放前须查询处理状态。 */
export function uploadMedia(
  userId: string,
  videoId: string,
  file: File,
  kind: 'file' | 'cover',
  signal?: AbortSignal,
) {
  const form = new FormData()
  form.set(kind, file)
  return request(`/${positiveId(userId)}/video/${positiveId(videoId)}/${kind}`, {
    method: 'POST',
    body: form,
    signal,
  })
}

/** 仅发布者读取；收到未知状态时由页面停止推进，不猜测已完成。 */
export function getUploadStatus(videoId: string, signal?: AbortSignal) {
  return request<{ status: string; updatedTime: string | null; uploadErrorMsg: string }>(
    `/video/${positiveId(videoId)}/upload-status`,
    { signal, cache: 'no-store' },
  )
}
