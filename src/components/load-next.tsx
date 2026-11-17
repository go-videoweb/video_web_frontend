import { useEffect, useRef } from 'react'
import { Button } from './ui/button'

/** 近底部时继续读取游标；失败后保留手动重试，避免错误请求循环。 */
export function LoadNext({
  label,
  load,
  busy,
  manual,
}: {
  label: string
  load: () => unknown
  busy: boolean
  manual?: boolean
}) {
  const marker = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (busy || manual || !marker.current || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect()
          void load()
        }
      },
      { rootMargin: '160px' },
    )
    observer.observe(marker.current)
    return () => observer.disconnect()
  }, [busy, load, manual])
  return (
    <div ref={marker}>
      <Button type="button" variant="outline" disabled={busy} onClick={() => void load()}>
        {busy ? '加载中' : label}
      </Button>
    </div>
  )
}
