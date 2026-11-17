# VideoWeb Frontend

React 视频社区前端，与 Go 网关通过同域 `/api/v1` 通信。前端是独立工程，不修改后端的 module、数据库或部署。

## 启动

推荐 Node.js 24 LTS、pnpm 11.25.0。本机 Node.js 22.19.0 已通过下述检查，依赖版本由锁文件固定。

```powershell
cd D:\Go\WorkSpace\src\Go_Project\video_web_refactored_version\video_web_frontend
pnpm install --frozen-lockfile
pnpm dev
```

打开 [真实接口模式](http://127.0.0.1:5173/)；不登录时首页显示登录入口，因为当前后端列表接口要求身份。已知视频链接可匿名访问 `/watch/视频ID`。

无需启动后端即可打开 [本地演示](http://127.0.0.1:5173/?mode=demo)。显式启动 MSW，第一次进入预置演示身份。顶栏“演示环境”可以退出；演示模式在当前标签页保留，刷新后仍生效。演示登录接受任意非空用户名和密码，不会校验真实账号，不要输入真实凭据。刷新会清空大部分演示写入；投稿阶段在演示标签页保留，恢复记录单独保存在本机，需完整重演时在投稿页点击“开始新投稿”。

## 连接 Go 网关

创建本机 `.env.local`（已忽略），以 [.env.example](.env.example) 为格式参考：

```dotenv
API_PROXY_TARGET=http://127.0.0.1:8001
VITE_API_BASE=/api/v1
VITE_VIDEO_CATEGORIES=科技,生活,自然,人文,音乐,运动
```

修改后重启 Vite。分类必须与实际数据库值匹配，不支持省略分类来查“全部”。`VITE_*` 会进入浏览器，不能放密码或服务密钥。真实模式不会因 API 失败回退演示数据。联调时请退出演示环境，并确认 Network 请求指向预期网关。

## 已实现

- 分类分页、封面、详情、DASH 播放、倍速和有界原视频下载。
- 登录、注册、邮箱验证码、双 Token 会话和明确的刷新协议。
- 评论、展开回复、发表回复、点赞、分享、投贝壳、发送弹幕。
- 投稿元信息、视频和封面分步上传；同账号刷新恢复已创建视频 ID。
- 用户资料、头像上传预览、昵称/签名、邮箱/密码设置。
- 浅色/深色/跟随系统、移动导航、加载/空/失败状态、可访问弹窗。

当前接入后端 ba2604fd 的 B01–B09：收藏夹与关注组、个人视频状态、游标评论与区间弹幕、头像与注册、投稿轮询、邮箱找回、分享和显式点赞。共有 49 项 HTTP 操作，真实联调边界见 [接口覆盖](docs/接口覆盖与联调.md)。

## 工程

React 19、TypeScript strict、Vite 8、TanStack Router/Query、Tailwind 4、Radix/shadcn 风格自有组件、React Hook Form/Zod、dash.js。保留 TS 5.9.3，原因是当前 openapi-typescript 与工具插件的 TypeScript 7 兼容问题；不以破坏工具链为代价升级大版本。

```text
src/routes/           薄路由，校验参数并按路由分包
src/features/         按 auth/videos/player/comments/upload/users/favorites 分域
src/components/       通用状态、UI 与布局
src/lib/              请求、运行时模型、媒体 URL、配置、Query
contracts/            来源快照、修正后的 OpenAPI、49 项操作清单
scripts/              契约生成与漂移检查
e2e/                  桌面、手机、平板浏览器场景
docs/                 接手、限制、学习路线和验证记录
deploy/               Nginx、容器启动与 k3s 示例
```

## 检查

```powershell
pnpm api:check
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Windows 会优先使用已安装的 Chrome/Edge，其他平台使用 Playwright Chromium。可通过 `PLAYWRIGHT_CHANNEL` 指定浏览器。测试启动/复用 5173 上的本工程 Vite，不能指向生产系统。浏览器场景用 MSW API 和真实本地 DASH 分片，不访问业务数据库。

`pnpm preview` 仅预览构建结果，不是生产反向代理；真实 API 联调用 Vite dev 或部署 Nginx。当前构建保留 dash.js 大块警告，该库只在观看页播放时加载，不进入首页首批脚本。

## 文档入口

- [架构与接手](docs/架构与接手.md)
- [接口覆盖与联调](docs/接口覆盖与联调.md)
- [验证记录与已知限制](docs/验证记录.md)
- [学习路线：大纲与 12 章](docs/学习路线/大纲.md)
- [部署说明](deploy/README.md)
- [媒体来源与许可](docs/媒体来源与许可.md)

尚未连接真实 Go 服务、构建容器或部署集群。不要将演示成功当作 Redis、DTM、邮件和 ffmpeg 链路已验证。
