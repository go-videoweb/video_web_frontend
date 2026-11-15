import { z } from 'zod'
import { request } from '@/lib/api/client'
import type { components } from '@/lib/api/generated'
import { session } from './session'

const loginResponse = z.object({
  data: z.object({
    userId: z.string().regex(/^[1-9]\d*$/),
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
  }),
})
/** 登录结果经运行时校验后写入会话，注册 token 不走此流程。 */
export async function login(username: string, password: string) {
  const result = await request<components['schemas']['gateway.api.v1.user.id.LoginResp']>(
    '/user/login',
    { method: 'POST', auth: false, body: { username, password } },
  )
  const data = loginResponse.parse(result).data
  session.set(data)
  return data
}

/** 注册成功返回完整会话；失败由表单区分账号已创建与未确认结果。 */
export async function registerAccount(body: {
  username: string
  password: string
  repeatPassword: string
  email: string
  birthday: string
  inputCode: string
  gender?: number
  signature?: string
}) {
  const result = await request('/user/register', { method: 'POST', auth: false, body })
  const data = loginResponse.parse(result).data
  session.set(data)
  return data
}

/** 验证码由服务端发送和验证，响应中的测试码不展示给用户。 */
export function sendEmailCode(
  email: string,
  purpose: 'register' | 'change_email' | 'reset_password',
) {
  return request(`/captcha/codeCaptcha?${new URLSearchParams({ email, purpose })}`, {
    auth: false,
    cache: 'no-store',
  })
}

/** 忘记密码不携带旧凭据；调用方在确认密码已更新后清除旧会话。 */
export function resetPassword(body: { email: string; inputCode: string; newPassword: string }) {
  return request('/userinfo/forgetPassword', { method: 'POST', auth: false, body })
}

/** 图形验证码暂未绑定登录验证流程，只保留真实接口适配。 */
export function getImageCaptcha() {
  return request('/captcha/graphicCaptcha', { auth: false })
}

/** 服务端退出失败时仍清理本标签页；调用者负责显示服务端结果。 */
export async function logout() {
  const id = session.get()?.userId
  try {
    if (id) await request(`/user/${id}/logout`, { method: 'POST', body: {}, auth: true })
  } finally {
    session.set(null)
  }
}
