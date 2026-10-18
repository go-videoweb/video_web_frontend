import { config } from '@/lib/config'
import { positiveId } from '@/lib/utils'

/** 路由保留的 user_id 使用 0，实际发布者由视频服务查询。 */
export function mediaUrl(videoId: string, kind: 'cover' | 'mpd') {
  return `${config.apiBase}/0/video/${positiveId(videoId)}/${kind === 'mpd' ? 'dash/mpd' : 'cover'}`
}

/** 下载属于受保护接口，由 API 客户端附加凭据后获取文件。 */
export function downloadPath(videoId: string) {
  return `/0/video/${positiveId(videoId)}/file`
}
