import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { ErrorState, Loading, LoginRequired } from '@/components/states'
import { useSession } from '@/features/auth/session'
import { VideoCard } from '@/features/videos/video-card'
import { errorMessage } from '@/lib/api/client'
import { formatDate } from '@/lib/utils'
import {
  createFavorite,
  deleteFavorite,
  getFavorites,
  getFavoriteVideos,
  updateFavorite,
  type Favorite,
} from './api'

/** 本人列表与可分享的单个收藏夹分别查询，私密权限以服务端为准。 */
export function FavoritesPage() {
  const current = useSession()
  return current ? (
    <Favorites key={current.userId} user={current.userId} />
  ) : (
    <LoginRequired title="登录后查看收藏夹" />
  )
}

function Favorites({ user }: { user: string }) {
  const { folder } = useSearch({ from: '/favorites' })
  const navigate = useNavigate({ from: '/favorites' })
  const client = useQueryClient()
  const list = useQuery({
    queryKey: ['favorites', user],
    queryFn: ({ signal }) => getFavorites(signal),
  })
  const id = folder ?? list.data?.favoriteList[0]?.favoriteId
  const own = list.data?.favoriteList.find((item) => item.favoriteId === id)
  const [edit, setEdit] = useState<'new' | Favorite>()
  const [remove, setRemove] = useState<Favorite>()
  const deletion = useMutation({
    mutationFn: (item: Favorite) => deleteFavorite(item.favoriteId),
    onSuccess: () => {
      setRemove(undefined)
      void client.invalidateQueries({ queryKey: ['favorites', user] })
      void navigate({ search: { folder: undefined } })
    },
  })
  return (
    <div className="page">
      <div className="page-heading">
        <h1>收藏夹</h1>
        <Button onClick={() => setEdit('new')}>新建收藏夹</Button>
      </div>
      {list.isPending ? (
        <Loading />
      ) : list.isError ? (
        <ErrorState error={list.error} retry={() => void list.refetch()} />
      ) : (
        <div className="social-controls">
          <label>
            我的收藏夹
            <select
              aria-label="我的收藏夹"
              value={own?.favoriteId ?? ''}
              onChange={(event) =>
                void navigate({ search: { folder: event.target.value || undefined } })
              }
            >
              <option value="" disabled>
                选择收藏夹
              </option>
              {list.data.favoriteList.map((item) => (
                <option key={item.favoriteId} value={item.favoriteId}>
                  {item.favoriteName}
                  {item.isPrivate ? '（私密）' : ''}
                </option>
              ))}
            </select>
          </label>
          {own && (
            <>
              <Button variant="outline" onClick={() => setEdit(own)}>
                编辑收藏夹
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  deletion.reset()
                  setRemove(own)
                }}
              >
                删除空收藏夹
              </Button>
            </>
          )}
        </div>
      )}
      {id ? (
        <Contents key={id} user={user} id={id} />
      ) : (
        !list.isPending && !list.isError && <p>还没有收藏夹。</p>
      )}
      {edit && (
        <Editor
          key={edit === 'new' ? edit : edit.favoriteId}
          item={edit}
          close={() => setEdit(undefined)}
          saved={(savedId) => {
            void client.invalidateQueries({ queryKey: ['favorites', user] })
            setEdit(undefined)
            void navigate({ search: { folder: savedId } })
          }}
        />
      )}
      <Dialog
        open={!!remove}
        onOpenChange={(open) => {
          if (!open && !deletion.isPending) setRemove(undefined)
        }}
        title="删除收藏夹"
      >
        <div className="form-stack">
          <p>删除「{remove?.favoriteName}」？只有空收藏夹可以删除。</p>
          {deletion.isError && <p role="alert">{errorMessage(deletion.error)}</p>}
          <Button
            disabled={!remove || deletion.isPending}
            onClick={() => {
              if (remove) deletion.mutate(remove)
            }}
          >
            确认删除
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

function Editor({
  item,
  close,
  saved,
}: {
  item: Favorite | 'new'
  close: () => void
  saved: (id: string) => void
}) {
  const [name, setName] = useState(item === 'new' ? '' : item.favoriteName)
  const [description, setDescription] = useState(item === 'new' ? '' : item.description)
  const [privateList, setPrivate] = useState(item !== 'new' && item.isPrivate)
  const mutation = useMutation({
    mutationFn: async () => {
      const isPrivate = privateList ? -1 : 1
      if (item === 'new')
        return (await createFavorite(name.trim(), description, isPrivate)).favoriteId
      await updateFavorite(item.favoriteId, { favoritesName: name.trim(), description, isPrivate })
      return item.favoriteId
    },
    onSuccess: saved,
  })
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) close()
      }}
      title={item === 'new' ? '新建收藏夹' : '编辑收藏夹'}
    >
      <form
        className="form-stack"
        onSubmit={(event) => {
          event.preventDefault()
          if (name.trim() && !mutation.isPending) mutation.mutate()
        }}
      >
        <label>
          名称
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          描述
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={privateList}
            onChange={(event) => setPrivate(event.target.checked)}
          />
          私密
        </label>
        {mutation.isError && <p role="alert">{errorMessage(mutation.error)}</p>}
        <Button disabled={!name.trim() || mutation.isPending}>保存</Button>
      </form>
    </Dialog>
  )
}

function Contents({ user, id }: { user: string; id: string }) {
  const [page, setPage] = useState(1)
  const query = useQuery({
    queryKey: ['favorite-videos', user, id, page],
    queryFn: ({ signal }) => getFavoriteVideos(id, page, signal),
  })
  if (query.isPending) return <Loading />
  if (query.isError) return <ErrorState error={query.error} retry={() => void query.refetch()} />
  return (
    <>
      {query.data.videos.length ? (
        <div className="video-grid">
          {query.data.videos.map(({ video, collectedAt }) => (
            <div key={video.videoId}>
              <VideoCard video={video} />
              {collectedAt && <small>收藏于 {formatDate(collectedAt)}</small>}
            </div>
          ))}
        </div>
      ) : (
        <p>这一页还没有视频。</p>
      )}
      <div className="pagination">
        <span>第 {page} 页</span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            上一页
          </Button>
          <Button
            variant="outline"
            disabled={BigInt(page) * 20n >= BigInt(query.data.total)}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </Button>
        </div>
      </div>
    </>
  )
}
