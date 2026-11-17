import { createFileRoute } from '@tanstack/react-router'
import { FollowingPage } from '@/features/users/following-page'
export const Route = createFileRoute('/following')({ component: FollowingPage })
