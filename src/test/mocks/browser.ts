import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/** Service Worker 必须在显式演示环境下由入口主动启动。 */
export const worker = setupWorker(...handlers)
