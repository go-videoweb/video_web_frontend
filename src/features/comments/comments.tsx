import { Link } from '@tanstack/react-router'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ThumbsUp, Send, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from '@/features/auth/session'
import { getUser } from '@/features/users/api'
import { Avatar } from '@/components/layout/shell'
import { LoadNext } from '@/components/load-next'
import { Button } from '@/components/ui/button'
import { ErrorState, Loading } from '@/components/states'
import type { Comment } from '@/lib/api/models'
import { errorMessage } from '@/lib/api/client'
import { formatCount, formatDate, publicImage } from '@/lib/utils'
import { getComments, getReplies, postComment, upvoteComment, type CommentSort } from './api'

function unique(items: Comment[]) {
  return [...new Map(items.map((item) => [item.commentId, item])).values()]
}

/** 评论与回复分别管理游标，排序切换不会复用旧楼层状态。 */
export function Comments({ videoId }: { videoId: string }) {
  const current = useSession()
  if (!current)
    return (
      <section className="comments-section">
        <h2>评论</h2>
        <p className="comment-login">
          <Link to="/login" search={{ redirect: `/watch/${videoId}` }}>
            登录
          </Link>
          后，参与评论与讨论。
        </p>
      </section>
    )
  return (
    <CommentList key={videoId + ':' + current.userId} videoId={videoId} userId={current.userId} />
  )
}
function CommentList({ videoId, userId }: { videoId: string; userId: string }) {
  const [sort, setSort] = useState<CommentSort>('created_at')
  const client = useQueryClient()
  const key = ['comments', userId, videoId, sort] as const
  const query = useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam, signal }) => getComments(videoId, sort, pageParam ?? undefined, signal),
    initialPageParam: undefined as Awaited<ReturnType<typeof getComments>>['nextCursor'],
    getNextPageParam: (page) => (page.hasMore ? (page.nextCursor ?? undefined) : undefined),
  })
  return (
    <section className="comments-section" aria-label="评论">
      <div className="section-heading">
        <h2>
          评论<span>{query.data?.pages[0]?.totalCount ?? ''}</span>
        </h2>
        <select
          aria-label="评论排序"
          value={sort}
          onChange={(event) => {
            const next = event.target.value as CommentSort
            if (next !== sort) {
              void client.resetQueries({
                queryKey: ['comments', userId, videoId, next],
                exact: true,
              })
              setSort(next)
            }
          }}
        >
          <option value="created_at">最新发布</option>
          <option value="cnt_upvote">最多点赞</option>
        </select>
      </div>
      <CommentForm
        videoId={videoId}
        onSuccess={() => void client.resetQueries({ queryKey: ['comments', userId, videoId] })}
      />
      {query.isPending ? (
        <Loading />
      ) : query.isError && !query.data ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : (
        <>
          {unique(query.data?.pages.flatMap((page) => page.comments) ?? []).map((item) => (
            <Thread
              key={sort + ':' + item.commentId}
              item={item}
              videoId={videoId}
              userId={userId}
            />
          ))}
          {!query.data?.pages[0]?.comments.length && (
            <div className="comment-empty">
              <MessageSquare size={24} />
              还没有评论
            </div>
          )}
          {query.isFetchNextPageError && <p role="alert">{errorMessage(query.error)}</p>}
          {query.hasNextPage && (
            <LoadNext
              label="加载更多评论"
              busy={query.isFetching}
              manual={query.isFetchNextPageError}
              load={query.fetchNextPage}
            />
          )}
        </>
      )}
    </section>
  )
}

function CommentForm({
  videoId,
  parentId = '-1',
  onSuccess,
}: {
  videoId: string
  parentId?: string
  onSuccess: () => void
}) {
  const [content, setContent] = useState('')
  const size = Array.from(content).length
  const root = parentId === '-1'
  const mutation = useMutation({
    mutationFn: () => postComment(videoId, content.trim(), parentId),
    onSuccess: () => {
      setContent('')
      toast.success('评论已发布')
      onSuccess()
    },
    onError: (error) => toast.error(errorMessage(error)),
  })
  return (
    <form
      className="comment-form"
      onSubmit={(event) => {
        event.preventDefault()
        if (content.trim() && size <= 5000 && !mutation.isPending) mutation.mutate()
      }}
    >
      <textarea
        aria-label={root ? '发表评论' : '回复评论'}
        placeholder={root ? '分享你的想法' : '写下你的回复'}
        value={content}
        rows={root ? 3 : 2}
        onChange={(event) => setContent(event.target.value)}
      />
      <div className="comment-form-footer">
        <span>{size}/5000</span>
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || size > 5000 || mutation.isPending}
        >
          <Send size={14} />
          {root ? '发布评论' : '发布回复'}
        </Button>
      </div>
    </form>
  )
}

