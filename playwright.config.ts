import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'

const channel =
  process.env.PLAYWRIGHT_CHANNEL ||
  (existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
    ? 'chrome'
    : existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')
      ? 'msedge'
      : undefined)

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 12_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5173',
    channel,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } },
    },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 } } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
  ],
  webServer: {
    command: 'pnpm dev --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
