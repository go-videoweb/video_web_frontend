import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ChevronLeft, ChevronRight, Compass, Flame, Grid2X2, LogIn } from 'lucide-react'
import { config, switchMode } from '@/lib/config'
import { useSession } from '@/features/auth/session'
import { getVideos } from '@/features/videos/api'
import { VideoCard, VideoSkeleton } from '@/features/videos/video-card'
import { EmptyState, ErrorState } from '@/components/states'
import { Button } from '@/components/ui/button'

/** 发现页用 URL 保存筛选与页码，不生成后端不存在的总页数。 */
export function Discover() {
  const { category, page } = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const current = useSession()
  const query = useQuery({
    queryKey: ['videos', current?.userId, category, page],
    queryFn: ({ signal }) => getVideos(category, page, signal),
    enabled: !!current,
  })
  return (
    <div className="page discover-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <Compass size={14} />
            发现新视角
          </div>
          <h1>
            发现<span className="heading-dot">.</span>
          </h1>
        </div>
        <span className="heading-side">
          <Flame size={16} />
          热门视频
        </span>
      </div>
      <div className="discovery-toolbar">
        <div className="category-tabs" aria-label="视频分类">
          {config.categories.map((value) => (
            <Link
              key={value}
              to="/"
              search={{ category: value, page: 1 }}
              className={value === category ? 'category-tab selected' : 'category-tab'}
            >
              {value}
            </Link>
          ))}
        </div>
        <span className="grid-indicator">
          <Grid2X2 size={17} />
          <span>探索</span>
        </span>
      </div>
      {!current ? (
        <div className="discovery-gate">
          <div className="gate-images">
            <img src="/assets/mountains.jpg" alt="山间景色" />
            <img src="/assets/architecture.jpg" alt="建筑与光影" />
            <img src="/assets/ocean.jpg" alt="海岸景色" />
          </div>
          <EmptyState
            title="每一种热爱，都值得被看见"
            description="登录后发现更多视频。"
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link to="/login" search={{ redirect: '/' }}>
                    <LogIn />
                    登录 VideoWeb
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => switchMode(true)}>
                  浏览演示
                  <ArrowRight />
                </Button>
              </div>
            }
          />
        </div>
      ) : query.isPending ? (
        <div className="video-grid">
          {Array.from({ length: 9 }, (_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      ) : query.isError ? (
        <ErrorState
          error={query.error}
          retry={() => {
            void query.refetch()
          }}
        />
      ) : !query.data?.length ? (
        <EmptyState
          title="这里还没有视频"
          description={page > 1 ? '已经浏览到最后一页了。' : '换个频道看看，或分享你的第一部作品。'}
          action={
            <Button
              variant="outline"
              onClick={() => {
                if (page > 1) void navigate({ search: { category, page: page - 1 } })
                else
                  void navigate({
                    search: {
                      category: config.categories.find((v) => v !== category) || category,
                      page: 1,
                    },
                  })
              }}
            >
              <ChevronLeft />
              {page > 1 ? '上一页' : '切换频道'}
            </Button>
          }
        />
      ) : (
        <>
          <div className="video-grid">
            {query.data.map((video, index) => (
              <VideoCard key={video.videoId} video={video} index={index} />
            ))}
          </div>
          <div className="pagination">
            <span>
              第 {page} 页 · 本页 {query.data.length} 部视频
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                aria-label="上一页"
                onClick={() => {
                  void navigate({ search: { category, page: page - 1 } })
                  window.scrollTo({ top: 0 })
                }}
              >
                <ChevronLeft />
              </Button>
              <span className="page-number">{page}</span>
              <Button
                variant="outline"
                size="icon"
                disabled={query.data.length < 12}
                aria-label="下一页"
                onClick={() => {
                  void navigate({ search: { category, page: page + 1 } })
                  window.scrollTo({ top: 0 })
                }}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
