import type { VideoDetail, VideoSummary, Comment, UserInfo } from '@/lib/api/models'

/** 演示数据与真实 API 完全隔离，所有条目都只属于本地样例。 */
export const demoUserId = '9007199254740993'
const titles = [
  '光影之间：一段关于寻找的旅程',
  '城市的另一面，藏在清晨六点',
  '走进森林，听见时间的声音',
  '从地球出发，仰望星空',
  '建筑里的秩序与自由',
  '海岸线之外，还有一片蓝',
  '一段旋律，记录普通的一天',
  '打开一块电路板，看见微小的世界',
  '山与山之间，是出发的理由',
  '慢下来，城市也有温柔的瞬间',
  '没有目的地的林间漫步',
  '在宇宙尺度里重新认识自己',
  '当几何遇见光，空间有了温度',
  '与海风共度的一个下午',
  '把生活里微小的声音写成音乐',
  '技术与日常相遇的地方',
  '越过山丘，寻找下一片风景',
  '镜头里的城市记忆',
  '树梢之下的一千种绿色',
  '一场关于星空的想象',
  '从空间走向生活',
  '沿着潮汐的方向出发',
  '用旋律给今天写一封信',
  '创造，发生在每一次尝试之间',
]
const covers = [
  'mountains',
  'city',
  'forest',
  'space',
  'architecture',
  'ocean',
  'music',
  'technology',
]
const authors = ['像素之外', '城市漫游者', '山野来信', '日常切片']
export const demoVideos: (VideoSummary & {
  category: string
  image: string
  publisherId: string
})[] = titles.map((title, index) => ({
  videoId: (9007199254742001n + BigInt(index)).toString(),
  title,
  publisherName: authors[index % 4]!,
  publisherId: index % 4 === 0 ? demoUserId : String(9007199254740994n + BigInt(index % 4)),
  coverPath: '',
  description:
    '一段影像，一种视角。记录生活里的光、声音与那些值得停留的瞬间。\n\n本条内容为本地演示样例，播放使用 Blender 开放电影 Sintel 的预告片。',
  duration: '00:18',
  createdTime: new Date(Date.UTC(2026, 9, 17 - index)).toISOString(),
  cntViewed: String(14720 + index * 2831),
  cntBarrages: String(23 + index * 17),
  category: index < 14 ? '科技' : ['生活', '自然', '人文', '音乐', '运动'][index % 5]!,
  image: covers[index % covers.length]!,
}))

export const demoUser: UserInfo = {
  userName: '像素之外',
  email: 'demo@example.test',
  signature: '记录生活的每一种可能。',
  avatarPath: '',
  gender: 0,
  birthday: '1998-01-01',
  shells: 12,
  cntFans: 1280,
  cntFollows: 36,
  cntVideos: 8,
}
export const initialComments: Comment[] = [
  {
    commentId: '9007199254750001',
    publisherId: '9007199254740995',
    rootId: '0',
    content: '画面和音乐搭配得很舒服，看完忍不住想拿起相机出门了。',
    createdAt: '2026-10-17T09:30:00Z',
    upvoteCount: '24',
    cntReplies: 1,
    ipAddress: '',
  },
  {
    commentId: '9007199254750002',
    publisherId: demoUserId,
    rootId: '0',
    content: '有时候换一个角度，就能发现熟悉生活里的新东西。',
    createdAt: '2026-10-17T08:00:00Z',
    upvoteCount: '12',
    cntReplies: 0,
    ipAddress: '',
  },
  {
    commentId: '9007199254750003',
    publisherId: '9007199254740997',
    rootId: '0',
    content: '很喜欢这种安静的叙事，期待下一部作品。',
    createdAt: '2026-10-16T17:00:00Z',
    upvoteCount: '8',
    cntReplies: 0,
    ipAddress: '',
  },
]

/** 元信息与计数完全依照网关当前字段，不额外模拟缺失的个人状态。 */
export function demoDetail(video: (typeof demoVideos)[number]): VideoDetail {
  return {
    videoId: video.videoId,
    publisherId: video.publisherId,
    publisherName: video.publisherName,
    title: video.title,
    description: video.description,
    coverPath: '',
    duration: video.duration,
    createdTime: video.createdTime,
    classes: [video.category],
    tags: [video.category, '影像记录', '生活观察'],
    records: {
      cntViewed: video.cntViewed,
      cntBarrages: video.cntBarrages,
      cntFavorites: '286',
      cntShares: '42',
    },
  }
}
