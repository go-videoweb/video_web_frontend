import { test, expect } from '@playwright/test'
import path from 'node:path'

test('发现页、分类分页与移动导航', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/?mode=demo')
  await expect(page.getByRole('heading', { name: '发现.', exact: true })).toBeVisible()
  await expect(page.locator('.video-card')).toHaveCount(12)
  await expect(page.locator('.video-thumbnail img').first()).toBeVisible()
  await expect
    .poll(() =>
      page
        .locator('.video-thumbnail img')
        .first()
        .evaluate((node) => (node as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(100)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  await page.screenshot({
    path: `.cache/screenshots/discover-${testInfo.project.name}.png`,
    fullPage: true,
  })
  await page.getByRole('button', { name: '下一页', exact: true }).click()
  await expect(page.locator('.video-card')).toHaveCount(2)
  await page.locator('.category-tabs').getByRole('link', { name: '自然', exact: true }).click()
  await expect(page).toHaveURL(/category=.*page=1|category=/)
  await expect(page.locator('.video-card')).toHaveCount(2)
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: '打开导航' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('dialog').getByRole('link', { name: '账户设置' }).click()
    await expect(page.getByRole('heading', { name: '账户设置.' })).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(0)
  }
  expect(errors).toEqual([])
})

test('真实 DASH 播放、可见画面与评论互动', async ({ page }, testInfo) => {
  await page.goto('/?mode=demo')
  await page.locator('.video-card').first().getByRole('link').click()
  await expect(page.getByRole('heading', { name: '光影之间：一段关于寻找的旅程' })).toBeVisible()
  const video = page.locator('video')
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.readyState), { timeout: 25_000 })
    .toBeGreaterThanOrEqual(2)
  await video.evaluate(async (node: HTMLVideoElement) => {
    node.muted = true
    await node.play()
  })
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime))
    .toBeGreaterThan(1)
  const pixels = await video.evaluate((node: HTMLVideoElement) => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 36
    const context = canvas.getContext('2d')!
    context.drawImage(node, 0, 0, 64, 36)
    const values = context.getImageData(0, 0, 64, 36).data
    let nonBlack = 0
    for (let i = 0; i < values.length; i += 4)
      if (values[i]! + values[i + 1]! + values[i + 2]! > 35) nonBlack++
    return nonBlack
  })
  expect(pixels).toBeGreaterThan(20)
  await video.evaluate((node: HTMLVideoElement) => {
    node.pause()
    node.currentTime = 8
  })
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime))
    .toBeGreaterThanOrEqual(7)
  await page.getByLabel('播放速度').selectOption('1.5')
  expect(await video.evaluate((node: HTMLVideoElement) => node.playbackRate)).toBe(1.5)
  await expect(page.getByText('画面和音乐搭配得很舒服，看完忍不住想拿起相机出门了。')).toBeVisible()
  await page.getByLabel('发表评论').fill('来自浏览器回归测试的一条友善评论')
  await page.getByRole('button', { name: '发布评论', exact: true }).click()
  await expect(page.getByText('来自浏览器回归测试的一条友善评论')).toBeVisible()
  const posted = page
    .locator('.comment-item')
    .filter({ has: page.getByText('来自浏览器回归测试的一条友善评论', { exact: true }) })
  await posted.getByRole('button', { name: '回复', exact: true }).click()
  await posted.getByLabel('回复评论').fill('这是一条可回读的测试回复')
  await posted.getByRole('button', { name: '发布回复', exact: true }).click()
  await expect(page.getByText('这是一条可回读的测试回复', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '点赞', exact: true }).click()
  await expect(page.getByText('视频点赞成功', { exact: true })).toBeVisible()
  await page.evaluate(() => {
    ;(document.activeElement as HTMLElement | null)?.blur()
    window.scrollTo(0, 0)
  })
  await page.screenshot({
    path: `.cache/screenshots/watch-${testInfo.project.name}.png`,
    fullPage: true,
  })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

