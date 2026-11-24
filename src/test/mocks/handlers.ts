import { ErrorCode } from '@/lib/api/error-codes'
import { http, HttpResponse, delay } from 'msw'
import { demoVideos, demoDetail, demoUser, demoUserId, initialComments } from './fixtures'
import type { Comment } from '@/lib/api/models'

import { demoFavoriteState, socialHandlers } from './social'
import type { Barrage } from '@/features/videos/api'
const barrages = new Map<string, Barrage[]>()
let barrageId = 9007199254910000n
const base = '*/api/v1'
const comments = new Map<string, Comment[]>()
const replies = new Map<string, Comment[]>()
const liked = new Set<string>()
const profile = { ...demoUser }
const failure = (code: number, message: string, reason: string) =>
  HttpResponse.json({ code, reason, message })
const ok = (message = '操作成功') => HttpResponse.json({ statusCode: 200, message })
const authorized = (request: Request) =>
  request.headers.get('Authorization') === 'Bearer demo-access' &&
  request.headers.get('Refresh-Token') === 'Bearer demo-refresh'
const list = (id: string) => {
  if (!comments.has(id)) {
    comments.set(
      id,
      initialComments.map((item) => ({ ...item })),
    )
    replies.set(`${id}:${initialComments[0]!.commentId}`, [
      {
        ...initialComments[1]!,
        commentId: '9007199254760001',
        rootId: initialComments[0]!.commentId,
        parentId: initialComments[0]!.commentId,
        content: '谢谢喜欢，也期待看到你的作品。',
        cntReplies: 0,
      },
    ])
  }
  return comments.get(id)!
}

function commentPage(
  items: Comment[],
  url: URL,
  videoId: string,
  rootId: string,
  order: string,
  key: 'comments' | 'replies',
) {
  const sortBy = url.searchParams.get('sort_by') ?? 'created_at'
  const after = url.searchParams.get('cursor.comment_id')
  const unread = items.slice(after ? items.findIndex((item) => item.commentId === after) + 1 : 0)
  const batch = unread.slice(0, 30)
  const last = batch.at(-1)
  const hasMore = unread.length > 30
  return {
    [key]: batch,
    hasMore,
    nextCursor:
      hasMore && last
        ? {
            videoId,
            rootId,
            sortBy,
            order,
            commentId: last.commentId,
            createdAt: last.createdAt,
            upvoteCount: last.upvoteCount,
          }
        : null,
  }
}

