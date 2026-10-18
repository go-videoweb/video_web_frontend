import { createFileRoute } from '@tanstack/react-router'
import { config } from '@/lib/config'
import { Discover } from '@/features/videos/discover-page'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    category:
      typeof search.category === 'string' && config.categories.includes(search.category)
        ? search.category
        : config.categories[0] || '科技',
    page:
      Number.isSafeInteger(Number(search.page)) &&
      Number(search.page) > 0 &&
      Number(search.page) <= 100000
        ? Number(search.page)
        : 1,
  }),
  component: Discover,
})