test('账户更新与投稿恢复不重复创建元信息', async ({ page }, testInfo) => {
  await page.goto('/settings?mode=demo')
  await expect(page.getByRole('heading', { name: '个人资料', exact: true })).toBeVisible()
  await page.getByLabel('昵称', { exact: true }).fill('新的演示昵称')
  await page.getByRole('button', { name: '保存昵称' }).click()
  await expect(page.getByText('资料已更新', { exact: true })).toBeVisible()
  await page.goto('/upload')
  let creations = 0
  page.on('request', (request) => {
    if (request.url().endsWith('/video/metaInfo')) creations++
  })
  await page.getByLabel('视频标题').fill('浏览器验证投稿')
  await page.getByLabel('简介', { exact: true }).fill('分步上传及页面恢复测试')
  await page.getByRole('button', { name: '保存并继续' }).click()
  await expect(page.getByRole('heading', { name: '浏览器验证投稿' })).toBeVisible()
  const files = page.locator('.upload-drop input[type=file]')
  await expect(page.getByRole('button', { name: '提交视频', exact: true })).toBeDisabled()
  await files.nth(0).setInputFiles(path.resolve('public/assets/mountains.jpg'))
  await page.getByRole('button', { name: '上传封面', exact: true }).click()
  await expect(page.getByText('等待原片', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: '浏览器验证投稿' })).toBeVisible()
  await expect(page.getByRole('button', { name: '封面已上传' })).toBeDisabled()
  await files.nth(1).setInputFiles(path.resolve('public/assets/sintel-trailer.mp4'))
  await page.getByRole('button', { name: '提交视频', exact: true }).click()
  await expect(page.getByText('正在生成 DASH', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: '查看视频' })).toBeVisible()
  expect(creations).toBe(1)
  await page.screenshot({
    path: `.cache/screenshots/upload-${testInfo.project.name}.png`,
    fullPage: true,
  })
})

test('真实模式保持未登录状态，不以模拟数据掩盖不可用 API', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '每一种热爱，都值得被看见' })).toBeVisible()
  await expect(page.locator('.video-card')).toHaveCount(0)
  await expect(page.getByText('演示环境', { exact: true })).toHaveCount(0)
  await page.goto('/login')
  await page.getByRole('button', { name: '登录', exact: true }).click()
  await expect(page.getByText('请输入用户名', { exact: true })).toBeVisible()
})

