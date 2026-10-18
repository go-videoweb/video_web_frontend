import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** 合并条件样式并消除冲突的 Tailwind 类。 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** ID 始终保留十进制字符串，拒绝非正数和已丢失精度的数值。 */
export function positiveId(value: unknown): string {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value))
    throw new Error('接口返回了无效的资源 ID')
  return value
}

/** 计数使用 BigInt 避免 64 位计数在格式化前丢失精度。 */
export function formatCount(value: string | number = 0) {
  try {
    const n = BigInt(value)
    if (n >= 10000n) return `${Number(n / 1000n) / 10}万`
    return n.toLocaleString('zh-CN')
  } catch {
    return '0'
  }
}

/** 时间只在展示时转换成本地格式，服务端仍使用 RFC3339。 */
export function formatDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return '日期未提供'
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

/** 弹幕时间使用后端约定的 hh:mm:ss，按播放秒数向下取整。 */
export function playbackTime(seconds: number) {
  const n = Math.max(0, Math.floor(seconds))
  return [Math.floor(n / 3600), Math.floor((n % 3600) / 60), n % 60]
    .map((v) => String(v).padStart(2, '0'))
    .join(':')
}

/** 只允许本站或 http(s) 资源，文件系统路径不能直接用于图片。 */
export function publicImage(value?: string): string | undefined {
  if (!value || value.includes('\\') || /^[a-z]:/i.test(value)) return undefined
  if (/^https?:\/\//i.test(value) || (value.startsWith('/') && !value.startsWith('//')))
    return value
  return undefined
}
