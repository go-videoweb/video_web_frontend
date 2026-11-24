import { ErrorCode } from '@/lib/api/error-codes'
import { http, HttpResponse } from 'msw'
import type { Favorite } from '@/features/favorites/api'
import type { FollowList } from '@/features/users/api'
import { demoUserId, demoVideos } from './fixtures'

const base = '*/api/v1'
const folders: Favorite[] = [
  { favoriteId: '9007199254770001', favoriteName: '默认收藏夹', description: '', isPrivate: false },
]
const relations = new Map<string, { favoriteId: string; favoriteRecordId: string }>()
const groups: FollowList[] = [
  { followListId: '9007199254780001', userId: demoUserId, name: '默认分组', isDefault: true },
]
const following = new Map<string, string>()
let serial = 9007199254790000n
const next = () => String(++serial)
const body = (request: Request) => request.json() as Promise<Record<string, unknown>>
const ok = { statusCode: 200, message: '操作成功' }
const error = (code: number, reason: string, message: string) =>
  HttpResponse.json({ code, reason, message })

/** 演示详情回读当前收藏关系，不模拟为固定未收藏。 */
export function demoFavoriteState(videoId: string) {
  return relations.get(videoId)
}
function protectedHandler(request: Request) {
  return (
    request.headers.get('Authorization') === 'Bearer demo-access' &&
    request.headers.get('Refresh-Token') === 'Bearer demo-refresh'
  )
}

