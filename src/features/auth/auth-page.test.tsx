import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { afterEach, expect, it, vi } from 'vitest'
import { AuthPage } from './auth-page'
import { session } from './session'

afterEach(() => {
  vi.unstubAllGlobals()
  session.set(null)
})
function renderLogin() {
  const root = createRootRoute({ component: Outlet })
  const home = createRoute({
    getParentRoute: () => root,
    path: '/',
    component: () => <h1>已返回首页</h1>,
  })
  const login = createRoute({
    getParentRoute: () => root,
    path: '/login',
    component: () => <AuthPage />,
  })
  const router = createRouter({
    routeTree: root.addChildren([home, login]),
    history: createMemoryHistory({ initialEntries: ['/login'] }),
  })
  return render(<RouterProvider router={router} />)
}

it('无效登录表单不发送请求并显示字段错误', async () => {
  const fetch = vi.fn()
  vi.stubGlobal('fetch', fetch)
  renderLogin()
  await screen.findByRole('button', { name: /^登录$/ })
  await userEvent.click(screen.getByRole('button', { name: /^登录$/ }))
  expect(await screen.findByText('请输入用户名')).toBeVisible()
  expect(fetch).not.toHaveBeenCalled()
})

it('业务失败保留用户输入并展示服务端说明', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ code: 4001, reason: 'LOGIN_FAILED', message: '用户名或密码错误' }),
          { headers: { 'Content-Type': 'application/json' } },
        ),
      ),
  )
  renderLogin()
  await userEvent.type(await screen.findByLabelText('用户名'), 'somebody')
  await userEvent.type(screen.getByLabelText('密码', { exact: true }), 'not-a-real-password')
  await userEvent.click(screen.getByRole('button', { name: /^登录$/ }))
  expect(await screen.findByRole('alert')).toHaveTextContent('用户名或密码错误')
  expect(screen.getByLabelText('用户名')).toHaveValue('somebody')
  expect(session.get()).toBeNull()
})

it('登录后保留大用户 ID 并返回首页', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            userId: '9007199254740993',
            accessToken: 'test-access',
            refreshToken: 'test-refresh',
          },
        }),
        { headers: { 'Content-Type': 'application/json' } },
      ),
    ),
  )
  renderLogin()
  await userEvent.type(await screen.findByLabelText('用户名'), 'someone')
  await userEvent.type(screen.getByLabelText('密码', { exact: true }), 'example-password')
  await userEvent.click(screen.getByRole('button', { name: /^登录$/ }))
  await waitFor(() => expect(session.get()?.userId).toBe('9007199254740993'))
  expect(await screen.findByRole('heading', { name: '已返回首页' })).toBeVisible()
})
