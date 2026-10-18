import { createFileRoute } from '@tanstack/react-router'
import { UserPage } from '@/features/users/user-page'

export const Route = createFileRoute('/users/$userId')({ component: UserPage })
