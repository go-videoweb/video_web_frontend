import { z } from 'zod'
import { request } from '@/lib/api/client'
import { commentSchema } from '@/lib/api/models'
import { positiveId } from '@/lib/utils'

const cursorSchema = z.object({
  videoId: z.string(),
  rootId: z.string(),
  sortBy: z.string(),
  order: z.string(),
  commentId: z.string(),
  createdAt: z.string().nullish(),
  upvoteCount: z.string(),
})
type Cursor = z.infer<typeof cursorSchema>
export type CommentSort = 'created_at' | 'cnt_upvote'

function params(sort: CommentSort, order: 'asc' | 'desc', cursor?: Cursor) {
  const query = new URLSearchParams({ sort_by: sort, order })
  if (cursor) {
    for (const [k, v] of Object.entries(cursor))
      if (v != null) query.set('cursor.' + k.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase()), v)
  }
  return query
}
const page = z.object({ nextCursor: cursorSchema.nullish(), hasMore: z.boolean().default(false) })

/** 主评论使用服务端游标，不把时间戳转换成 Date 以免丢精度。 */
export async function getComments(
  id: string,
  sort: CommentSort,
  cursor?: Cursor,
  signal?: AbortSignal,
) {
  return page
    .extend({ comments: z.array(commentSchema).default([]), totalCount: z.number().default(0) })
    .parse(
      await request(`/video/${positiveId(id)}/comment?${params(sort, 'desc', cursor)}`, { signal }),
    )
}

/** 回复以主评论为根读取整个楼层。 */
export async function getReplies(
  id: string,
  rootId: string,
  cursor?: Cursor,
  signal?: AbortSignal,
) {
  return page
    .extend({ replies: z.array(commentSchema).default([]) })
    .parse(
      await request(
        `/video/${positiveId(id)}/comments/${positiveId(rootId)}/replies?${params('created_at', 'asc', cursor)}`,
        { signal },
      ),
    )
}

/** 主评论 parentId=-1；楼内回复使用直接回复对象的 ID。 */
export function postComment(id: string, content: string, parentId = '-1') {
  return request<{ commentId: string }>(`/video/${positiveId(id)}/comment`, {
    method: 'POST',
    body: { content, parentId },
  })
}

/** 显式提交目标状态，响应中的布尔值和计数是真值。 */
export function upvoteComment(id: string, commentId: string, liked: boolean) {
  return request<{ isUpvoted: boolean; upvoteCount: string }>(
    `/video/${positiveId(id)}/comment/${positiveId(commentId)}/upvote`,
    { method: 'PUT', body: { liked } },
  )
}
