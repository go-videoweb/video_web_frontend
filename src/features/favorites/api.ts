import { request } from '@/lib/api/client'
import { positiveId } from '@/lib/utils'

/** 收藏夹操作适配当前写接口，查询缺口未解决前不建立虚假管理页。 */
export function createFavorite(userId: string, name: string, description = '', isPrivate = 1) {
  return request('/favorites', {
    method: 'POST',
    body: { userId: positiveId(userId), favoritesName: name, description, isPrivate },
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
