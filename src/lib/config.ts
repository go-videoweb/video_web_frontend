const demo =
  typeof __DEMO_BUILD__ !== 'undefined' &&
  (__DEMO_BUILD__ ||
    new URLSearchParams(window.location.search).get('mode') === 'demo' ||
    sessionStorage.getItem('vw.demo') === '1')

/** 公开配置只包含浏览器可以读取的地址与分类，不保存服务端秘密。 */
export const config = {
  apiBase: demo ? '/api/v1' : String(import.meta.env.VITE_API_BASE || '/api/v1').replace(/\/$/, ''),
  categories: String(import.meta.env.VITE_VIDEO_CATEGORIES || '科技,生活,自然,人文,音乐,运动')
    .split(',')
    .map((v: string) => v.trim())
    .filter(Boolean),
  demo,
}

/** 演示环境切换会清理会话并重新加载，避免混用真实与演示身份。 */
export function switchMode(demo: boolean) {
  sessionStorage.removeItem('vw.session')
  sessionStorage.removeItem('vw.demo.session')
  sessionStorage.removeItem('vw.demo.visited')
  if (demo) sessionStorage.setItem('vw.demo', '1')
  else sessionStorage.removeItem('vw.demo')
  window.location.assign(demo ? '/?mode=demo' : '/')
}
