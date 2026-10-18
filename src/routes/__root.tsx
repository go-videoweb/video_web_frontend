import { createRootRouteWithContext, Link } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Shell } from '@/components/layout/shell'
import { EmptyState, ErrorState } from '@/components/states'
import { Button } from '@/components/ui/button'
import { config } from '@/lib/config'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: Shell,
  notFoundComponent: () => (
    <EmptyState
      title="页面不存在"
      description="这个地址可能已失效。"
      action={
        <Button asChild>
          <Link to="/" search={{ category: config.categories[0] || '科技', page: 1 }}>
            回到首页
          </Link>
        </Button>
      }
    />
  ),
  errorComponent: ({ error, reset }) => <ErrorState error={error} retry={reset} />,
})
