import { createFileRoute } from '@tanstack/react-router'
import { safeRedirect } from '@/features/auth/auth-page'
import { LoginPage } from '@/features/auth/login-page'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: safeRedirect(search.redirect),
  }),
  component: LoginPage,
})