/** MSW 仅在显式演示模式或测试中启动，不代理不存在的服务端能力。 */
export const handlers = [
  ...socialHandlers,
  http.post(`${base}/user/login`, async ({ request }) => {
    const body = (await request.json()) as { username?: string; password?: string }
    await delay(120)
    return body.username && body.password
      ? HttpResponse.json({
          statusCode: 200,
          msg: 'success',
          data: { userId: demoUserId, accessToken: 'demo-access', refreshToken: 'demo-refresh' },
        })
      : failure(
          body.username ? ErrorCode.UserPasswordEmpty : ErrorCode.UserNameEmpty,
          '请输入用户名和密码',
          body.username ? '密码为空' : '用户名为空',
        )
  }),
  http.post(`${base}/user/register`, async () => {
    await delay(100)
    return HttpResponse.json({
      statusCode: 200,
      msg: 'success',
      data: { userId: demoUserId, accessToken: 'demo-access', refreshToken: 'demo-refresh' },
    })
  }),
  http.post(`${base}/user/:userId/logout`, () => ok()),
  http.get(`${base}/captcha/codeCaptcha`, ({ request }) =>
    ['register', 'change_email', 'reset_password'].includes(
      new URL(request.url).searchParams.get('purpose') ?? '',
    )
      ? ok('已申请发信')
      : failure(ErrorCode.InvalidCodePurpose, '缺少验证码用途', 'INVALID_CODE_PURPOSE'),
  ),
  http.post(`${base}/userinfo/forgetPassword`, () =>
    HttpResponse.json({ common: { status: 200, message: '密码已更新' } }),
  ),
  http.get(`${base}/video/list`, async ({ request }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    await delay(80)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page_num') || '1')
    const category = url.searchParams.get('class')
    return HttpResponse.json({
      VideoSummary: demoVideos
        .filter((v) => !category || v.category === category)
        .slice((page - 1) * 12, page * 12)
        .map(
          ({ category: _category, image: _image, publisherId: _publisherId, ...value }) => value,
        ),
    })
  }),
  http.get(`${base}/video/:videoId/info`, async ({ params, request }) => {
    await delay(70)
    const video = demoVideos.find((v) => v.videoId === params.videoId)
    return video
      ? HttpResponse.json({
          videoDetail: demoDetail(video),
          userVideoStatus: authorized(request)
            ? {
                isUpvoted: liked.has(`${params.videoId}:upvote`) ? 1 : -1,
                isFavorited: demoFavoriteState(String(params.videoId)) ? 1 : -1,
                isShared: liked.has(`${params.videoId}:share`) ? 1 : -1,
                isThrownShells: -1,
                favoriteId: '0',
                favoriteRecordId: '0',
                ...demoFavoriteState(String(params.videoId)),
              }
            : null,
        })
      : failure(ErrorCode.VideoNotFound, '视频不存在', 'VIDEO_NOT_FOUND')
  }),
  http.get(`${base}/:userId/video/:videoId/cover`, ({ params }) => {
    const video = demoVideos.find((v) => v.videoId === params.videoId)
    return HttpResponse.redirect(`/assets/${video?.image || 'mountains'}.jpg`)
  }),
  http.get(`${base}/:userId/video/:videoId/dash/mpd`, async () => {
    // 仅演示使用可控故障开关，测试真实播放器的失败与手动恢复。
    if (sessionStorage.getItem('vw.demo.failMedia') === '1')
      return new HttpResponse(null, { status: 404 })
    const response = await fetch('/assets/demo-dash/dash.mpd')
    return new HttpResponse(await response.text(), {
      status: response.status,
      headers: { 'Content-Type': 'application/dash+xml' },
    })
  }),
  http.get(`${base}/:userId/video/:videoId/dash/:segment`, async ({ params }) => {
    const segment = String(params.segment)
    if (!/^[a-zA-Z0-9.-]+\.m4s$/.test(segment)) return new HttpResponse(null, { status: 400 })
    const response = await fetch(`/assets/demo-dash/${segment}`)
    return new HttpResponse(await response.arrayBuffer(), {
      status: response.status,
      headers: { 'Content-Type': 'video/iso.segment' },
    })
  }),
  http.get(`${base}/:userId/video/:videoId/file`, async ({ request }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const response = await fetch('/assets/sintel-trailer.mp4')
    return new HttpResponse(await response.arrayBuffer(), {
      headers: { 'Content-Type': 'video/mp4' },
    })
  }),
  http.get(`${base}/userinfo/:userId`, ({ request, params }) =>
    authorized(request)
      ? HttpResponse.json({
          userInfo: {
            ...profile,
            userName:
              params.userId === demoUserId
                ? profile.userName
                : ['城市漫游者', '山野来信', '日常切片'][
                    Number(BigInt(String(params.userId)) % 3n)
                  ],
          },
        })
      : failure(ErrorCode.TokenMissing, '请先登录', 'token缺失'),
  ),
  http.post(`${base}/userinfo/:userId/:action`, async ({ request, params }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const body = (await request.json()) as Record<string, string>
    if (params.action === 'modifyUsername') profile.userName = body.newUsername || profile.userName
    if (params.action === 'modifySignature') profile.signature = body.signature || ''
    if (params.action === 'modifyEmail') profile.email = body.email || profile.email
    return ok()
  }),
  http.get(`${base}/users/:userId/avatar`, () => HttpResponse.redirect('/assets/forest.jpg')),
  http.put(`${base}/user/profile/avatar`, async ({ request }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    if (!(await request.formData()).has('avatar'))
      return failure(ErrorCode.AvatarRequired, '缺少头像', 'AVATAR_REQUIRED')
    profile.avatarPath = `/api/v1/users/${demoUserId}/avatar`
    return HttpResponse.json({
      statusCode: 200,
      message: '头像已更新',
      avatarUrl: profile.avatarPath,
    })
  }),
  http.get(`${base}/video/:videoId/comment`, ({ request, params }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const url = new URL(request.url)
    const values = [...list(String(params.videoId))]
    if (url.searchParams.get('sort_by') === 'cnt_upvote')
      values.sort((a, b) => Number(BigInt(b.upvoteCount) - BigInt(a.upvoteCount)))
    return HttpResponse.json({
      ...commentPage(values, url, String(params.videoId), '0', 'desc', 'comments'),
      totalCount: values.length,
    })
  }),
  http.post(`${base}/video/:videoId/comment`, async ({ request, params }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const body = (await request.json()) as { content: string; parentId: string }
    const commentId = (9007199254800000n + BigInt(Date.now())).toString()
    const roots = list(String(params.videoId))
    const comment: Comment = {
      commentId,
      publisherId: demoUserId,
      rootId: commentId,
      parentId: body.parentId,
      isUpvoted: false,
      content: body.content,
      createdAt: new Date().toISOString(),
      upvoteCount: '0',
      cntReplies: 0,
      ipAddress: '',
    }
    if (body.parentId === '-1') roots.unshift(comment)
    else {
      const parent =
        roots.find((item) => item.commentId === body.parentId) ||
        [...replies.values()].flat().find((item) => item.commentId === body.parentId)
      const rootId = parent?.rootId
      const root = roots.find((item) => item.commentId === rootId)
      if (!root) return failure(ErrorCode.CommentNotFound, '评论不存在', 'COMMENT_NOT_FOUND')
      const key = `${params.videoId}:${root.commentId}`
      const values = replies.get(key) || []
      values.push({
        ...comment,
        rootId: root.commentId,
        reference:
          parent && parent.commentId !== root.commentId
            ? {
                commentId: parent.commentId,
                publisherId: parent.publisherId,
                content: parent.content,
                unavailable: false,
              }
            : null,
      })
      replies.set(key, values)
      root.cntReplies++
    }
    return HttpResponse.json({ commentId })
  }),
  http.get(`${base}/video/:videoId/comments/:commentId/replies`, ({ request, params }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    list(String(params.videoId))
    return HttpResponse.json(
      commentPage(
        replies.get(`${params.videoId}:${params.commentId}`) ?? [],
        new URL(request.url),
        String(params.videoId),
        String(params.commentId),
        'asc',
        'replies',
      ),
    )
  }),
  http.put(`${base}/video/:videoId/comment/:commentId/upvote`, async ({ request, params }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const key = String(params.commentId)
    const { liked: desired } = (await request.json()) as { liked?: boolean }
    if (typeof desired !== 'boolean')
      return failure(ErrorCode.InvalidCommentLike, '缺少 liked', 'INVALID_COMMENT_LIKE')
    const comment =
      list(String(params.videoId)).find((v) => v.commentId === key) ||
      [...replies.entries()]
        .filter(([id]) => id.startsWith(`${params.videoId}:`))
        .flatMap(([, values]) => values)
        .find((v) => v.commentId === key)
    if (!comment) return failure(ErrorCode.CommentNotFound, '评论不存在', 'COMMENT_NOT_FOUND')
    if (comment.isUpvoted !== desired)
      comment.upvoteCount = String(BigInt(comment.upvoteCount) + (desired ? 1n : -1n))
    comment.isUpvoted = desired
    return HttpResponse.json({
      statusCode: 200,
      isUpvoted: desired,
      upvoteCount: comment.upvoteCount,
    })
  }),
  http.get(`${base}/video/interaction/:videoId/share`, ({ request, params }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    liked.add(`${params.videoId}:share`)
    return HttpResponse.json({
      statusCode: 200,
      url: new URL(`/watch/${params.videoId}`, request.url).href,
    })
  }),
  http.put(`${base}/video/interaction/:videoId/:action`, ({ request, params }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const key = `${params.videoId}:${params.action}`
    const already = liked.has(key)
    if (already) liked.delete(key)
    else liked.add(key)
    return ok(params.action === 'upvote' ? (already ? '已取消点赞' : '视频点赞成功') : '操作成功')
  }),
  http.get(`${base}/video/:videoId/barrages`, ({ request, params }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const q = new URL(request.url).searchParams
    const startSecond = Number(q.get('start_second'))
    const endSecond = Number(q.get('end_second'))
    const cursor = q.get('cursor.barrage_id')
    const rows = (barrages.get(String(params.videoId)) ?? [])
      .filter((i) => i.positionSecond >= startSecond && i.positionSecond < endSecond)
      .sort((a, b) => a.positionSecond - b.positionSecond || a.barrageId.localeCompare(b.barrageId))
    const unread = rows.slice(cursor ? rows.findIndex((i) => i.barrageId === cursor) + 1 : 0)
    const batch = unread.slice(0, 500)
    const last = batch.at(-1)
    const hasMore = unread.length > 500
    return HttpResponse.json({
      barrages: batch,
      hasMore,
      nextCursor:
        hasMore && last
          ? {
              videoId: String(params.videoId),
              startSecond,
              endSecond,
              positionSecond: last.positionSecond,
              barrageId: last.barrageId,
            }
          : null,
    })
  }),
  http.post(`${base}/video/interaction/:videoId/barrage/send`, async ({ request, params }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const data = (await request.json()) as Pick<Barrage, 'positionSecond' | 'content' | 'color'>
    if (!Number.isInteger(data.positionSecond) || data.positionSecond < 0)
      return failure(ErrorCode.InvalidBarrage, '弹幕位置无效', 'INVALID_BARRAGE')
    const id = String(params.videoId)
    barrages.set(id, [
      ...(barrages.get(id) ?? []),
      { ...data, barrageId: String(++barrageId), isUpvoted: false, upvoteCount: '0' },
    ])
    return ok('弹幕已发送')
  }),
  http.put(`${base}/video/interaction/:videoId/barrage/upvote`, async ({ request, params }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const data = (await request.json()) as { liked: boolean; barrageId: string }
    const item = barrages.get(String(params.videoId))?.find((i) => i.barrageId === data.barrageId)
    if (typeof data.liked !== 'boolean')
      return failure(ErrorCode.InvalidBarrageLike, '缺少 liked', 'INVALID_BARRAGE_LIKE')
    if (!item) return failure(ErrorCode.BarrageNotFound, '弹幕不存在', 'BARRAGE_NOT_FOUND')
    if (item.isUpvoted !== data.liked)
      item.upvoteCount = String(BigInt(item.upvoteCount) + (data.liked ? 1n : -1n))
    item.isUpvoted = data.liked
    return HttpResponse.json({
      statusCode: 200,
      isUpvoted: item.isUpvoted,
      upvoteCount: item.upvoteCount,
    })
  }),
  http.post(`${base}/:userId/video/metaInfo`, async ({ request }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const body = (await request.json()) as {
      videoInfo: { title: string; description: string; classes: string[] }
    }
    const videoId = (9007199254900000n + BigInt(Date.now())).toString()
    demoVideos.unshift({
      ...demoVideos[0]!,
      videoId,
      title: body.videoInfo.title,
      description: body.videoInfo.description,
      category: body.videoInfo.classes[0] || '科技',
      createdTime: new Date().toISOString(),
      cntViewed: '0',
    })
    sessionStorage.setItem('vw.demo.upload.' + videoId, 'waiting_cover')
    return HttpResponse.json({ resp: { statusCode: 200 }, videoId })
  }),
  http.get(`${base}/video/:videoId/upload-status`, ({ params, request }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const key = 'vw.demo.upload.' + params.videoId
    const stage = sessionStorage.getItem(key)
    if (!stage)
      return failure(
        ErrorCode.UploadStatusNotFound,
        '找不到上传状态',
        'VIDEO_UPLOAD_STATUS_NOT_FOUND',
      )
    const status = stage.startsWith('processing:')
      ? Date.now() - Number(stage.split(':')[1]) > 1000
        ? 'completed'
        : 'processing'
      : stage
    return HttpResponse.json({ status, updatedTime: null, uploadErrorMsg: '' })
  }),
  http.post(`${base}/:userId/video/:videoId/:kind`, async ({ request, params }) => {
    if (!authorized(request)) return failure(ErrorCode.TokenMissing, '请先登录', 'token缺失')
    const key = 'vw.demo.upload.' + params.videoId
    const cover = params.kind === 'cover'
    const stage = sessionStorage.getItem(key)
    if (stage !== (cover ? 'waiting_cover' : 'waiting_video'))
      return failure(
        cover ? ErrorCode.CoverUploadStage : ErrorCode.FileUploadStage,
        '当前阶段不能上传该文件',
        cover ? 'VIDEO_COVER_UPLOAD_STAGE_INVALID' : 'VIDEO_FILE_UPLOAD_STAGE_INVALID',
      )
    if (!(await request.formData()).has(cover ? 'cover' : 'file'))
      return failure(ErrorCode.FormFileFailed, '缺少文件', '读取文件失败')
    await delay(200)
    sessionStorage.setItem(key, cover ? 'waiting_video' : 'processing:' + Date.now())
    return HttpResponse.json({ resp: { statusCode: 200, message: '已提交处理' } })
  }),
  http.all(`${base}/*`, () => failure(501, '当前演示不提供此接口', 'DEMO_NOT_IMPLEMENTED')),
]
