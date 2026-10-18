import { Link } from '@tanstack/react-router'
import { Eye, MessageSquare, ImageOff } from 'lucide-react'
import { useState } from 'react'
import type { VideoSummary } from '@/lib/api/models'
import { mediaUrl } from '@/lib/api/media'
import { formatCount, formatDate } from '@/lib/utils'

/** 视频封面统一走媒体接口，不依赖后端磁盘路径。 */
export function VideoCard({ video, index = 0 }: { video: VideoSummary; index?: number }) {
  const [failed, setFailed] = useState(false)
  return (
    <article className="video-card">
      <Link
        to="/watch/$videoId"
        params={{ videoId: video.videoId }}
        className="video-link"
        preload={false}
      >
        <div className="video-thumbnail">
          {failed ? (
            <span className="image-fallback">
              <ImageOff size={26} />
            </span>
          ) : (
            <img
              src={mediaUrl(video.videoId, 'cover')}
              alt={video.title}
              loading={index < 3 ? 'eager' : 'lazy'}
              onError={() => setFailed(true)}
            />
          )}
          <span className="video-duration">{video.duration || '--:--'}</span>
        </div>
        <div className="video-card-body">
          <div className="video-author-avatar">{video.publisherName.slice(0, 1) || 'V'}</div>
          <div className="video-card-copy">
            <h2>{video.title || '未命名视频'}</h2>
            <p className="video-author">{video.publisherName || '创作者'}</p>
            <div className="video-meta">
              <span>
                <Eye size={13} />
                {formatCount(video.cntViewed)}
              </span>
              <span>
                <MessageSquare size={12} />
                {formatCount(video.cntBarrages)}
              </span>
              <span className="video-date">{formatDate(video.createdTime)}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

/** 加载占位与实际卡片同尺寸，避免内容跳动。 */
export function VideoSkeleton() {
  return (
    <div className="video-card skeleton-card" aria-hidden="true">
      <div className="video-thumbnail skeleton" />
      <div className="skeleton-copy">
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton h-3 w-2/5" />
        <div className="skeleton h-3 w-3/5" />
      </div>
    </div>
  )
}
