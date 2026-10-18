import { useSearch } from '@tanstack/react-router'
import { AuthPage } from './auth-page'

/** 登录页面读取经过路由校验的站内返回地址。 */
export function LoginPage() {
  return <AuthPage redirect={useSearch({ from: '/login' }).redirect} />
}
