import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import YAML from 'yaml'
import openapiTS, { astToString } from 'openapi-typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
// Git 检出可能改变 CRLF/LF，来源哈希使用统一换行，避免平台差异被误判为契约变化。
const source = (
  await fs.readFile(path.join(root, 'contracts/backend.openapi.yaml'), 'utf8')
).replace(/\r\n/g, '\n')
const schema = YAML.parse(source)
const operations = []
for (const [url, methods] of Object.entries(schema.paths)) {
  for (const [method, operation] of Object.entries(methods)) {
    if (!operation.operationId) continue
    const id = operation.operationId
    // 网关 BindQuery 接受 proto 字段名，保留 URL 路径参数与 JSON 字段名。
    for (const parameter of operation.parameters ?? []) {
      if (parameter.in === 'query')
        parameter.name = parameter.name.replace(/[A-Z]/g, (char) => '_' + char.toLowerCase())
    }
    operations.push({ id, method: method.toUpperCase(), path: url })
    if (/VideoInfo_(GetMpd|GetSegments|GetVideoCover|DownloadVideo)$/.test(id)) {
      const mime = id.endsWith('GetMpd') ? 'application/dash+xml' : 'application/octet-stream'
      operation.responses['200'].content = {
        [mime]: { schema: { type: 'string', format: 'binary' } },
      }
    }
    if (/(UploadAvatar|UpdateAvatar|UploadVideoFile|UploadVideoCover)$/.test(id)) {
      const field = id.endsWith('VideoFile')
        ? 'file'
        : id.endsWith('VideoCover')
          ? 'cover'
          : 'avatar'
      operation.requestBody = {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: [field],
              properties: { [field]: { type: 'string', format: 'binary' } },
            },
          },
        },
      }
    }
  }
}
operations.sort((a, b) => a.id.localeCompare(b.id))
if (operations.length !== 49)
  throw new Error(`接口数量变化为 ${operations.length}，请重新审查覆盖清单`)
const effective = JSON.stringify(schema, null, 2) + '\n'
const generated = astToString(await openapiTS(schema))
const manifest =
  JSON.stringify(
    {
      backendCommit: 'ba2604fd',
      sourceSha256: createHash('sha256').update(source).digest('hex'),
      operations,
    },
    null,
    2,
  ) + '\n'
for (const [file, content] of [
  ['contracts/effective.openapi.json', effective],
  ['contracts/operations.json', manifest],
  ['src/lib/api/generated.d.ts', generated],
]) {
  const target = path.join(root, file)
  if (process.argv.includes('--check')) {
    if ((await fs.readFile(target, 'utf8')) !== content) throw new Error(`契约产物过期：${file}`)
  } else await fs.writeFile(target, content)
}
console.log(
  `已${process.argv.includes('--check') ? '核对' : '生成'} ${operations.length} 个 HTTP 操作及前端类型`,
)
