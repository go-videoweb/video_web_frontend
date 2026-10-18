# 部署说明

以下是交付材料与人工准备步骤，不代表已经执行。没有连接集群、推送镜像或创建基础设施。

## 本地开发

`pnpm dev` 使用 Vite 的 `/api` 代理，目标取本机 `API_PROXY_TARGET`。不要将 Vite 开发服务器当作线上服务。前端不直接访问 Consul、Redis、MySQL 或 DTM。

## 镜像

从前端仓库根构建：

```sh
docker build -t videoweb/frontend:0.1.0 .
docker run --rm -p 8080:8080 -e API_UPSTREAM=host.docker.internal:8001 videoweb/frontend:0.1.0
```

Node 24 仅用于构建。运行时 Nginx 使用非 root 101，端口 8080。需要运行时环境变量 `API_UPSTREAM`，值为可信的 `主机:端口`，不要包含协议、路径或用户输入。启动脚本只替换此变量，不破坏 Nginx 的 `$uri` 等变量。

浏览器使用相对 `/api/v1`。只有改变浏览器公开配置时才需要重建；单纯改变网关地址通过 API_UPSTREAM 即可。示例镜像标签是本地名字，需替换为可拉取仓库和实际发布版本。基镜像使用维护中的标签，正式发布可锁定审计后的 digest。

## Nginx 约定

- SPA 路由回退 index.html；API 错误不回退。
- HTML 与 worker 不长期缓存；带 hash 的 JS/CSS 缓存一年。
- MPD/m4s 从 Go 网关转发，保留路径和 Range 头。代理不会给 Go 网关补上它本身尚未实现的 Range 行为。
- 上传 body 上限 260 MB，代理读写超时 180 秒；实际视频处理时间更长时应先解决任务状态契约，不盲目增加超时。
- CSP 默认同源，媒体允许 blob，头像允许 https。外部 API 或跨域媒体需要同时核对 CSP、CORS、凭据与 MPD 相对地址。
- /healthz 只证明静态服务响应，不代表业务网关和基础设施可用。

## k3s

`k8s/kustomization.yaml` 仅包含前端 Deployment 和 Service，命名空间 videoweb。没有创建命名空间或部署数据库。

应用前必须确认：

1. 网关实际 Service 名称与端口，修改 frontend.yaml 中 API_UPSTREAM。当前值为待确认的 `vw-gateway.videoweb.svc.cluster.local:8001`。
2. 推送并替换镜像地址，按现有集群策略配置 imagePullSecrets。
3. 已有 videoweb 命名空间、网络可达与 NetworkPolicy。
4. 复制 ingress.example.yaml 并替换域名、Ingress class 与 TLS。示例没有被 Kustomize 自动包含。
5. 按实际 ingress 设置上传限制与代理超时；不要暴露裸 HTTP 认证流量。

```sh
kubectl kustomize deploy/k8s
kubectl diff -k deploy/k8s
kubectl apply -k deploy/k8s
```

上述命令供维护者准备完成后手动执行，本次没有执行。diff 也会连接真实集群，不属于离线检查。容器静态检查通过不等于 Nginx -t、镜像可运行或集群业务验收。

## 上线验收

先检查 /healthz 与深链接 /watch/真实ID 刷新，再检查真实登录、分类、MPD/相对分片、封面、评论和投稿结果。使用测试资源确认 API 404 不是 HTML、失败体不会被下载为视频、退出后个人缓存清除。

Safari/iOS、移动端触控媒体控制、原文件大下载、真实上传处理完成都需要额外实测。不要把桌面 Chromium 的移动视口模拟当作真机播放兼容性。
