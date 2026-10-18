import { z } from 'zod'
import { request } from '@/lib/api/client'
import { commentSchema } from '@/lib/api/models'
import { positiveId } from '@/lib/utils'

/** 评论列表按当前服务支持的时间/点赞排序读取。 */
export async function getComments(
  videoId: string,
  page: number,
  sort: 'created_at' | 'cnt_upvote',
  signal?: AbortSignal,
) {
  return z
    .object({ comments: z.array(commentSchema).default([]), totalCount: z.number().default(0) })
    .parse(
      await request(
        `/video/${positiveId(videoId)}/comment?${new URLSearchParams({ page_num: String(page), page_size: '10', sort_by: sort, order: 'desc' })}`,
        { signal },
      ),
    )
}
/** 回复由展开动作触发，不为每条评论预加载。 */
export async function getReplies(videoId: string, commentId: string, page = 1) {
  return z
    .object({ replies: z.array(commentSchema).default([]) })
    .parse(
      await request(
        `/video/${positiveId(videoId)}/comments/${positiveId(commentId)}/replies?${new URLSearchParams({ page_num: String(page), page_size: '10', sort_by: 'created_at', order: 'asc' })}`,
      ),
    ).replies
}
/** 根评论 parentId=0；提交失败时由组件保留草稿。 */
export function postComment(videoId: string, content: string, parentId = '0') {
  return request<{ commentId: string }>(`/video/${positiveId(videoId)}/comment`, {
    method: 'POST',
    body: { content, parentId },
  })
}
/** 点赞方向由后端当前状态决定，避免依赖不可靠的前端默认值。 */
export function upvoteComment(videoId: string, commentId: string) {
  return request<{ message?: string }>(
    `/video/${positiveId(videoId)}/comment/${positiveId(commentId)}/upvote`,
    { method: 'PUT', body: {} },
  )
}
