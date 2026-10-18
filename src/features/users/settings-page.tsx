import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Camera, Check, KeyRound, LoaderCircle, Mail, Save, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { session, useSession } from '@/features/auth/session'
import { sendEmailCode } from '@/features/auth/api'
import { getUser, updateUser, uploadAvatar } from '@/features/users/api'
import type { UserInfo } from '@/lib/api/models'
import { errorMessage } from '@/lib/api/client'
import { publicImage } from '@/lib/utils'
import { Avatar } from '@/components/layout/shell'
import { Button } from '@/components/ui/button'
import { ErrorState, Loading, LoginRequired } from '@/components/states'
const nameSchema = z.object({
  newUsername: z.string().trim().min(2, '昵称至少 2 个字符').max(32, '昵称最多 32 个字符'),
})
const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, '请输入当前密码'),
    newPassword: z.string().min(8, '新密码至少 8 位'),
    repeat: z.string(),
  })
  .refine((v) => v.newPassword === v.repeat, { path: ['repeat'], message: '两次密码不一致' })
const emailSchema = z.object({
  email: z.email('请输入有效邮箱'),
  inputCode: z.string().trim().min(1, '请输入验证码'),
})

/** 账户设置按后端独立操作提交，成功后精确刷新资料缓存。 */
export function SettingsPage() {
  const current = useSession()
  const [tab, setTab] = useState<'profile' | 'security'>('profile')
  const query = useQuery({
    queryKey: ['user', current?.userId],
    queryFn: ({ signal }) => getUser(current!.userId, signal),
    enabled: !!current,
  })
  if (!current) return <LoginRequired title="登录后管理账户" />
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
  return (
    <div className="page settings-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">个人空间</div>
          <h1>
            账户设置<span className="heading-dot">.</span>
          </h1>
        </div>
      </div>
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="设置分类">
          <button className={tab === 'profile' ? 'selected' : ''} onClick={() => setTab('profile')}>
            <UserRound size={18} />
            个人资料
          </button>
          <button
            className={tab === 'security' ? 'selected' : ''}
            onClick={() => setTab('security')}
          >
            <KeyRound size={18} />
            账户安全
          </button>
        </nav>
        <div className="settings-content">
          {tab === 'profile' ? (
            <ProfileSettings userId={current.userId} user={query.data} />
          ) : (
            <>
              <PasswordSettings userId={current.userId} />
              <EmailSettings userId={current.userId} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileSettings({ userId, user }: { userId: string; user: UserInfo }) {
  const client = useQueryClient()
  const [signature, setSignature] = useState(user.signature)
  const [previewUrl, setPreviewUrl] = useState('')
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])
  const name = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: { newUsername: user.userName },
  })
  const save = useMutation({
    mutationFn: ({
      action,
      body,
    }: {
      action: 'modifyUsername' | 'modifySignature'
      body: Record<string, unknown>
    }) => updateUser(userId, action, body),
    onSuccess: () => {
      toast.success('资料已更新')
      void client.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: (error) => toast.error(errorMessage(error)),
  })
  const avatar = useMutation({
    mutationFn: (file: File) => uploadAvatar(file, userId),
    onSuccess: () => {
      toast.success('头像已上传')
      void client.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: (error) => {
      setPreviewUrl('')
      toast.error(errorMessage(error))
    },
  })
  return (
    <>
      <section className="settings-section">
        <h2>个人资料</h2>
        <div className="avatar-editor">
          <Avatar name={user.userName} src={previewUrl || publicImage(user.avatarPath)} large />
          <div>
            <label className="file-button">
              <Camera size={16} />
              {avatar.isPending ? '上传中…' : '更换头像'}
              <input
                type="file"
                accept="image/png,image/jpeg"
                disabled={avatar.isPending}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  if (
                    !['image/jpeg', 'image/png'].includes(file.type) ||
                    file.size > 5 * 1024 * 1024
                  ) {
                    toast.error('请选择 5 MB 以内的 JPG 或 PNG 图片')
                    return
                  }
                  setPreviewUrl(URL.createObjectURL(file))
                  avatar.mutate(file)
                }}
              />
            </label>
            <small>JPG、PNG · 最大 5 MB</small>
          </div>
        </div>
        <form
          className="form-stack"
          onSubmit={name.handleSubmit((values) =>
            save.mutate({ action: 'modifyUsername', body: values }),
          )}
        >
          <label>
            昵称
            <input {...name.register('newUsername')} />
            {name.formState.errors.newUsername && (
              <span className="field-error">{name.formState.errors.newUsername.message}</span>
            )}
          </label>
          <Button type="submit" disabled={save.isPending}>
            <Save />
            保存昵称
          </Button>
        </form>
      </section>
      <section className="settings-section">
        <h2>个人签名</h2>
        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault()
            save.mutate({ action: 'modifySignature', body: { signature } })
          }}
        >
          <label>
            签名
            <textarea
              rows={3}
              value={signature}
              maxLength={160}
              onChange={(event) => setSignature(event.target.value)}
              placeholder="写下关于你的一句话…"
            />
          </label>
          <Button disabled={save.isPending} type="submit">
            <Check />
            保存签名
          </Button>
        </form>
      </section>
    </>
  )
}

