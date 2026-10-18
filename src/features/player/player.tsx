import { useEffect, useRef, useState } from 'react'
import type { MediaPlayerClass } from 'dashjs'
import { AlertCircle, LoaderCircle, RefreshCw } from 'lucide-react'
import { mediaUrl } from '@/lib/api/media'
import { Button } from '@/components/ui/button'

/** 播放器拥有独立生命周期；切换视频时释放引擎和网络请求。 */
export function Player({
  videoId,
  title,
  onTime,
}: {
  videoId: string
  title: string
  onTime: (seconds: number) => void
}) {
  const video = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let disposed = false
    let engine: MediaPlayerClass | undefined
    void import('dashjs')
      .then(({ MediaPlayer }) => {
        if (disposed || !video.current) return
        engine = MediaPlayer().create()
        engine.updateSettings({ debug: { logLevel: 0 } })
        engine.on(MediaPlayer.events.ERROR, () => {
          if (!disposed) setError('视频暂时无法播放，请稍后重试。')
        })
        engine.initialize(video.current, mediaUrl(videoId, 'mpd'), false)
      })
      .catch(() => {
        if (!disposed) setError('播放器加载失败，请重试。')
      })
    return () => {
      disposed = true
      engine?.reset()
    }
  }, [videoId, attempt])
  return (
    <div className="player-wrap">
      <video
        ref={video}
        controls
        playsInline
        preload="metadata"
        poster={mediaUrl(videoId, 'cover')}
        aria-label={title}
        onLoadedData={() => setReady(true)}
        onTimeUpdate={(event) => onTime(event.currentTarget.currentTime)}
      />
      {!ready && !error && (
        <div className="player-loading">
          <LoaderCircle className="animate-spin" size={24} />
          <span>正在加载视频</span>
        </div>
      )}
      {error && (
        <div className="player-error" role="alert">
          <AlertCircle size={30} />
          <p>{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              setError('')
              setReady(false)
              setAttempt((v) => v + 1)
            }}
          >
            <RefreshCw />
            重试播放
          </Button>
        </div>
      )}
      <div className="player-bottom">
        <span>
          <i />
          DASH
        </span>
        <label>
          播放速度
          <select
            aria-label="播放速度"
            defaultValue="1"
            onChange={(event) => {
              if (video.current) video.current.playbackRate = Number(event.target.value)
            }}
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
              <option key={speed} value={speed}>
                {speed}×
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
