import { Link, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { login, registerAccount, sendEmailCode } from './api'
import { config, switchMode } from '@/lib/config'
import { errorMessage } from '@/lib/api/client'
import { Button } from '@/components/ui/button'

const loginSchema = z.object({
  username: z.string().trim().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
})
const registerSchema = z
  .object({
    username: z.string().trim().min(2, '用户名至少 2 个字符').max(32),
    email: z.email('请输入有效邮箱'),
    password: z.string().min(8, '密码至少 8 位'),
    repeatPassword: z.string(),
    birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '请选择生日'),
    inputCode: z.string().trim().min(1, '请输入邮箱验证码'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ['repeatPassword'],
    message: '两次密码不一致',
  })

/** 登录返回地址只接受站内路径，阻止外部跳转与登录循环。 */
export function safeRedirect(value: unknown): string {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /^\/(login|register)([/?#]|$)/.test(value)
  )
    return '/'
  return value
}

/** 登录和注册共享页面框架，表单各自保存完整错误状态。 */
export function AuthPage({
  registration = false,
  redirect = '/',
}: {
  registration?: boolean
  redirect?: string
}) {
  return (
    <section className="auth-layout">
      <div className="auth-visual">
        <img src="/assets/mountains.jpg" alt="山川与自然" />
        <div className="auth-visual-copy">
          <span className="auth-kicker">VIDEOWEB COMMUNITY</span>
          <h1>
            记录所见，
            <br />
            分享热爱。
          </h1>
          <p>让每一个视角，都拥有自己的观众。</p>
          <small>VideoWeb · 每一种热爱，都值得被看见</small>
        </div>
      </div>
      <div className="auth-form-area">
        <div className="auth-form-wrap">
          <Link
            to="/"
            search={{ category: config.categories[0] || '科技', page: 1 }}
            className="back-link"
          >
            ← 返回首页
          </Link>
          <div className="auth-heading">
            <span className="eyebrow">{registration ? '加入社区' : '欢迎回来'}</span>
            <h2>{registration ? '创建你的账户' : '登录 VideoWeb'}</h2>
            <p>{registration ? '从这里，开启你的分享之旅。' : '继续发现与分享你的热爱。'}</p>
          </div>
          {registration ? <RegisterForm /> : <LoginForm redirect={redirect} />}
          <p className="auth-switch">
            {registration ? '已经有账户？' : '还没有账户？'}
            <Link
              to={registration ? '/login' : '/register'}
              search={registration ? { redirect: '/' } : {}}
            >
              {registration ? '立即登录' : '创建账户'}
              <ArrowRight size={14} />
            </Link>
          </p>
          {!config.demo && !registration && (
            <button className="demo-entry" onClick={() => switchMode(true)}>
              先浏览演示环境
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function LoginForm({ redirect }: { redirect: string }) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: config.demo ? 'demo' : '',
      password: config.demo ? 'VideoWeb2026!' : '',
    },
  })
  const submit = form.handleSubmit(async (values) => {
    try {
      await login(values.username, values.password)
      router.history.replace(safeRedirect(redirect))
      await router.load()
      toast.success('欢迎回来')
    } catch (error) {
      form.setError('root', { message: errorMessage(error) })
    }
  })
  return (
    <form className="form-stack" onSubmit={submit}>
      <label>
        用户名
        <input
          autoComplete="username"
          placeholder="输入用户名"
          {...form.register('username')}
          aria-invalid={!!form.formState.errors.username}
        />
        {form.formState.errors.username && (
          <span className="field-error">{form.formState.errors.username.message}</span>
        )}
      </label>
      <label>
        密码
        <div className="password-field">
          <input
            type={visible ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="输入密码"
            {...form.register('password')}
            aria-invalid={!!form.formState.errors.password}
          />
          <button
            type="button"
            aria-label={visible ? '隐藏密码' : '显示密码'}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {form.formState.errors.password && (
          <span className="field-error">{form.formState.errors.password.message}</span>
        )}
      </label>
      {form.formState.errors.root && (
        <p className="form-error" role="alert">
          {form.formState.errors.root.message}
        </p>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
        {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}
        登录
      </Button>
    </form>
  )
}

function RegisterForm() {
  const router = useRouter()
  const [cooldown, setCooldown] = useState(0)
  const [sending, setSending] = useState(false)
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
      birthday: '',
      inputCode: '',
    },
  })
  useEffect(() => {
    if (!cooldown) return
    const id = window.setTimeout(() => setCooldown((v) => v - 1), 1000)
    return () => clearTimeout(id)
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
  const submit = form.handleSubmit(async (values) => {
    try {
      await registerAccount(values)
      toast.success('注册成功，请登录')
      router.history.replace('/login')
      await router.load()
    } catch (error) {
      form.setError('root', { message: errorMessage(error) })
    }
  })
  return (
    <form className="form-stack" onSubmit={submit}>
      {(['username', 'email'] as const).map((key) => (
        <label key={key}>
          {key === 'username' ? '用户名' : '邮箱'}
          <input
            type={key === 'email' ? 'email' : 'text'}
            autoComplete={key === 'email' ? 'email' : 'username'}
            {...form.register(key)}
          />
          {form.formState.errors[key] && (
            <span className="field-error">{form.formState.errors[key]?.message}</span>
          )}
        </label>
      ))}
      <label>
        邮箱验证码
        <div className="input-action">
          <input autoComplete="one-time-code" {...form.register('inputCode')} />
          <Button
            variant="outline"
            type="button"
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
      <div className="form-columns">
        {(['password', 'repeatPassword'] as const).map((key) => (
          <label key={key}>
            {key === 'password' ? '密码' : '确认密码'}
            <input type="password" autoComplete="new-password" {...form.register(key)} />
            {form.formState.errors[key] && (
              <span className="field-error">{form.formState.errors[key]?.message}</span>
            )}
          </label>
        ))}
      </div>
      <label>
        生日
        <input
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          {...form.register('birthday')}
        />
        {form.formState.errors.birthday && (
          <span className="field-error">{form.formState.errors.birthday.message}</span>
        )}
      </label>
      {form.formState.errors.root && (
        <p className="form-error" role="alert">
          {form.formState.errors.root.message}
        </p>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}创建账户
        <ArrowRight />
      </Button>
    </form>
  )
}
