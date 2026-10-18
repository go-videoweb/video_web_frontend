import { createFileRoute } from '@tanstack/react-router'
import { Watch } from '@/features/videos/watch-page'

export const Route = createFileRoute('/watch/$videoId')({ component: Watch })
