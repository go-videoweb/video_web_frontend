# 接口契约

`backend.openapi.yaml` 是后端 `b87a6830` 的网关 OpenAPI 快照，仅包含协议定义。`node scripts/contracts.mjs` 以结构化方式修正已确认的文件下载和 multipart 文档偏差，生成 `effective.openapi.json`、TypeScript 类型和操作清单。

不修改 Go 生成文件。升级后端时显式替换快照、更新来源并执行契约检查和真实联调。生成类型不替代运行时校验。
