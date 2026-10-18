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

/** 视频响应只代表已提交；实际转码状态需要后端进一步提供。 */
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