function PasswordSettings({ userId }: { userId: string }) {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: '', newPassword: '', repeat: '' },
  })
  return (
    <section className="settings-section">
      <h2>修改密码</h2>
      <form
        className="form-stack"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await updateUser(userId, 'modifyPassword', {
              oldPassword: values.oldPassword,
              newPassword: values.newPassword,
            })
            form.reset()
            session.set(null)
            toast.success('密码已修改，请重新登录')
          } catch (error) {
            form.setError('root', { message: errorMessage(error) })
          }
        })}
      >
        {(['oldPassword', 'newPassword', 'repeat'] as const).map((field, index) => (
          <label key={field}>
            {['当前密码', '新密码', '确认新密码'][index]}
            <input
              type="password"
              autoComplete={field === 'oldPassword' ? 'current-password' : 'new-password'}
              {...form.register(field)}
            />
            {form.formState.errors[field] && (
              <span className="field-error">{form.formState.errors[field]?.message}</span>
            )}
          </label>
        ))}
        {form.formState.errors.root && (
          <p className="form-error" role="alert">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : <KeyRound />}
          更新密码
        </Button>
      </form>
    </section>
  )
}

function EmailSettings({ userId }: { userId: string }) {
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const client = useQueryClient()
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '', inputCode: '' },
  })
  useEffect(() => {
    if (!cooldown) return
    const timer = window.setTimeout(() => setCooldown((v) => v - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])
  async function sendCode() {
    if (!(await form.trigger('email'))) return
    setSending(true)
    try {
      await sendEmailCode(form.getValues('email'))
      setCooldown(60)
      toast.success('验证码已发送')
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setSending(false)
    }
  }
  return (
    <section className="settings-section">
      <h2>更换邮箱</h2>
      <form
        className="form-stack"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await updateUser(userId, 'modifyEmail', values)
            await client.invalidateQueries({ queryKey: ['user', userId] })
            form.reset()
            toast.success('邮箱已更新')
          } catch (error) {
            form.setError('root', { message: errorMessage(error) })
          }
        })}
      >
        <label>
          新邮箱
          <input type="email" autoComplete="email" {...form.register('email')} />
          {form.formState.errors.email && (
            <span className="field-error">{form.formState.errors.email.message}</span>
          )}
        </label>
        <label>
          验证码
          <div className="input-action">
            <input {...form.register('inputCode')} autoComplete="one-time-code" />
            <Button
              type="button"
              variant="outline"
              disabled={sending || cooldown > 0}
              onClick={sendCode}
            >
              {sending ? '发送中' : cooldown ? `${cooldown}s` : '获取验证码'}
            </Button>
          </div>
          {form.formState.errors.inputCode && (
            <span className="field-error">{form.formState.errors.inputCode.message}</span>
          )}
        </label>
        {form.formState.errors.root && (
          <p className="form-error" role="alert">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          <Mail />
          更新邮箱
        </Button>
      </form>
    </section>
  )
}
