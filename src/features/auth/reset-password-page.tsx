import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { ApiError, errorMessage } from '@/lib/api/client'
import { resetPassword, sendEmailCode } from './api'
import { codeRule, emailRule, passwordRule } from './password-rules'
import { session } from './session'

const schema = z.object({ email: emailRule, inputCode: codeRule, newPassword: passwordRule })

/** 匿名找回密码；部分提交成功时不再重发已经消费的验证码。 */
export function ResetPasswordPage() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  useEffect(() => {
    if (!cooldown) return
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)
  async function send() {
    if (sending || cooldown > 0 || !(await form.trigger('email'))) return
    setSending(true)
    setMessage('')
    try {
      await sendEmailCode(emailRule.parse(form.getValues('email')), 'reset_password')
      setCooldown(60)
      setMessage('已申请发送验证码')
    } catch (error) {
      setMessage(errorMessage(error))
    } finally {
      setSending(false)
    }
  }
  const submit = form.handleSubmit(async (body) => {
    try {
      await resetPassword(body)
      setMessage('密码已更新，请重新登录。')
    } catch (error) {
      if (!(
        error instanceof ApiError &&
        error.reason === 'PASSWORD_SESSION_INVALIDATION_FAILED' &&
        error.metadata.password_changed === 'true'
      )) {
        setMessage(errorMessage(error))
        return
      }
      setMessage('密码已更新，请用新密码登录；旧会话尚未确认撤销。')
    }
    session.set(null)
    form.reset()
    setDone(true)
  })
  return (
    <section className="page">
      <div className="settings-section max-w-lg">
        <h1>找回密码</h1>
        {!done && (
          <form className="form-stack" onSubmit={submit}>
            <label>
              邮箱
              <input type="email" autoComplete="email" {...form.register('email')} />
              <small>{form.formState.errors.email?.message}</small>
            </label>
            <label>
              验证码
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                {...form.register('inputCode')}
              />
              <small>{form.formState.errors.inputCode?.message}</small>
            </label>
            <Button
              type="button"
              variant="outline"
              disabled={sending || cooldown > 0}
              onClick={() => void send()}
            >
              {cooldown ? `${cooldown}s` : '获取验证码'}
            </Button>
            <label>
              新密码
              <input
                type="password"
                autoComplete="new-password"
                {...form.register('newPassword')}
              />
              <small>{form.formState.errors.newPassword?.message}</small>
            </label>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              重置密码
            </Button>
          </form>
        )}
        {message && <p role="status">{message}</p>}
        <Link to="/login" search={{ redirect: '/' }}>
          返回登录
        </Link>
      </div>
    </section>
  )
}
