# 接口契约

`backend.openapi.yaml` 是后端 `ba2604fd` 的网关 OpenAPI 快照，仅包含协议定义。`node scripts/contracts.mjs` 以结构化方式修正已确认的文件下载和 multipart 文档偏差，规范查询参数为网关支持的 proto snake_case，生成 `effective.openapi.json`、TypeScript 类型和 49 项操作清单。

不修改 Go 生成文件。升级后端时显式替换快照、更新来源并执行契约检查和真实联调。生成类型不替代运行时校验。

来源 SHA-256 在计算前将 CRLF 换行统一为 LF，因此 Windows 工作树与 Git/Linux 检出的同一份文本产生相同哈希。其余内容不做裁剪、排序或语义归并；产物仍按完整文本严格比对，真实漂移不会被忽略。既有 `.gitattributes` 继续约定文本文件使用 LF。

`pnpm test` 先用 Node 原生测试运行器执行 `scripts/contracts.test.mjs`，在隔离目录验证 LF/CRLF 的全部产物一致、切换换行后检查通过，以及源内容/产物变化仍会报错，再运行 Vitest。测试不修改工作树中的契约文件。
