import { Link, useParams } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Download,
  Eye,
  Gem,
  MessageSquare,
  Send,
  Share2,
  ThumbsUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { config } from '@/lib/config'
import {
  getVideo,
  getVideos,
  interact,
  shareVideo,
  downloadVideo,
  sendBarrage,
} from '@/features/videos/api'
import { useSession } from '@/features/auth/session'
import { getUser } from '@/features/users/api'
import { Comments } from '@/features/comments/comments'
import { Avatar } from '@/components/layout/shell'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { EmptyState, ErrorState, Loading } from '@/components/states'
import { errorMessage } from '@/lib/api/client'
import { mediaUrl } from '@/lib/api/media'
import { formatCount, formatDate, playbackTime, publicImage } from '@/lib/utils'

const Player = lazy(() =>
  import('@/features/player/player').then((module) => ({ default: module.Player })),
)

/** 观看页不预取详情，防止后台读取重复增加播放量。 */
export function Watch() {
  const { videoId } = useParams({ from: '/watch/$videoId' })
  const current = useSession()
  const time = useRef(0)
  const onTime = useCallback((seconds: number) => {
    time.current = seconds
  }, [])
  const query = useQuery({
    queryKey: ['video', current?.userId || 'guest', videoId],
    queryFn: ({ signal }) => getVideo(videoId, signal),
    staleTime: Infinity,
    refetchOnMount: false,
  })
  const author = useQuery({
    queryKey: ['user', query.data?.publisherId],
    queryFn: ({ signal }) => getUser(query.data!.publisherId, signal),
    enabled: !!query.data && !!current,
  })
  const related = useQuery({
    queryKey: ['videos', current?.userId, query.data?.classes[0], 1],
    queryFn: ({ signal }) =>
      getVideos(query.data?.classes[0] || config.categories[0] || '科技', 1, signal),
    enabled: !!query.data && !!current,
  })
  const [shells, setShells] = useState(false)
  const [shellCount, setShellCount] = useState(1)
  const [barrage, setBarrage] = useState('')
  const [color, setColor] = useState('#ffffff')
  const action = useMutation({
    mutationFn: async (kind: 'upvote' | 'shells' | 'share' | 'download' | 'barrage') => {
      if (kind === 'upvote') return (await interact(videoId, 'upvote')).message || '操作成功'
      if (kind === 'shells') {
        await interact(videoId, 'throwShells', { shells: shellCount })
        setShells(false)
        return '贝壳已送出'
      }
      if (kind === 'share') {
        await shareVideo(videoId)
        await navigator.clipboard.writeText(
          `${config.siteOrigin.replace(/\/$/, '')}/watch/${videoId}`,
        )
        return '分享链接已复制'
      }
      if (kind === 'download') {
        await downloadVideo(videoId)
        return '下载已开始'
      }
      await sendBarrage(videoId, barrage.trim(), playbackTime(time.current), color)
      setBarrage('')
      return '弹幕已发送'
    },
    onSuccess: (message) => toast.success(message),
    onError: (error) => toast.error(errorMessage(error)),
  })
  if (query.isPending) return <Loading />
  if (query.isError)
    return (
      <ErrorState
        error={query.error}
        retry={() => {
          void query.refetch()
        }}
      />
    )
  if (!query.data) return <EmptyState title="视频不存在" />
  const video = query.data
  return (
    <div className="page watch-page">
      <div className="watch-breadcrumb">
        <Link
          to="/"
          search={{ category: video.classes[0] || config.categories[0] || '科技', page: 1 }}
        >
          <ArrowLeft size={15} />
          发现
        </Link>
        <ChevronRight size={14} />
        <span>{video.classes[0] || '视频'}</span>
      </div>
      <div className="watch-layout">
        <div className="watch-primary">
          <Suspense
            fallback={
              <div className="player-wrap">
                <Loading />
              </div>
            }
          >
            <Player key={videoId} videoId={videoId} title={video.title} onTime={onTime} />
          </Suspense>
          {current && (
            <form
              className="barrage-form"
              onSubmit={(event) => {
                event.preventDefault()
                if (barrage.trim()) action.mutate('barrage')
              }}
            >
              <MessageSquare size={16} />
              <input
                aria-label="发送弹幕"
                placeholder="发一条友善的弹幕…"
                value={barrage}
                onChange={(event) => setBarrage(event.target.value)}
                maxLength={150}
              />
              <input
                type="color"
                aria-label="弹幕颜色"
                value={color}
                onChange={(event) => setColor(event.target.value)}
              />
              <Button size="sm" type="submit" disabled={!barrage.trim() || action.isPending}>
                <Send size={14} />
                发送
              </Button>
            </form>
          )}
          <div className="watch-title">
            {config.demo && (
              <small className="media-credit">
                <a href="https://durian.blender.org/sharing/" target="_blank" rel="noreferrer">
                  Sintel · © Blender Foundation · CC BY 3.0 · 18 秒节选转码
                </a>
              </small>
            )}
            <h1>{video.title}</h1>
            <div className="watch-meta">
              <span>
                <Eye size={14} />
                {formatCount(video.records.cntViewed)} 次观看
              </span>
              <span>
                <MessageSquare size={14} />
                {formatCount(video.records.cntBarrages)} 条弹幕
              </span>
              <time>{formatDate(video.createdTime)}</time>
            </div>
          </div>
          <div className="watch-actions">
            {current ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => action.mutate('upvote')}
                  disabled={action.isPending}
                  title="点赞或取消点赞"
                >
                  <ThumbsUp />
                  点赞
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShells(true)}
                  disabled={action.isPending}
                >
                  <Gem />
                  投贝壳
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => action.mutate('share')}
                  disabled={action.isPending}
                >
                  <Share2 />
                  分享
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => action.mutate('download')}
                  disabled={action.isPending}
                >
                  <Download />
                  下载
                </Button>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/login" search={{ redirect: `/watch/${videoId}` }}>
                  登录后参与互动
                  <ArrowUpRight />
                </Link>
              </Button>
            )}
          </div>
          {(video.description || video.tags.length > 0) && (
            <section className="video-description">
              <p>{video.description || '作者暂未填写简介。'}</p>
              <div className="video-tags">
                {video.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </section>
          )}
          <Comments videoId={videoId} />
        </div>
        <aside className="watch-aside">
          <div className="creator-block">
            <Link to="/users/$userId" params={{ userId: video.publisherId }}>
              <Avatar large name={video.publisherName} src={publicImage(author.data?.avatarPath)} />
            </Link>
            <div>
              <Link
                to="/users/$userId"
                params={{ userId: video.publisherId }}
                className="creator-name"
              >
                {video.publisherName || '创作者'}
                <ArrowUpRight size={14} />
              </Link>
              <p>{author.data?.signature || '用影像，记录生活。'}</p>
              {author.data && (
                <small>
                  {formatCount(author.data.cntFans)} 位粉丝 · {formatCount(author.data.cntVideos)}{' '}
                  部视频
                </small>
              )}
            </div>
          </div>
          {current && related.data && related.data.length > 1 && (
            <section className="related-section">
              <h2>继续探索</h2>
              {related.data
                .filter((item) => item.videoId !== videoId)
                .slice(0, 5)
                .map((item) => (
                  <Link
                    key={item.videoId}
                    to="/watch/$videoId"
                    params={{ videoId: item.videoId }}
                    className="related-video"
                    preload={false}
                  >
                    <img src={mediaUrl(item.videoId, 'cover')} alt="" loading="lazy" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.publisherName}</p>
                      <small>{formatCount(item.cntViewed)} 次观看</small>
                    </div>
                  </Link>
                ))}
            </section>
          )}
        </aside>
      </div>
      <Dialog open={shells} onOpenChange={setShells} title="送出一份支持">
        <div className="shell-dialog">
          <Gem size={42} />
          <p>为这部视频送出贝壳</p>
          <fieldset>
            <legend className="sr-only">贝壳数量</legend>
            {[1, 2].map((count) => (
              <label
                key={count}
                className={shellCount === count ? 'shell-option selected' : 'shell-option'}
              >
                <input
                  type="radio"
                  name="shells"
                  checked={shellCount === count}
                  onChange={() => setShellCount(count)}
                />
                {count} 枚
              </label>
            ))}
          </fieldset>
          <Button disabled={action.isPending} onClick={() => action.mutate('shells')}>
            确认送出
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
