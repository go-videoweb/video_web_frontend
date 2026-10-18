import { Link } from '@tanstack/react-router'
import { AlertCircle, Film, LoaderCircle, LogIn, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './ui/button'
import { errorMessage } from '@/lib/api/client'

/** 页面状态保持在内容区域内，重试只由明确用户动作触发。 */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon || <Film size={28} />}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}
/** 请求错误不会静默切换成演示数据。 */
export function ErrorState({ error, retry }: { error: unknown; retry?: () => void }) {
  return (
    <EmptyState
      title="暂时无法加载"
      description={errorMessage(error)}
      icon={<AlertCircle size={28} />}
      action={
        retry && (
          <Button variant="outline" onClick={retry}>
            <RefreshCw />
            重新加载
          </Button>
        )
      }
    />
  )
}
/** 受保护功能展示登录入口，保留用户原本访问的站内路径。 */
export function LoginRequired({
  title = '登录后继续探索',
  description = '登录 VideoWeb，查看视频与社区内容。',
}: {
  title?: string
  description?: string
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={<LogIn size={28} />}
      action={
        <Button asChild>
          <Link
            to="/login"
            search={{ redirect: window.location.pathname + window.location.search }}
          >
            <LogIn />
            登录
          </Link>
        </Button>
      }
    />
  )
}
/** 异步按钮和内容区域共用加载标识。 */
export function Loading() {
  return (
    <div className="loading-state" role="status">
      <LoaderCircle className="animate-spin" size={24} />
      <span>正在加载</span>
    </div>
  )
}