test('收藏关系使用服务端记录 ID，关注可移动及取消', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', '跨页业务覆盖使用桌面项目')
  await page.goto('/?mode=demo')
  await page.locator('.video-card').first().getByRole('link').click()
  await page.getByRole('button', { name: '收藏', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('收藏夹').selectOption('9007199254770001')
  await dialog.getByRole('button', { name: '确认', exact: true }).click()
  await expect(page.getByRole('button', { name: '已收藏', exact: true })).toBeVisible()
  await page.getByRole('link', { name: '收藏夹', exact: true }).click()
  await expect(page.locator('.video-card')).toHaveCount(1)
  await page.locator('.video-card').first().getByRole('link').click()
  await page.getByRole('button', { name: '已收藏', exact: true }).click()
  const cancel = page.waitForRequest(
    (request) => request.method() === 'PUT' && request.url().endsWith('/favorite'),
  )
  await dialog.getByRole('button', { name: '确认', exact: true }).click()
  expect((await cancel).postDataJSON()).toMatchObject({
    favorite: -1,
    favoriteRecordId: expect.stringMatching(/^[1-9]\d+$/),
  })
  await expect(page.getByRole('button', { name: '收藏', exact: true })).toBeVisible()

  await page.getByRole('link', { name: '关注', exact: true }).click()
  await page.getByRole('button', { name: '新建关注组', exact: true }).click()
  await dialog.getByLabel('名称').fill('朋友')
  await dialog.getByRole('button', { name: '保存', exact: true }).click()
  await expect(page.getByLabel('关注组', { exact: true }).locator('option:checked')).toHaveText(
    '朋友',
  )
  await page.getByRole('link', { name: '发现', exact: true }).click()
  await page.locator('.video-card').nth(1).getByRole('link').click()
  await page.locator('.creator-name').click()
  await page.getByRole('button', { name: '关注', exact: true }).click()
  await dialog.getByRole('button', { name: '确认关注' }).click()
  await page.getByRole('button', { name: '已关注', exact: true }).click()
  await dialog.getByLabel('关注组').selectOption({ label: '朋友' })
  await dialog.getByRole('button', { name: '移动到此组' }).click()
  await page.getByRole('button', { name: '已关注', exact: true }).click()
  await expect(dialog.getByLabel('关注组').locator('option:checked')).toHaveText('朋友')
  await dialog.getByRole('button', { name: '取消关注' }).click()
  await expect(page.getByRole('button', { name: '关注', exact: true })).toBeVisible()
})

test('评论与零秒弹幕使用明确点赞状态，找回密码不发送凭据', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', '跨页业务覆盖使用桌面项目')
  await page.goto('/?mode=demo')
  await page.locator('.video-card').first().getByRole('link').click()
  await page.getByLabel('发送弹幕').fill('零秒弹幕')
  const send = page.waitForRequest((request) => request.url().endsWith('/barrage/send'))
  await page.getByRole('button', { name: '发送', exact: true }).click()
  expect((await send).postDataJSON()).toMatchObject({ positionSecond: 0 })
  const barrage = page.getByRole('region', { name: '当前区间弹幕' })
  await expect(barrage.locator('li').getByText('零秒弹幕')).toBeVisible()
  await barrage.getByRole('button', { name: '点赞弹幕', exact: true }).click()
  await expect(barrage.getByRole('button', { name: '取消点赞弹幕' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  const comment = page.locator('.comment-item').first()
  await comment.getByRole('button', { name: '点赞评论', exact: true }).click()
  await expect(comment.getByRole('button', { name: '取消点赞评论' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await comment.getByRole('button', { name: '取消点赞评论' }).click()
  await expect(comment.getByRole('button', { name: '点赞评论' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
  await page.goto('/forgot-password')
  await page.getByLabel('邮箱', { exact: true }).fill('DEMO@example.test')
  const captcha = page.waitForRequest((request) => request.url().includes('/captcha/codeCaptcha?'))
  await page.getByRole('button', { name: '获取验证码' }).click()
  expect(new URL((await captcha).url()).searchParams.get('purpose')).toBe('reset_password')
  await page.getByLabel('验证码', { exact: true }).fill('012345')
  await page.getByLabel('新密码', { exact: true }).fill('test-password')
  const reset = page.waitForRequest((request) => request.url().endsWith('/userinfo/forgetPassword'))
  await page.getByRole('button', { name: '重置密码' }).click()
  expect((await reset).headers().authorization).toBeUndefined()
  await expect(page.getByText('密码已更新，请重新登录。')).toBeVisible()
})

test('系统主题、媒体失败重试、路由清理与游客访问', async ({ page }, testInfo) => {
  await page.goto('/?mode=demo')
  await page.getByLabel('外观模式').selectOption('system')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('.video-card')).toHaveCount(12)
  await expect
    .poll(() =>
      page
        .locator('.video-thumbnail img')
        .first()
        .evaluate((node: HTMLImageElement) => node.naturalWidth),
    )
    .toBeGreaterThan(100)
  await page.screenshot({ path: `.cache/screenshots/dark-${testInfo.project.name}.png` })
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.evaluate(() => sessionStorage.setItem('vw.demo.failMedia', '1'))
  await page.locator('.video-card').first().getByRole('link').click()
  await expect(page.getByRole('button', { name: '重试播放', exact: true })).toBeVisible({
    timeout: 25_000,
  })
  await page.evaluate(() => sessionStorage.removeItem('vw.demo.failMedia'))
  await page.getByRole('button', { name: '重试播放', exact: true }).click()
  const video = page.locator('video')
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.readyState), { timeout: 25_000 })
    .toBeGreaterThanOrEqual(2)
  const oldVideo = await video.elementHandle()
  await video.evaluate(async (node: HTMLVideoElement) => {
    node.muted = true
    await node.play()
  })
  await page.locator('.watch-breadcrumb').getByRole('link', { name: '发现', exact: true }).click()
  await expect.poll(() => oldVideo!.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true)
  await page.getByRole('button', { name: '退出登录', exact: true }).click()
  await expect(page.getByText('已退出登录', { exact: true })).toBeVisible()
  await page.goto('/watch/9007199254742001')
  await expect(
    page.getByRole('heading', { name: '光影之间：一段关于寻找的旅程', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: '登录后参与互动', exact: true })).toBeVisible()
  await expect(page.getByLabel('发表评论')).toHaveCount(0)
})
