import { QueryClient } from '@tanstack/react-query'

/** 默认不自动重试或聚焦刷新，避免详情计数及分享等副作用重复执行。 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 60_000,
    },
    mutations: { retry: false },
  },
})
