import { useSyncExternalStore } from 'react'
import { z } from 'zod'
import { config } from '@/lib/config'

const schema = z.object({
  userId: z.string().regex(/^[1-9]\d*$/),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
})
/** 登录凭据仅保存在当前标签页，不作为服务端权限判断依据。 */
export type Session = z.infer<typeof schema>
const key = config.demo ? 'vw.demo.session' : 'vw.session'
const listeners = new Set<() => void>()
let generation = 0
let current: Session | null = readStored()

function readStored(): Session | null {
  try {
    return schema.parse(JSON.parse(sessionStorage.getItem(key) || 'null'))
  } catch {
    return null
  }
}

/** 会话世代在登录/退出时改变，旧请求不能覆盖新的身份。 */
export const session = {
  get: () => current,
  generation: () => generation,
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  set(value: Session | null) {
    current = value ? schema.parse(value) : null
    generation++
    try {
      if (current) sessionStorage.setItem(key, JSON.stringify(current))
      else sessionStorage.removeItem(key)
    } catch {
      /* 存储不可用时保留内存会话。 */
    }
    listeners.forEach((listener) => listener())
  },
  refresh(accessToken: string, expectedGeneration: number) {
    if (current && generation === expectedGeneration) {
      current = { ...current, accessToken }
      try {
        sessionStorage.setItem(key, JSON.stringify(current))
      } catch {
        /* 不影响当前内存凭据。 */
      }
      listeners.forEach((listener) => listener())
      return true
    }
    return false
  },
}

/** 组件通过稳定快照订阅登录态。 */
export function useSession() {
  return useSyncExternalStore(session.subscribe, session.get)
}
