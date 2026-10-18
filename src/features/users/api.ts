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
  action:
    'modifyUsername' | 'modifySignature' | 'modifyEmail' | 'modifyPassword' | 'forgetPassword',
  body: Record<string, unknown>,
) {
  return request(`/userinfo/${positiveId(id)}/${action}`, { method: 'POST', body })
}

/** 头像首次上传与已登录替换分别使用后端约定路由。 */
export function uploadAvatar(file: File, userId?: string) {
  const form = new FormData()
  form.set('avatar', file)
  return request<{ filePath?: string }>(
    userId ? `/${positiveId(userId)}/profile/avatar` : '/user/profile/avatar',
    { method: userId ? 'PUT' : 'POST', auth: !!userId, body: form },
  )
}

/** 关注接口暂缺默认列表发现契约，页面不猜测 followListId。 */
export function followUser(userId: string, targetId: string, listId: string) {
  return request(`/${positiveId(userId)}/follow`, {
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
/** 关注摘要没有用户 ID，调用者不可按姓名伪造主页链接。 */
export function getFollowing(userId: string, listId: string, page = 1) {
  return request(
    `/${positiveId(userId)}/followList?${new URLSearchParams({ follow_list_id: positiveId(listId), page_num: String(page), page_size: '12' })}`,
  )
}
