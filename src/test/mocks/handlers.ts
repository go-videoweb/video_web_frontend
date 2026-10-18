import { http, HttpResponse, delay } from 'msw'
import { demoVideos, demoDetail, demoUser, demoUserId, initialComments } from './fixtures'
import type { Comment } from '@/lib/api/models'

const base = '*/api/v1'
const comments = new Map<string, Comment[]>()
const replies = new Map<string, Comment[]>()
const liked = new Set<string>()
const profile = { ...demoUser }
const failure = (code: number, message: string) =>
  HttpResponse.json({ code, reason: 'DEMO_ERROR', message })
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
        content: '谢谢喜欢，也期待看到你的作品。',
        cntReplies: 0,
      },
    ])
  }
  return comments.get(id)!
}

/** MSW 仅在显式演示模式或测试中启动，不代理不存在的服务端能力。 */
export const handlers = [
  http.post(`${base}/user/login`, async ({ request }) => {
    const body = (await request.json()) as { username?: string; password?: string }
    await delay(120)
    return body.username && body.password
      ? HttpResponse.json({
          statusCode: 200,
          msg: 'success',
          data: { userId: demoUserId, accessToken: 'demo-access', refreshToken: 'demo-refresh' },
        })
      : failure(400, '请输入用户名和密码')
  }),
  http.post(`${base}/user/register`, async () => {
    await delay(100)
    return HttpResponse.json({
      statusCode: 200,
      msg: 'success',
      data: { accessToken: 'registration-only', refreshToken: 'registration-only' },
    })
  }),
  http.post(`${base}/user/:userId/logout`, () => ok()),
  http.get(`${base}/captcha/codeCaptcha`, () => ok('验证码已发送')),
  http.get(`${base}/video/list`, async ({ request }) => {
    if (!authorized(request)) return failure(3003, '请先登录')
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
  http.get(`${base}/video/:videoId/info`, async ({ params }) => {
    await delay(70)
    const video = demoVideos.find((v) => v.videoId === params.videoId)
    return video
      ? HttpResponse.json({ videoDetail: demoDetail(video) })
      : HttpResponse.json(
          { code: 404, reason: 'NOT_FOUND', message: '视频不存在' },
          { status: 404 },
        )
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
    if (!authorized(request)) return failure(3003, '请先登录')
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
      : failure(3003, '请先登录'),
  ),
  http.post(`${base}/userinfo/:userId/:action`, async ({ request, params }) => {
    if (!authorized(request)) return failure(3003, '请先登录')
    const body = (await request.json()) as Record<string, string>
    if (params.action === 'modifyUsername') profile.userName = body.newUsername || profile.userName
    if (params.action === 'modifySignature') profile.signature = body.signature || ''
    if (params.action === 'modifyEmail') profile.email = body.email || profile.email
    return ok()
  }),
  http.put(`${base}/:userId/profile/avatar`, ({ request }) =>
    authorized(request) ? ok() : failure(3003, '请先登录'),
  ),
  http.post(`${base}/user/profile/avatar`, () =>
    HttpResponse.json({ filePath: '/unmapped/demo-avatar.png' }),
  ),
  http.get(`${base}/video/:videoId/comment`, ({ request, params }) => {
    if (!authorized(request)) return failure(3003, '请先登录')
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page_num') || '1')
    const values = [...list(String(params.videoId))]
    if (url.searchParams.get('sort_by') === 'cnt_upvote')
      values.sort((a, b) => Number(BigInt(b.upvoteCount) - BigInt(a.upvoteCount)))
    return HttpResponse.json({
      comments: values.slice((page - 1) * 10, page * 10),
      totalCount: values.length,
    })
  }),
  http.post(`${base}/video/:videoId/comment`, async ({ request, params }) => {
    if (!authorized(request)) return failure(3003, '请先登录')
    const body = (await request.json()) as { content: string; parentId: string }
    const commentId = (9007199254800000n + BigInt(Date.now())).toString()
    const roots = list(String(params.videoId))
    const comment: Comment = {
      commentId,
      publisherId: demoUserId,
      rootId: '0',
      content: body.content,
      createdAt: new Date().toISOString(),
      upvoteCount: '0',
      cntReplies: 0,
      ipAddress: '',
    }
    if (body.parentId === '0') roots.unshift(comment)
    else {
      const parent =
        roots.find((item) => item.commentId === body.parentId) ||
        [...replies.values()].flat().find((item) => item.commentId === body.parentId)
      const rootId = parent?.rootId === '0' ? parent.commentId : parent?.rootId
      const root = roots.find((item) => item.commentId === rootId)
      if (!root) return failure(404, '评论不存在')
      const key = `${params.videoId}:${root.commentId}`
      const values = replies.get(key) || []
      values.push({ ...comment, rootId: root.commentId })
      replies.set(key, values)
      root.cntReplies++
    }
    return HttpResponse.json({ commentId })
  }),
  http.get(`${base}/video/:videoId/comments/:commentId/replies`, ({ request, params }) => {
    if (!authorized(request)) return failure(3003, '请先登录')
    list(String(params.videoId))
    const page = Number(new URL(request.url).searchParams.get('page_num') || '1')
    return HttpResponse.json({
      replies: (replies.get(`${params.videoId}:${params.commentId}`) || []).slice(
        (page - 1) * 10,
        page * 10,
      ),
    })
  }),
  http.put(`${base}/video/:videoId/comment/:commentId/upvote`, ({ request, params }) => {
    if (!authorized(request)) return failure(3003, '请先登录')
    const key = String(params.commentId)
    const already = liked.has(key)
    if (already) liked.delete(key)
    else liked.add(key)
    const comment =
      list(String(params.videoId)).find((v) => v.commentId === key) ||
      [...replies.entries()]
        .filter(([id]) => id.startsWith(`${params.videoId}:`))
        .flatMap(([, values]) => values)
        .find((v) => v.commentId === key)
    if (comment) comment.upvoteCount = String(BigInt(comment.upvoteCount) + (already ? -1n : 1n))
    return ok(already ? '已取消点赞' : '评论点赞成功')
  }),
  http.get(`${base}/video/interaction/:videoId/share`, ({ request, params }) =>
    authorized(request)
      ? HttpResponse.json({ statusCode: 200, url: `http://127.0.0.1:8080/video/${params.videoId}` })
      : failure(3003, '请先登录'),
  ),
  http.put(`${base}/video/interaction/:videoId/:action`, ({ request, params }) => {
    if (!authorized(request)) return failure(3003, '请先登录')
    const key = `${params.videoId}:${params.action}`
    const already = liked.has(key)
    if (already) liked.delete(key)
    else liked.add(key)
    return ok(params.action === 'upvote' ? (already ? '已取消点赞' : '视频点赞成功') : '操作成功')
  }),
  http.post(`${base}/video/interaction/:videoId/barrage/send`, ({ request }) =>
    authorized(request) ? ok('弹幕已发送') : failure(3003, '请先登录'),
  ),
  http.post(`${base}/:userId/video/metaInfo`, async ({ request }) => {
    if (!authorized(request)) return failure(3003, '请先登录')
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
    return HttpResponse.json({ resp: { statusCode: 200 }, videoId })
  }),
  http.post(`${base}/:userId/video/:videoId/:kind`, async ({ request }) => {
    if (!authorized(request)) return failure(3003, '请先登录')
    await request.formData()
    await delay(200)
    return HttpResponse.json({ resp: { statusCode: 200, message: '已提交处理' } })
  }),
  http.all(`${base}/*`, () => failure(501, '当前演示不提供此接口')),
]
