import { z } from 'zod'
import { request } from '@/lib/api/client'
import { userSchema } from '@/lib/api/models'
import { positiveId } from '@/lib/utils'

/** 用户资料仅按公开契约映射，不把头像文件系统路径转成 URL。 */
export async function getUser(id: string, signal?: AbortSignal) {
  return z
    .object({ userInfo: userSchema })
    .parse(await request(`/userinfo/${positiveId(id)}`, { signal })).userInfo
}

/** 账户字段按不同后端操作分别提交，不假定存在通用 PATCH。 */
export function updateUser(
  id: string,
  action: 'modifyUsername' | 'modifySignature' | 'modifyEmail' | 'modifyPassword',
  body: Record<string, unknown>,
) {
  return request(`/userinfo/${positiveId(id)}/${action}`, { method: 'POST', body })
}

/** 新头像始终归当前认证用户，文件字段固定为 avatar。 */
export function uploadAvatar(file: File) {
  const form = new FormData()
  form.set('avatar', file)
  return request<{ avatarUrl: string }>('/user/profile/avatar', { method: 'PUT', body: form })
}

/** 关注使用真实列表 ID，目标 ID 传入历史命名字段 followerUserId。 */
export function followUser(userId: string, targetId: string, listId: string) {
  return request<FollowRelation>(`/${positiveId(userId)}/follow`, {
    method: 'POST',
    body: { followerUserId: positiveId(targetId), followListId: positiveId(listId) },
  })
}
/** 取消关注仅使用已知的目标 ID。 */
export function unfollowUser(userId: string, targetId: string) {
  return request(`/${positiveId(userId)}/follow`, {
    method: 'PUT',
    body: { followedUserId: positiveId(targetId) },
  })
}
/** 0 仅表示读取全部关注；条目不需要使用邮箱或生日。 */
export function getFollowing(userId: string, listId: string, page = 1, signal?: AbortSignal) {
  return request<{
    followeeInfo: {
      userId: string
      followListId: string
      username: string
      avatarPath: string
      signature: string
    }[]
    total: string
  }>(
    `/${positiveId(userId)}/followList?${new URLSearchParams({ follow_list_id: listId === '0' ? '0' : positiveId(listId), page_num: String(page), page_size: '20' })}`,
    { signal },
  )
}

export type FollowList = { followListId: string; userId: string; name: string; isDefault: boolean }
export type FollowRelation = { isFollowing: boolean; followListId: string }

/** 查询本人列表，默认组取服务端返回值。 */
export function getFollowLists(signal?: AbortSignal) {
  return request<{ lists: FollowList[] }>('/follow-lists', { signal })
}
/** 创建普通列表并返回持久化 ID。 */
export function createFollowList(name: string) {
  return request<{ followListId: string }>('/follow-lists', { method: 'POST', body: { name } })
}
/** 修改本人列表名称。 */
export function renameFollowList(id: string, name: string) {
  return request(`/follow-lists/${positiveId(id)}`, { method: 'PATCH', body: { name } })
}
/** 删除列表及其中关注关系；由后端保证整批提交。 */
export function deleteFollowLists(ids: string[]) {
  return request('/follow-lists/batch-delete', {
    method: 'POST',
    body: { idList: ids.map(positiveId) },
  })
}
/** 切换默认组，不移动原关系。 */
export function setDefaultFollowList(id: string) {
  return request(`/follow-lists/${positiveId(id)}/default`, { method: 'PUT', body: {} })
}
/** 查询目标与当前登录用户的关系。 */
export function getFollowRelation(target: string, signal?: AbortSignal) {
  return request<FollowRelation>(`/follow/relations/${positiveId(target)}`, { signal })
}
/** 只移动已有关系，不发起第二次关注。 */
export function moveFollowee(target: string, listId: string) {
  return request(`/follow/relations/${positiveId(target)}/list`, {
    method: 'PUT',
    body: { followListId: positiveId(listId) },
  })
}
