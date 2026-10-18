import { describe, expect, it } from 'vitest'
import { positiveId, playbackTime, publicImage, formatCount } from './utils'
import { videoSummarySchema } from './api/models'
import { safeRedirect } from '@/features/auth/auth-page'

describe('边界数据', () => {
  it('大 ID 保留原值并拒绝数字输入', () => {
    expect(positiveId('9007199254740993')).toBe('9007199254740993')
    expect(() => positiveId(9007199254740992)).toThrow()
    expect(() => positiveId('-1')).toThrow()
  })
  it('零值省略时摘要得到稳定默认值', () => {
    expect(videoSummarySchema.parse({ videoId: '9007199254740993', title: '测试' })).toMatchObject({
      cntViewed: '0',
      duration: '',
      publisherName: '',
    })
  })
  it('拒绝丢失精度的计数', () => {
    expect(() =>
      videoSummarySchema.parse({ videoId: '1', cntViewed: Number.MAX_SAFE_INTEGER + 1 }),
    ).toThrow()
  })
  it('媒体不能使用服务器磁盘路径或脚本 URL', () => {
    expect(publicImage('D:\\resources\\avatar.png')).toBeUndefined()
    expect(publicImage('javascript:alert(1)')).toBeUndefined()
    expect(publicImage('//outside.test/image')).toBeUndefined()
    expect(publicImage('/api/avatar/1')).toBe('/api/avatar/1')
  })
  it('播放秒数转换为后端弹幕时间', () => {
    expect(playbackTime(3661.9)).toBe('01:01:01')
    expect(playbackTime(-2)).toBe('00:00:00')
  })
  it('大计数按 BigInt 格式化', () => {
    expect(formatCount('12000')).toBe('1.2万')
    expect(formatCount('0')).toBe('0')
  })
  it('返回地址只允许站内非登录路径', () => {
    for (const value of [
      'https://outside.test',
      '//outside.test',
      '/\\outside.test',
      '/login?redirect=/',
    ])
      expect(safeRedirect(value)).toBe('/')
    expect(safeRedirect('/watch/9007199254740993')).toBe('/watch/9007199254740993')
  })
})
