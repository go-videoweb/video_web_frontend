import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { errorMessage } from '@/lib/api/client'
import { formatCount } from '@/lib/utils'
import { getBarrages, upvoteBarrage, type Barrage } from './api'

/** 读取播放器所在的 60 秒区间；跳转隔离旧请求与分页结果。 */
export function BarragePanel({
  videoId,
  userId,
  second,
}: {
  videoId: string
  userId: string
  second: number
}) {
  const [open, setOpen] = useState(true)
  const start = Math.floor(second / 60) * 60
  const client = useQueryClient()
  const key = ['barrages', userId, videoId, start] as const
  const query = useInfiniteQuery({
    queryKey: key,
    enabled: open,
    queryFn: ({ pageParam, signal }) =>
      getBarrages(videoId, start, start + 60, pageParam ?? undefined, signal),
    initialPageParam: null as Awaited<ReturnType<typeof getBarrages>>['nextCursor'],
    getNextPageParam: (page) => (page.hasMore ? (page.nextCursor ?? undefined) : undefined),
  })
  const items = [
    ...new Map(
      query.data?.pages.flatMap((page) =>
        page.barrages.map((item) => [item.barrageId, item] as const),
      ),
    ).values(),
  ]
  const like = useMutation({
    mutationFn: (item: Barrage) => upvoteBarrage(videoId, item.barrageId, !item.isUpvoted),
    onSuccess: (result, item) =>
      client.setQueryData<typeof query.data>(
        key,
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              barrages: page.barrages.map((v) =>
                v.barrageId === item.barrageId ? { ...v, ...result } : v,
              ),
            })),
          },
      ),
  })
  const visible = items
    .filter((item) => item.positionSecond <= second && item.positionSecond >= second - 3)
    .slice(-3)
  return (
    <section className="settings-section" aria-label="当前区间弹幕">
      <div className="section-heading">
        <h2>
          弹幕 · {start}–{start + 60} 秒
        </h2>
        <Button size="sm" variant="ghost" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? '收起' : '展开'}
        </Button>
      </div>
      {open && (
        <>
          {visible.length > 0 && (
            <div className="barrage-caption">
              {visible.map((item) => (
                <span key={item.barrageId}>{item.content}</span>
              ))}
            </div>
          )}
          {query.isPending ? (
            <p>正在加载弹幕</p>
          ) : !items.length && !query.isError ? (
            <p>这个区间还没有弹幕。</p>
          ) : null}
          {(query.isError || like.isError) && (
            <p role="alert">{errorMessage(query.error ?? like.error)}</p>
          )}
          <ul className="barrage-list">
            {items.map((item) => (
              <li key={item.barrageId}>
                <time>{item.positionSecond} 秒</time>
                <span>{item.content}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={item.isUpvoted ? '取消点赞弹幕' : '点赞弹幕'}
                  aria-pressed={item.isUpvoted}
                  disabled={like.isPending}
                  onClick={() => like.mutate(item)}
                >
                  <ThumbsUp size={14} />
                  {formatCount(item.upvoteCount)}
                </Button>
              </li>
            ))}
          </ul>
          {query.hasNextPage && (
            <Button
              size="sm"
              variant="outline"
              disabled={query.isFetching}
              onClick={() => void query.fetchNextPage()}
            >
              更多弹幕
            </Button>
          )}
          {query.isError && !query.hasNextPage && (
            <Button size="sm" variant="outline" onClick={() => void query.refetch()}>
              重试读取
            </Button>
          )}
        </>
      )}
    </section>
  )
}
