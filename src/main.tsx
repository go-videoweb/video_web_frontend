import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Toaster } from 'sonner'
import { routeTree } from './routeTree.gen'
import { queryClient } from '@/lib/query'
import { config } from '@/lib/config'
import { session } from '@/features/auth/session'
import './styles/index.css'

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: false,
  scrollRestoration: true,
  defaultPendingMs: 250,
})
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

/** 演示环境显式启动 MSW，真实模式不会导入模拟处理器或静默回退。 */
async function start() {
  if (config.demo) {
    sessionStorage.setItem('vw.demo', '1')
    const { worker } = await import('./test/mocks/browser')
    await worker.start({ quiet: true, onUnhandledFrame: 'bypass' })
    if (!sessionStorage.getItem('vw.demo.visited')) {
      session.set({
        userId: '9007199254740993',
        accessToken: 'demo-access',
        refreshToken: 'demo-refresh',
      })
      sessionStorage.setItem('vw.demo.visited', '1')
    }
  }
  let previousUser = session.get()?.userId
  const unsubscribe = session.subscribe(() => {
    const userId = session.get()?.userId
    if (previousUser !== userId) {
      previousUser = userId
      void queryClient.cancelQueries()
      queryClient.clear()
    }
  })
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Tooltip.Provider delayDuration={250}>
          <RouterProvider router={router} />
          <Toaster richColors position="bottom-right" closeButton />
        </Tooltip.Provider>
      </QueryClientProvider>
    </StrictMode>,
  )
  import.meta.hot?.dispose(unsubscribe)
}

void start().catch(() => {
  document.getElementById('root')!.textContent = '应用启动失败，请刷新页面后重试。'
})
