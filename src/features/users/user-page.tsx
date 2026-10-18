import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, Film, Settings, Users } from 'lucide-react'
import { useSession } from '@/features/auth/session'
import { getUser } from '@/features/users/api'
import { Avatar } from '@/components/layout/shell'
import { ErrorState, Loading, LoginRequired } from '@/components/states'
import { Button } from '@/components/ui/button'
import { formatCount, publicImage } from '@/lib/utils'

/** 用户资料只显示已公开字段，未提供投稿查询时不拼接假列表。 */
export function UserPage() {
  const { userId } = useParams({ from: '/users/$userId' })
  const current = useSession()
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: ({ signal }) => getUser(userId, signal),
    enabled: !!current,
  })
  if (!current) return <LoginRequired title="登录后查看个人主页" />
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
  const user = query.data
  return (
    <div className="page profile-page">
      <div className="profile-banner">
        <img src="/assets/forest.jpg" alt="林间光影" />
      </div>
      <div className="profile-identity">
        <Avatar name={user.userName} large src={publicImage(user.avatarPath)} />
        <div>
          <h1>{user.userName || 'VideoWeb 用户'}</h1>
          <p>{user.signature || '这里还没有留下签名。'}</p>
        </div>
        {current.userId === userId && (
          <Button variant="outline" asChild>
            <Link to="/settings">
              <Settings />
              编辑资料
            </Link>
          </Button>
        )}
      </div>
      <div className="profile-stats">
        <div>
          <Film size={20} />
          <strong>{formatCount(user.cntVideos)}</strong>
          <span>视频</span>
        </div>
        <div>
          <Users size={20} />
          <strong>{formatCount(user.cntFans)}</strong>
          <span>粉丝</span>
        </div>
        <div>
          <Users size={20} />
          <strong>{formatCount(user.cntFollows)}</strong>
          <span>关注</span>
        </div>
      </div>
      <section className="profile-about">
        <h2>关于</h2>
        <p>{user.signature || '这位创作者暂时没有填写简介。'}</p>
        {current.userId === userId && (
          <div className="profile-private">
            <span>{user.email}</span>
            {user.birthday && (
              <span>
                <CalendarDays size={16} />
                {user.birthday}
              </span>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
