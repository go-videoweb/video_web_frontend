# Frontend AGENTS

这是独立的 VideoWeb React SPA。先读 README.md、docs/架构与接手.md、docs/接口覆盖与联调.md。

- 真实模式不得在失败时静默回退模拟数据。MSW 仅在显式演示/测试启用。
- 不修改兄弟后端/公共库仓库，不自动部署、迁移数据库或发布。
- 按 feature 维护 API/页面；routes 保持薄层，避免页面导出阻止路由分包。
- 所有资源 ID 保持字符串；错误码、双 token 与最多一次刷新协议集中在 client。
- 详情/分享有业务副作用，禁用自动预取和重试；写命令未知结果不能自动重发。
- 不手改 routeTree.gen.ts、generated.d.ts、effective.openapi.json、operations.json。修改源契约/脚本并生成；生成文件的历史英文注释保留。
- 手写说明性代码注释用中文，解释边界和副作用；保持公开函数/类型注释。
- 新功能同步 docs/接口覆盖与联调.md 与对应学习章节。后端缺口不能用假状态掩盖。
- 验证使用 api:check、typecheck、lint、format:check、test、build；交互改动补相关 Playwright 场景。
- E2E 仅连接本工程演示环境，不针对生产账户。镜像/集群联调单独授权并报告。
