import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { errorMessage } from '@/lib/api/client'
import { followUser, getFollowLists, getFollowRelation, moveFollowee, unfollowUser } from './api'

/** 查看关系后再关注、取消或移动；不会凭本地状态猜默认组。 */
export function FollowControl({
  userId,
  target,
  compact = false,
}: {
  userId: string
  target: string
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('')
  const client = useQueryClient()
  const relationKey = ['follow-relation', userId, target]
  const relation = useQuery({
    queryKey: relationKey,
    queryFn: ({ signal }) => getFollowRelation(target, signal),
    enabled: !compact || open,
  })
  const lists = useQuery({
    queryKey: ['follow-lists', userId],
    queryFn: ({ signal }) => getFollowLists(signal),
    enabled: open,
  })
  const listId =
    selected ||
    (relation.data?.isFollowing
      ? relation.data.followListId
      : lists.data?.lists.find((item) => item.isDefault)?.followListId) ||
    ''
  const mutation = useMutation({
    mutationFn: async (kind: 'save' | 'remove') => {
      if (kind === 'remove') {
        await unfollowUser(userId, target)
        return { isFollowing: false, followListId: '0' }
      }
      if (!lists.data?.lists.some((item) => item.followListId === listId))
        throw new Error('请选择关注组')
      if (!relation.data?.isFollowing) return followUser(userId, target, listId)
      await moveFollowee(target, listId)
      return { isFollowing: true, followListId: listId }
    },
    onSuccess: (value) => {
      client.setQueryData(relationKey, value)
      void client.invalidateQueries({ queryKey: ['following', userId] })
      void client.invalidateQueries({ queryKey: ['user', userId] })
      void client.invalidateQueries({ queryKey: ['user', target] })
      setOpen(false)
    },
    onError: () => {
      void relation.refetch()
    },
  })
  return (
    <>
      <Button
        size={compact ? 'sm' : 'default'}
        variant="outline"
        onClick={() => {
          setSelected('')
          mutation.reset()
          setOpen(true)
        }}
      >
        <UserPlus />
        {compact
          ? '管理关注'
          : relation.data?.isFollowing
            ? '已关注'
            : relation.isPending || relation.isError
              ? '关注关系'
              : '关注'}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!mutation.isPending) setOpen(next)
        }}
        title={relation.data?.isFollowing ? '管理关注' : '关注此用户'}
      >
        <div className="form-stack">
          {(relation.isError || lists.isError) && (
            <p role="alert">{errorMessage(relation.error ?? lists.error)}</p>
          )}
          {(relation.isError || lists.isError) && (
            <Button
              variant="outline"
              onClick={() => {
                void relation.refetch()
                void lists.refetch()
              }}
            >
              重试读取
            </Button>
          )}
          {relation.isPending || lists.isPending ? <p>正在读取关注关系</p> : null}
          {lists.data && relation.data && (
            <label>
              关注组
              <select value={listId} onChange={(event) => setSelected(event.target.value)}>
                {lists.data.lists.map((item) => (
                  <option key={item.followListId} value={item.followListId}>
                    {item.name}
                    {item.isDefault ? '（默认）' : ''}
                  </option>
                ))}
              </select>
            </label>
          )}
          {mutation.isError && <p role="alert">{errorMessage(mutation.error)}</p>}
          <Button
            disabled={
              !listId ||
              !relation.data ||
              relation.isFetching ||
              lists.isError ||
              mutation.isPending ||
              (relation.data.isFollowing && relation.data.followListId === listId)
            }
            onClick={() => mutation.mutate('save')}
          >
            {relation.data?.isFollowing ? '移动到此组' : '确认关注'}
          </Button>
          {relation.data?.isFollowing && (
            <Button
              variant="outline"
              disabled={mutation.isPending || relation.isFetching}
              onClick={() => mutation.mutate('remove')}
            >
              取消关注
            </Button>
          )}
        </div>
      </Dialog>
    </>
  )
}
