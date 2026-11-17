import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Camera,
  Bookmark,
  Users,
  ChevronRight,
  Compass,
  Cpu,
  Dumbbell,
  Film,
  Landmark,
  Leaf,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Play,
  Settings,
  Sun,
  Upload,
  UserRound,
  Music2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { config, switchMode } from '@/lib/config'
import { useSession } from '@/features/auth/session'
import { logout } from '@/features/auth/api'
import { getUser } from '@/features/users/api'
import { errorMessage } from '@/lib/api/client'
import { publicImage } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Dialog } from '@/components/ui/dialog'

const icons = [Cpu, Camera, Leaf, Landmark, Music2, Dumbbell]

/** 系统主题持续监听系统变化；存储不可用时仍保留当前交互。 */
function ThemeControl() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('vw.theme')
      return stored === 'dark' || stored === 'light' ? stored : 'system'
    } catch {
      return 'system'
    }
  })
  const [systemDark, setSystemDark] = useState(
    () => matchMedia('(prefers-color-scheme: dark)').matches,
  )
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemDark(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const dark = theme === 'dark' || (theme === 'system' && systemDark)
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    try {
      localStorage.setItem('vw.theme', theme)
    } catch {
      /* 主题选择不依赖持久存储。 */
    }
  }, [dark, theme])
  return (
    <label className="theme-control" title="外观模式">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      <select
        aria-label="外观模式"
        value={theme}
        onChange={(event) => setTheme(event.target.value as typeof theme)}
      >
        <option value="system">跟随系统</option>
        <option value="light">浅色</option>
        <option value="dark">深色</option>
      </select>
    </label>
  )
}

/** 品牌使用可访问文字，图形仅作为识别辅助。 */
export function Brand() {
  return (
    <Link
      to="/"
      search={{ category: config.categories[0] || '科技', page: 1 }}
      className="brand"
      aria-label="VideoWeb 首页"
    >
      <span className="brand-symbol">
        <Play size={22} fill="currentColor" strokeWidth={0} />
      </span>
      <span>
        Video<span className="brand-light">Web</span>
        <span className="brand-dot">.</span>
      </span>
    </Link>
  )
}

/** 导航仅暴露已实现入口，类别值与公开配置一致。 */
function Navigation({ close }: { close?: () => void }) {
  const current = useSession()
  return (
    <>
      <div className="nav-section">
        <Link
          className="nav-link"
          to="/"
          search={{ category: config.categories[0] || '科技', page: 1 }}
          activeProps={{ className: 'nav-link nav-active' }}
          activeOptions={{ exact: true, includeSearch: false }}
          onClick={close}
        >
          <Compass size={20} />
          发现
        </Link>
      </div>
      <div className="nav-section">
        <p className="nav-label">探索频道</p>
        {config.categories.map((category, i) => {
          const Icon = icons[i % icons.length] || Film
          return (
            <Link
              key={category}
              className="nav-link channel-link"
              to="/"
              search={{ category, page: 1 }}
              activeProps={{ className: 'nav-link channel-link channel-active' }}
              activeOptions={{ includeSearch: true }}
              onClick={close}
            >
              <Icon size={18} />
              {category}
            </Link>
          )
        })}
      </div>
      <div className="nav-section">
        <p className="nav-label">我的空间</p>
        <Link
          to="/favorites"
          search={{ folder: undefined }}
          className="nav-link"
          activeProps={{ className: 'nav-link nav-active' }}
          onClick={close}
        >
          <Bookmark size={19} />
          收藏夹
        </Link>
        <Link
          to="/following"
          className="nav-link"
          activeProps={{ className: 'nav-link nav-active' }}
          onClick={close}
        >
          <Users size={19} />
          关注
        </Link>
        <Link
          to="/upload"
          className="nav-link"
          activeProps={{ className: 'nav-link nav-active' }}
          onClick={close}
        >
          <Upload size={19} />
          投稿
        </Link>
        {current && (
          <Link
            to="/users/$userId"
            params={{ userId: current.userId }}
            className="nav-link"
            activeProps={{ className: 'nav-link nav-active' }}
            onClick={close}
          >
            <UserRound size={19} />
            个人主页
          </Link>
        )}
        <Link
          to="/settings"
          className="nav-link"
          activeProps={{ className: 'nav-link nav-active' }}
          onClick={close}
        >
          <Settings size={19} />
          账户设置
        </Link>
      </div>
    </>
  )
}

/** 应用外壳管理导航和主题，业务数据仍由各页面负责。 */
export function Shell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const current = useSession()
  const user = useQuery({
    queryKey: ['user', current?.userId],
    queryFn: ({ signal }) => getUser(current!.userId, signal),
    enabled: !!current,
  })
  const [menu, setMenu] = useState(false)
  const authPage = pathname === '/login' || pathname === '/register'
  async function signOut() {
    try {
      await logout()
      toast.success('已退出登录')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }
  return (
    <>
      <a href="#main" className="skip-link">
        跳到主要内容
      </a>
      <header className="app-header">
        <div className="header-brand">
          <span className="mobile-menu">
            <IconButton label="打开导航" onClick={() => setMenu(true)}>
              <Menu />
            </IconButton>
          </span>
          <Brand />
        </div>
        <div className="header-right">
          {config.demo && (
            <button
              className="demo-badge"
              onClick={() => switchMode(false)}
              title="退出演示，连接真实 API"
            >
              <span />
              演示环境
            </button>
          )}
          <ThemeControl />
          <Button asChild className="header-upload">
            <Link to="/upload">
              <Upload size={16} />
              投稿
            </Link>
          </Button>
          {current ? (
            <>
              <Link to="/settings" className="account-link" aria-label="我的账户">
                <Avatar
                  name={user.data?.userName || '我'}
                  src={publicImage(user.data?.avatarPath)}
                />
                <span>{user.data?.userName || '我的账户'}</span>
                <ChevronRight size={14} />
              </Link>
              <IconButton label="退出登录" onClick={signOut}>
                <LogOut />
              </IconButton>
            </>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/login" search={{ redirect: pathname }}>
                <LogIn />
                登录
              </Link>
            </Button>
          )}
        </div>
      </header>
      <Dialog open={menu} onOpenChange={setMenu} title="导航">
        <nav className="mobile-navigation">
          <Navigation close={() => setMenu(false)} />
        </nav>
      </Dialog>
      {!authPage && (
        <aside className="app-sidebar">
          <nav>
            <Navigation />
          </nav>
          <div className="sidebar-footer">
            <span className="online-dot" />
            VideoWeb<span>视频与生活，相遇于此。</span>
            <small>© {new Date().getFullYear()} VideoWeb</small>
          </div>
        </aside>
      )}
      <main id="main" className={authPage ? 'auth-main' : 'app-main'}>
        <Outlet />
      </main>
    </>
  )
}

/** 图片失败时回退首字，固定尺寸不改变布局。 */
export function Avatar({
  name,
  src,
  large = false,
}: {
  name: string
  src?: string
  large?: boolean
}) {
  const [failedSource, setFailedSource] = useState<string>()
  return (
    <span className={large ? 'avatar avatar-large' : 'avatar'}>
      {src && failedSource !== src ? (
        <img src={src} alt="" onError={() => setFailedSource(src)} />
      ) : (
        name.slice(0, 1).toUpperCase() || 'V'
      )}
    </span>
  )
}
