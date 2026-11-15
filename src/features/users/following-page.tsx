import { Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Avatar } from '@/components/layout/shell'
import { ErrorState, Loading, LoginRequired } from '@/components/states'
import { useSession } from '@/features/auth/session'
import { errorMessage } from '@/lib/api/client'
import { publicImage } from '@/lib/utils'
import {
  createFollowList,
  deleteFollowLists,
  getFollowing,
  getFollowLists,
  renameFollowList,
  setDefaultFollowList,
} from './api'
import { FollowControl } from './follow-control'

/** 关注组管理和对象分页均使用服务端 ID。 */
export function FollowingPage() {
  const session = useSession()
  return session ? (
    <Following key={session.userId} user={session.userId} />
  ) : (
    <LoginRequired title="登录后查看关注" />
  )
}
function Following({ user }: { user: string }) {
  const client = useQueryClient()
  const [id, setId] = useState('0')
  const [page, setPage] = useState(1)
  const [edit, setEdit] = useState<'new' | 'rename' | 'delete'>()
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const list = useQuery({
    queryKey: ['follow-lists', user],
    queryFn: ({ signal }) => getFollowLists(signal),
  })
  const items = useQuery({
    queryKey: ['following', user, id, page],
    queryFn: ({ signal }) => getFollowing(user, id, page, signal),
  })
  const folder = list.data?.lists.find((group) => group.followListId === id)
  const refresh = () => {
    void client.invalidateQueries({ queryKey: ['follow-lists', user] })
    void client.invalidateQueries({ queryKey: ['following', user] })
  }
  const change = useMutation({
    mutationFn: (mode: 'new' | 'rename' | 'default' | 'delete') => {
      if (mode === 'new') return createFollowList(name.trim())
      if (mode === 'rename') return renameFollowList(id, name.trim())
      if (mode === 'default') return setDefaultFollowList(id)
      return deleteFollowLists(selected)
    },
    onSuccess: (value, mode) => {
      refresh()
      if (
        mode === 'new' &&
        value &&
        typeof value === 'object' &&
        'followListId' in value &&
        typeof value.followListId === 'string'
      ) {
        setId(value.followListId)
        setPage(1)
      }
      if (mode === 'delete') {
        setId('0')
        setPage(1)
        void client.invalidateQueries({ queryKey: ['follow-relation', user] })
        void client.invalidateQueries({ queryKey: ['user'] })
      }
      setEdit(undefined)
    },
  })
  const validName = Array.from(name.trim()).length >= 1 && Array.from(name.trim()).length <= 20
  return (
    <div className="page">
      <div className="page-heading">
        <h1>关注</h1>
        <Button
          onClick={() => {
            change.reset()
            setName('')
            setEdit('new')
          }}
        >
          新建关注组
        </Button>
      </div>
      {list.isPending ? (
        <Loading />
      ) : list.isError ? (
        <ErrorState error={list.error} retry={() => void list.refetch()} />
      ) : (
        <div className="social-controls">
          <label>
            分组
            <select
              aria-label="关注组"
              value={id}
              onChange={(event) => {
                setId(event.target.value)
                setPage(1)
              }}
            >
              <option value="0">全部关注</option>
              {list.data.lists.map((group) => (
                <option key={group.followListId} value={group.followListId}>
                  {group.name}
                  {group.isDefault ? '（默认）' : ''}
                </option>
              ))}
            </select>
          </label>
          {folder && (
            <Button
              variant="outline"
              onClick={() => {
                change.reset()
                setName(folder.name)
                setEdit('rename')
              }}
            >
              改名
            </Button>
          )}
          {folder && !folder.isDefault && (
            <Button
              variant="outline"
              disabled={change.isPending}
              onClick={() => change.mutate('default')}
            >
              设为默认
            </Button>
          )}
          <Button
            variant="outline"
            disabled={!list.data.lists.some((item) => !item.isDefault)}
            onClick={() => {
              change.reset()
              setSelected([])
              setEdit('delete')
            }}
          >
            批量删除
          </Button>
        </div>
      )}
      {!edit && change.isError && <p role="alert">{errorMessage(change.error)}</p>}
      {items.isPending ? (
        <Loading />
      ) : items.isError ? (
        <ErrorState error={items.error} retry={() => void items.refetch()} />
      ) : (
        <>
          <ul className="social-items">
            {items.data.followeeInfo.map((item) => (
              <li key={item.userId}>
                <Avatar name={item.username} src={publicImage(item.avatarPath)} />
                <div>
                  <Link to="/users/$userId" params={{ userId: item.userId }}>
                    {item.username}
                  </Link>
                  <p>{item.signature}</p>
                </div>
                <FollowControl compact userId={user} target={item.userId} />
              </li>
            ))}
          </ul>
          {!items.data.followeeInfo.length && <p>这个分组还没有关注。</p>}
          <div className="pagination">
            <span>第 {page} 页</span>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                上一页
              </Button>
              <Button
                variant="outline"
                disabled={BigInt(page) * 20n >= BigInt(items.data.total)}
                onClick={() => setPage(page + 1)}
              >
                下一页
              </Button>
            </div>
          </div>
        </>
      )}
      <Dialog
        open={!!edit}
        onOpenChange={(next) => {
          if (!next && !change.isPending) setEdit(undefined)
        }}
        title={
          edit === 'delete' ? '删除关注组' : edit === 'rename' ? '修改关注组名称' : '新建关注组'
        }
      >
        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault()
            if (edit && !change.isPending && (edit === 'delete' ? selected.length > 0 : validName))
              change.mutate(edit)
          }}
        >
          {edit === 'delete' ? (
            <>
              <p>删除选中的关注组会同时取消组内关注。</p>
              {list.data?.lists
                .filter((item) => !item.isDefault)
                .map((item) => (
                  <label key={item.followListId} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.followListId)}
                      disabled={selected.length >= 100 && !selected.includes(item.followListId)}
                      onChange={(event) =>
                        setSelected(
                          event.target.checked
                            ? [...selected, item.followListId]
                            : selected.filter((key) => key !== item.followListId),
                        )
                      }
                    />
                    {item.name}
                  </label>
                ))}
            </>
          ) : (
            <label>
              名称
              <input value={name} onChange={(event) => setName(event.target.value)} />
              <small>{Array.from(name.trim()).length}/20</small>
            </label>
          )}
          {change.isError && <p role="alert">{errorMessage(change.error)}</p>}
          <Button
            disabled={change.isPending || (edit === 'delete' ? !selected.length : !validName)}
          >
            {edit === 'delete' ? '确认删除' : '保存'}
          </Button>
        </form>
      </Dialog>
    </div>
  )
}