/** 演示列表和关系保存在当前页面，覆盖真实契约形状而非数据库语义。 */
export const socialHandlers = [
  http.get(`${base}/favorites/list`, ({ request }) =>
    protectedHandler(request)
      ? HttpResponse.json({ userId: demoUserId, favoriteList: folders })
      : error(ErrorCode.TokenMissing, 'token缺失', '请先登录'),
  ),
  http.post(`${base}/favorites`, async ({ request }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    const data = await body(request)
    const favoriteId = next()
    folders.push({
      favoriteId,
      favoriteName: String(data.favoritesName ?? ''),
      description: String(data.description ?? ''),
      isPrivate: data.isPrivate === -1,
    })
    return HttpResponse.json({ statusCode: 200, msg: '操作成功', favoriteId })
  }),
  http.patch(`${base}/favorites/:id`, async ({ request, params }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    const item = folders.find((folder) => folder.favoriteId === params.id)
    if (!item) return error(ErrorCode.UserFavoriteNotFound, 'FAVORITE_NOT_FOUND', '收藏夹不存在')
    const data = await body(request)
    if (typeof data.favoritesName === 'string') item.favoriteName = data.favoritesName
    if (typeof data.description === 'string') item.description = data.description
    if (data.isPrivate === 1 || data.isPrivate === -1) item.isPrivate = data.isPrivate === -1
    return HttpResponse.json({ statusCode: 200, msg: '操作成功' })
  }),
  http.delete(`${base}/favorites/:id`, ({ request, params }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    const index = folders.findIndex((folder) => folder.favoriteId === params.id)
    if (index < 0)
      return error(ErrorCode.UserFavoriteNotFound, 'FAVORITE_NOT_FOUND', '收藏夹不存在')
    if ([...relations.values()].some((item) => item.favoriteId === params.id))
      return error(ErrorCode.FavoriteNotEmpty, '收藏夹不为空', '收藏夹非空')
    folders.splice(index, 1)
    return HttpResponse.json({ statusCode: 200, msg: '操作成功' })
  }),
  http.get(`${base}/favorites/:id/videos`, ({ request, params }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    if (!folders.some((item) => item.favoriteId === params.id))
      return error(ErrorCode.FavoriteNotFound, 'FAVORITE_NOT_FOUND', '收藏夹不存在')
    const pageNum = Number(new URL(request.url).searchParams.get('page_num') ?? '1')
    const items = demoVideos.filter(
      (video) => relations.get(video.videoId)?.favoriteId === params.id,
    )
    return HttpResponse.json({
      videos: items
        .slice((pageNum - 1) * 20, pageNum * 20)
        .map((video) => ({ video, collectedAt: null })),
      total: String(items.length),
      pageNum,
      pageSize: 20,
    })
  }),
  http.put(`${base}/video/interaction/:id/favorite`, async ({ request, params }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    const data = await body(request)
    const id = String(params.id)
    const current = relations.get(id)
    const favoriteId = String(data.favoriteId)
    if (!folders.some((item) => item.favoriteId === favoriteId))
      return error(ErrorCode.FavoriteNotFound, 'FAVORITE_NOT_FOUND', '收藏夹不存在')
    if (current && current.favoriteId !== favoriteId)
      return error(
        ErrorCode.VideoAlreadyFavorited,
        'VIDEO_ALREADY_FAVORITED',
        '视频已在其他收藏夹中',
      )
    if (data.favorite === 1) {
      const state = current ?? { favoriteId, favoriteRecordId: next() }
      relations.set(id, state)
      return HttpResponse.json({ ...ok, ...state, isFavorited: true })
    }
    if (current && current.favoriteRecordId !== data.favoriteRecordId)
      return error(ErrorCode.FavoriteRecordChanged, 'FAVORITE_RECORD_CHANGED', '收藏记录已变化')
    relations.delete(id)
    return HttpResponse.json({ ...ok, isFavorited: false, favoriteId: '0', favoriteRecordId: '0' })
  }),
  http.get(`${base}/follow-lists`, ({ request }) =>
    protectedHandler(request)
      ? HttpResponse.json({ lists: groups })
      : error(ErrorCode.TokenMissing, 'token缺失', '请先登录'),
  ),
  http.post(`${base}/follow-lists`, async ({ request }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    const data = await body(request)
    const followListId = next()
    groups.push({ followListId, userId: demoUserId, name: String(data.name), isDefault: false })
    return HttpResponse.json({ followListId })
  }),
  http.patch(`${base}/follow-lists/:id`, async ({ request, params }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    const group = groups.find((item) => item.followListId === params.id)
    if (!group) return error(ErrorCode.FollowListNotFound, 'FOLLOW_LIST_NOT_FOUND', '分组不存在')
    group.name = String((await body(request)).name)
    return HttpResponse.json({ success: true })
  }),
  http.post(`${base}/follow-lists/batch-delete`, async ({ request }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    const ids = (await body(request)).idList as string[]
    if (groups.some((group) => group.isDefault && ids.includes(group.followListId)))
      return error(
        ErrorCode.DefaultFollowListDelete,
        'DEFAULT_FOLLOW_LIST_DELETE',
        '不能删除默认组',
      )
    for (let i = groups.length - 1; i >= 0; i--)
      if (ids.includes(groups[i]!.followListId)) groups.splice(i, 1)
    for (const [target, id] of following) if (ids.includes(id)) following.delete(target)
    return HttpResponse.json({ success: true })
  }),
  http.put(`${base}/follow-lists/:id/default`, ({ params, request }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    if (!groups.some((item) => item.followListId === params.id))
      return error(ErrorCode.FollowListNotFound, 'FOLLOW_LIST_NOT_FOUND', '分组不存在')
    groups.forEach((item) => {
      item.isDefault = item.followListId === params.id
    })
    return HttpResponse.json({ success: true })
  }),
  http.get(`${base}/follow/relations/:target`, ({ request, params }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    const id = following.get(String(params.target))
    return HttpResponse.json({ isFollowing: !!id, followListId: id ?? '0' })
  }),
  http.put(`${base}/follow/relations/:target/list`, async ({ params, request }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    const id = String((await body(request)).followListId)
    if (!groups.some((group) => group.followListId === id) || !following.has(String(params.target)))
      return error(ErrorCode.FollowNotFound, 'FOLLOW_NOT_FOUND', '关系或分组不存在')
    following.set(String(params.target), id)
    return HttpResponse.json({ success: true })
  }),
  http.post(`${base}/:user/follow`, async ({ request }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    const data = await body(request)
    const id = String(data.followListId)
    if (!groups.some((group) => group.followListId === id))
      return error(ErrorCode.FollowListNotFound, 'FOLLOW_LIST_NOT_FOUND', '分组不存在')
    following.set(String(data.followerUserId), id)
    return HttpResponse.json({ ...ok, isFollowing: true, followListId: id })
  }),
  http.put(`${base}/:user/follow`, async ({ request }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    following.delete(String((await body(request)).followedUserId))
    return HttpResponse.json(ok)
  }),
  http.get(`${base}/:user/followList`, ({ request }) => {
    if (!protectedHandler(request)) return error(ErrorCode.TokenMissing, 'token缺失', '请先登录')
    const search = new URL(request.url).searchParams
    const pageNum = Number(search.get('page_num') ?? '1')
    const group = search.get('follow_list_id')
    const rows = [...following].filter(([, id]) => group === '0' || group === id)
    return HttpResponse.json({
      ...ok,
      total: String(rows.length),
      pageNum,
      pageSize: 20,
      followeeInfo: rows.slice((pageNum - 1) * 20, pageNum * 20).map(([userId, followListId]) => ({
        userId,
        followListId,
        username:
          demoVideos.find((video) => video.publisherId === userId)?.publisherName ?? '演示创作者',
        avatarPath: '',
        signature: '',
      })),
    })
  }),
]
