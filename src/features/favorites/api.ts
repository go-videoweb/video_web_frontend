import { request } from '@/lib/api/client'
import { positiveId } from '@/lib/utils'
import { z } from 'zod'
import { videoSummarySchema } from '@/lib/api/models'

/** 创建并返回服务端生成的收藏夹 ID。 */
export function createFavorite(name: string, description = '', isPrivate: -1 | 1 = 1) {
  return request<{ favoriteId: string }>('/favorites', {
    method: 'POST',
    body: { favoritesName: name, description, isPrivate },
  })
}

export type Favorite = {
  favoriteId: string
  favoriteName: string
  description: string
  isPrivate: boolean
}
type FavoriteState = { favoriteId: string; favoriteRecordId: string; isFavorited: boolean }

/** 获取当前账号的公开及私密收藏夹。 */
export function getFavorites(signal?: AbortSignal) {
  return request<{ userId: string; favoriteList: Favorite[] }>('/favorites/list', { signal })
}

/** 读取可见收藏夹的视频，保留收藏时间和独立的视频发布时间。 */
export async function getFavoriteVideos(id: string, page: number, signal?: AbortSignal) {
  const query = new URLSearchParams({ page_num: String(page), page_size: '20' })
  return z
    .object({
      videos: z.array(z.object({ video: videoSummarySchema, collectedAt: z.string().nullable() })),
      total: z.string().regex(/^\d+$/),
    })
    .parse(await request(`/favorites/${positiveId(id)}/videos?${query}`, { signal }))
}

/** 取消必须携带当前关系版本 ID，不能用收藏夹 ID 替代。 */
export function setVideoFavorite(videoId: string, favoriteId: string, recordId?: string) {
  return request<FavoriteState>(`/video/interaction/${positiveId(videoId)}/favorite`, {
    method: 'PUT',
    body: {
      favoriteId: positiveId(favoriteId),
      favorite: recordId === undefined ? 1 : -1,
      ...(recordId === undefined ? {} : { favoriteRecordId: positiveId(recordId) }),
    },
  })
}
/** 修改前必须已知可信的收藏夹 ID。 */
export function updateFavorite(
  id: string,
  values: { favoritesName?: string; description?: string; isPrivate?: number },
) {
  return request(`/favorites/${positiveId(id)}`, { method: 'PATCH', body: values })
}
/** 删除不自动重试，避免未知结果被当成失败后重复提交。 */
export function deleteFavorite(id: string) {
  return request(`/favorites/${positiveId(id)}`, { method: 'DELETE' })
}