function Thread({ item, videoId, userId }: { item: Comment; videoId: string; userId: string }) {
  const [expanded, setExpanded] = useState(false)
  const [added, setAdded] = useState(0)
  const client = useQueryClient()
  const key = ['replies', userId, videoId, item.commentId] as const
  const query = useInfiniteQuery({
    queryKey: key,
    enabled: expanded,
    queryFn: ({ pageParam, signal }) =>
      getReplies(videoId, item.commentId, pageParam ?? undefined, signal),
    initialPageParam: undefined as Awaited<ReturnType<typeof getReplies>>['nextCursor'],
    getNextPageParam: (page) => (page.hasMore ? (page.nextCursor ?? undefined) : undefined),
  })
  const posted = () => {
    setExpanded(true)
    setAdded((n) => n + 1)
    void client.resetQueries({ queryKey: key })
  }
  return (
    <>
      <CommentItem item={item} videoId={videoId} posted={posted} />
      <div className="replies-list">
        {(item.cntReplies + added > 0 || expanded) && (
          <button
            className="replies-toggle"
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '收起回复' : `${item.cntReplies + added} 条回复`}
          </button>
        )}
        {expanded &&
          (query.isPending ? (
            <Loading />
          ) : query.isError && !query.data ? (
            <ErrorState error={query.error} retry={() => void query.refetch()} />
          ) : (
            <>
              {unique(query.data?.pages.flatMap((page) => page.replies) ?? []).map((reply) => (
                <CommentItem key={reply.commentId} item={reply} videoId={videoId} posted={posted} />
              ))}
              {query.isFetchNextPageError && <p role="alert">{errorMessage(query.error)}</p>}
              {query.hasNextPage && (
                <LoadNext
                  label="加载更多回复"
                  busy={query.isFetching}
                  manual={query.isFetchNextPageError}
                  load={query.fetchNextPage}
                />
              )}
            </>
          ))}
      </div>
    </>
  )
}

function CommentItem({
  item,
  videoId,
  posted,
}: {
  item: Comment
  videoId: string
  posted: () => void
}) {
  const [reply, setReply] = useState(false)
  const [reaction, setReaction] = useState<{ isUpvoted: boolean; upvoteCount: string }>()
  const author = useQuery({
    queryKey: ['user', item.publisherId],
    queryFn: ({ signal }) => getUser(item.publisherId, signal),
    staleTime: 300_000,
  })
  const name = author.data?.userName || `用户 ${item.publisherId.slice(-6)}`
  const liked = reaction?.isUpvoted ?? item.isUpvoted
  const action = useMutation({
    mutationFn: () => upvoteComment(videoId, item.commentId, !liked),
    onSuccess: setReaction,
    onError: (error) => toast.error(errorMessage(error)),
  })
  return (
    <article className="comment-item">
      <Avatar name={name} src={publicImage(author.data?.avatarPath)} />
      <div className="comment-content">
        <Link className="comment-author" to="/users/$userId" params={{ userId: item.publisherId }}>
          {name}
        </Link>
        {item.reference && (
          <blockquote className="comment-text line-clamp-2">
            {item.reference.unavailable ? '原评论不可用' : item.reference.content}
          </blockquote>
        )}
        <p className="comment-text">{item.content}</p>
        <div className="comment-actions">
          <time>{formatDate(item.createdAt)}</time>
          <button
            type="button"
            aria-pressed={liked}
            aria-label={liked ? '取消点赞评论' : '点赞评论'}
            disabled={action.isPending}
            onClick={() => action.mutate()}
          >
            <ThumbsUp size={14} />
            {formatCount(reaction?.upvoteCount ?? item.upvoteCount)}
          </button>
          <button type="button" onClick={() => setReply(!reply)}>
            回复
          </button>
        </div>
        {reply && (
          <CommentForm
            videoId={videoId}
            parentId={item.commentId}
            onSuccess={() => {
              setReply(false)
              posted()
            }}
          />
        )}
      </div>
    </article>
  )
}
