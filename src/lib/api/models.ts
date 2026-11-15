import { z } from 'zod'

const id = z.string().regex(/^[1-9]\d*$/)
const count = z
  .union([z.string().regex(/^\d+$/), z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)])
  .transform(String)
  .default('0')
const text = z.string().default('')

/** 接口零值可能省略，只有资源身份属于必须字段。 */
export const videoSummarySchema = z.object({
  videoId: id,
  title: text,
  publisherName: text,
  coverPath: text,
  description: text,
  duration: text,
  createdTime: z
    .string()
    .nullish()
    .transform((value) => value ?? ''),
  cntViewed: count,
  cntBarrages: count,
})
export type VideoSummary = z.infer<typeof videoSummarySchema>
export const videoDetailSchema = z.object({
  videoId: id,
  publisherId: id,
  publisherName: text,
  title: text,
  description: text,
  coverPath: text,
  duration: text,
  createdTime: z
    .string()
    .nullish()
    .transform((value) => value ?? ''),
  classes: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  records: z
    .object({ cntViewed: count, cntBarrages: count, cntFavorites: count, cntShares: count })
    .default({ cntViewed: '0', cntBarrages: '0', cntFavorites: '0', cntShares: '0' }),
})
export type VideoDetail = z.infer<typeof videoDetailSchema>
const relationId = z.string().regex(/^\d+$/)
const flag = z.union([z.literal(1), z.literal(-1)])
/** 个人状态单独解码；null 表示此次请求没有可用身份。 */
export const videoStatusSchema = z.object({
  isUpvoted: flag,
  isFavorited: flag,
  isShared: flag,
  isThrownShells: flag,
  favoriteId: relationId,
  favoriteRecordId: relationId,
})
export const commentSchema = z.object({
  commentId: id,
  publisherId: id,
  rootId: text,
  parentId: text,
  content: text,
  createdAt: z
    .string()
    .nullish()
    .transform((value) => value ?? ''),
  upvoteCount: count,
  cntReplies: z.number().default(0),
  ipAddress: text,
  isUpvoted: z.boolean().default(false),
  reference: z
    .object({
      commentId: id,
      publisherId: z.string(),
      content: text,
      unavailable: z.boolean().default(false),
    })
    .nullish(),
})
export type Comment = z.infer<typeof commentSchema>
export const userSchema = z.object({
  userName: text,
  email: text,
  signature: text,
  avatarPath: text,
  gender: z.number().default(0),
  birthday: text,
  shells: z.number().default(0),
  cntFans: z.number().default(0),
  cntFollows: z.number().default(0),
  cntVideos: z.number().default(0),
})
export type UserInfo = z.infer<typeof userSchema>
