import { createFileRoute } from '@tanstack/react-router'
import { FavoritesPage } from '@/features/favorites/favorites-page'
export const Route = createFileRoute('/favorites')({
  component: FavoritesPage,
  validateSearch: (search: Record<string, unknown>) => {
    const folder =
      typeof search.folder === 'number' && Number.isSafeInteger(search.folder)
        ? String(search.folder)
        : search.folder
    return { folder: typeof folder === 'string' && /^[1-9]\d*$/.test(folder) ? folder : undefined }
  },
})
