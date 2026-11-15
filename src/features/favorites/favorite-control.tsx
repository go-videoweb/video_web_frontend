import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { ApiError, errorMessage } from '@/lib/api/client'
import type { getVideo } from '@/features/videos/api'
import { getFavorites, setVideoFavorite } from './api'

/** 不把个人状态不可用当作未收藏，取消使用当前关系的两个 ID。 */
export function VideoFavoriteControl({ videoId, userId }: { videoId: string; userId: string }) {
  const client = useQueryClient()
  const key = ['video', userId, videoId]
  const state = client.getQueryData<Awaited<ReturnType<typeof getVideo>>>(key)?.userVideoStatus
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('')
  const [conflict, setConflict] = useState(false)
  const list = useQuery({
    queryKey: ['favorites', userId],
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: open && state?.isFavorited !== 1,
  })
  const mutation = useMutation({
    mutationFn: () => {
      if (!state) throw new Error('请先核对个人状态')
      return state.isFavorited === 1
        ? setVideoFavorite(videoId, state.favoriteId, state.favoriteRecordId)
        : setVideoFavorite(videoId, selected)
    },
    onSuccess: (result) => {
      client.setQueryData<Awaited<ReturnType<typeof getVideo>>>(key, (old) =>
        old?.userVideoStatus
          ? {
              ...old,
              userVideoStatus: {
                ...old.userVideoStatus,
                ...result,
                isFavorited: result.isFavorited ? 1 : -1,
              },
            }
          : old,
      )
      void client.invalidateQueries({ queryKey: ['favorite-videos'] })
      setOpen(false)
    },
    onError: (error) => {
      if (
        !(error instanceof ApiError) ||
        ['FAVORITE_RECORD_CHANGED', 'VIDEO_ALREADY_FAVORITED'].includes(error.reason)
      )
        setConflict(true)
    },
  })
  return (
    <>
      <Button
        variant="outline"
        aria-pressed={state ? state.isFavorited === 1 : undefined}
        disabled={!state}
        onClick={() => {
          mutation.reset()
          setOpen(true)
        }}
      >
        <Bookmark />
        {state?.isFavorited === 1 ? '已收藏' : '收藏'}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!mutation.isPending) setOpen(next)
        }}
        title={state?.isFavorited === 1 ? '取消收藏' : '收藏到'}
      >
        <div className="form-stack">
          {state?.isFavorited === 1 ? (
            <p>从当前收藏夹移除此视频？</p>
          ) : list.isError ? (
            <p role="alert">{errorMessage(list.error)}</p>
          ) : list.isPending ? (
            <p>正在读取收藏夹</p>
          ) : (
            <label>
              收藏夹
              <select value={selected} onChange={(event) => setSelected(event.target.value)}>
                <option value="">选择收藏夹</option>
                {list.data?.favoriteList.map((item) => (
                  <option key={item.favoriteId} value={item.favoriteId}>
                    {item.favoriteName}
                  </option>
                ))}
              </select>
            </label>
          )}
          {!list.isPending &&
            state?.isFavorited !== 1 &&
            !list.data?.favoriteList.length &&
            !list.isError && <p>请先在收藏夹页面创建收藏夹。</p>}
          {mutation.isError && <p role="alert">{errorMessage(mutation.error)}</p>}
          {conflict && (
            <Button
              variant="outline"
              onClick={async () => {
                await client.refetchQueries({ queryKey: key, exact: true })
                if (
                  client.getQueryState(key)?.status === 'success' &&
                  client.getQueryData<Awaited<ReturnType<typeof getVideo>>>(key)?.userVideoStatus
                ) {
                  mutation.reset()
                  setConflict(false)
                  setOpen(false)
                }
              }}
            >
              重新核对收藏状态
            </Button>
          )}
          <Button
            disabled={
              mutation.isPending ||
              conflict ||
              !state ||
              (state.isFavorited !== 1 &&
                !list.data?.favoriteList.some((item) => item.favoriteId === selected))
            }
            onClick={() => mutation.mutate()}
          >
            确认
          </Button>
        </div>
      </Dialog>
    </>
  )
}
