import { Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, MessageSquare, Send, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from '@/features/auth/session'
import { getUser } from '@/features/users/api'
import { Avatar } from '@/components/layout/shell'
import { Button } from '@/components/ui/button'
import { ErrorState, Loading } from '@/components/states'
import type { Comment } from '@/lib/api/models'
import { errorMessage } from '@/lib/api/client'
import { formatCount, formatDate, publicImage } from '@/lib/utils'
import { getComments, getReplies, postComment, upvoteComment } from './api'

/** 评论读取严格遵守登录策略，提交成功只刷新当前视频评论。 */
export function Comments({ videoId }: { videoId: string }) {
  const current = useSession()
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<'created_at' | 'cnt_upvote'>('created_at')
  const query = useQuery({
    queryKey: ['comments', current?.userId, videoId, page, sort],
    queryFn: ({ signal }) => getComments(videoId, page, sort, signal),
    enabled: !!current,
  })
  return (
    <section className="comments-section" aria-label="评论">
      <div className="section-heading">
        <h2>
          评论<span>{query.data?.totalCount ?? ''}</span>
        </h2>
        {current && (
          <select
            aria-label="评论排序"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as typeof sort)
              setPage(1)
            }}
          >
            <option value="created_at">最新发布</option>
            <option value="cnt_upvote">最多点赞</option>
          </select>
        )}
      </div>
      {!current ? (
        <p className="comment-login">
          <Link to="/login" search={{ redirect: `/watch/${videoId}` }}>
            登录
          </Link>
          后，参与评论与讨论。
        </p>
      ) : (
        <>
          <CommentForm videoId={videoId} onSuccess={() => setPage(1)} />
          {query.isPending ? (
            <Loading />
          ) : query.isError ? (
            <ErrorState
              error={query.error}
              retry={() => {
                void query.refetch()
              }}
            />
          ) : (
            <>
              {query.data.comments.length ? (
                query.data.comments.map((comment) => (
                  <CommentItem key={comment.commentId} comment={comment} videoId={videoId} />
                ))
              ) : (
                <div className="comment-empty">
                  <MessageSquare size={24} />
                  <p>还没有评论，来聊聊你的感受吧。</p>
                </div>
              )}
              {query.data.totalCount > 10 && (
                <div className="pagination">
                  <span>第 {page} 页</span>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="评论上一页"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="评论下一页"
                      disabled={page * 10 >= query.data.totalCount}
                      onClick={() => setPage(page + 1)}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}

function CommentForm({
  videoId,
  parentId = '0',
  onSuccess,
}: {
  videoId: string
  parentId?: string
  onSuccess?: () => void
}) {
  const current = useSession()
  const client = useQueryClient()
  const [content, setContent] = useState('')
  const mutation = useMutation({
    mutationFn: () => postComment(videoId, content.trim(), parentId),
    onSuccess: () => {
      setContent('')
      void client.invalidateQueries({ queryKey: ['comments', current?.userId, videoId] })
      void client.invalidateQueries({ queryKey: ['replies', current?.userId, videoId] })
      toast.success('评论已发布')
      onSuccess?.()
    },
    onError: (error) => toast.error(errorMessage(error)),
  })
  return (
    <form
      className="comment-form"
      onSubmit={(event) => {
        event.preventDefault()
        if (content.trim()) mutation.mutate()
      }}
    >
      <textarea
        aria-label={parentId === '0' ? '发表评论' : '回复评论'}
        placeholder={parentId === '0' ? '分享你的想法，友善交流…' : '写下你的回复…'}
        value={content}
        maxLength={1000}
        onChange={(event) => setContent(event.target.value)}
        rows={parentId === '0' ? 3 : 2}
      />
      <div className="comment-form-footer">
        <span>{content.length}/1000</span>
        <Button type="submit" size="sm" disabled={!content.trim() || mutation.isPending}>
          <Send size={14} />
          {mutation.isPending ? '发布中' : parentId === '0' ? '发布评论' : '发布回复'}
        </Button>
      </div>
    </form>
  )
}

function CommentItem({
  videoId,
  comment,
  reply = false,
}: {
  videoId: string
  comment: Comment
  reply?: boolean
}) {
  const current = useSession()
  const [expanded, setExpanded] = useState(false)
  const [replying, setReplying] = useState(false)
  const [page, setPage] = useState(1)
  const client = useQueryClient()
  const author = useQuery({
    queryKey: ['user', comment.publisherId],
    queryFn: ({ signal }) => getUser(comment.publisherId, signal),
    enabled: !!current,
    staleTime: 300_000,
  })
  const replies = useQuery({
    queryKey: ['replies', current?.userId, videoId, comment.commentId, page],
    queryFn: () => getReplies(videoId, comment.commentId, page),
    enabled: expanded && !reply,
  })
  const upvote = useMutation({
    mutationFn: () => upvoteComment(videoId, comment.commentId),
    onSuccess: (data) => {
      toast.success(data.message || '操作成功')
      void client.invalidateQueries({ queryKey: ['comments', current?.userId, videoId] })
      void client.invalidateQueries({ queryKey: ['replies', current?.userId, videoId] })
    },
    onError: (error) => toast.error(errorMessage(error)),
  })
  return (
    <article className="comment-item">
      <Avatar name={author.data?.userName || 'V'} src={publicImage(author.data?.avatarPath)} />
      <div className="comment-content">
        <Link
          className="comment-author"
          to="/users/$userId"
          params={{ userId: comment.publisherId }}
        >
          {author.data?.userName || `用户 ${comment.publisherId.slice(-6)}`}
        </Link>
        <p className="comment-text">{comment.content}</p>
        <div className="comment-actions">
          <time>{formatDate(comment.createdAt)}</time>
          <button
            type="button"
            disabled={upvote.isPending}
            onClick={() => upvote.mutate()}
            aria-label="点赞或取消点赞评论"
          >
            <ThumbsUp size={14} />
            {formatCount(comment.upvoteCount)}
          </button>
          <button type="button" onClick={() => setReplying(!replying)}>
            回复
          </button>
        </div>
        {replying && (
          <CommentForm
            videoId={videoId}
            parentId={comment.commentId}
            onSuccess={() => {
              setReplying(false)
              setExpanded(true)
            }}
          />
        )}
        {!reply && comment.cntReplies > 0 && (
          <button className="replies-toggle" onClick={() => setExpanded(!expanded)}>
            <ChevronDown size={14} />
            {expanded ? '收起回复' : `${comment.cntReplies} 条回复`}
          </button>
        )}
        {expanded && !reply && (
          <div className="replies-list">
            {replies.isPending ? (
              <Loading />
            ) : replies.isError ? (
              <p className="field-error">{errorMessage(replies.error)}</p>
            ) : (
              <>
                {replies.data?.map((item) => (
                  <CommentItem key={item.commentId} videoId={videoId} comment={item} reply />
                ))}
                {(page > 1 || (replies.data?.length || 0) >= 10) && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      上一页
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={(replies.data?.length || 0) < 10}
                      onClick={() => setPage(page + 1)}
                    >
                      下一页
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
