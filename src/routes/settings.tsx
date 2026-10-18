import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/features/users/settings-page'

export const Route = createFileRoute('/settings')({ component: SettingsPage })
