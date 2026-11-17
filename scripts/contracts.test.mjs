import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cache = path.join(root, '.cache')
const sourcePath = 'contracts/backend.openapi.yaml'
const outputs = [
  'contracts/effective.openapi.json',
  'contracts/operations.json',
  'src/lib/api/generated.d.ts',
]
const lfSource = (await fs.readFile(path.join(root, sourcePath), 'utf8')).replace(/\r\n/g, '\n')

/** 在隔离目录运行真实生成脚本，依赖仍从前端仓库解析，不改工作树契约。 */
async function fixture(context, source) {
  await fs.mkdir(cache, { recursive: true })
  const directory = await fs.mkdtemp(path.join(cache, 'contracts-'))
  context.after(async () => {
    if (path.dirname(directory) !== cache || !path.basename(directory).startsWith('contracts-'))
      throw new Error('拒绝清理隔离目录以外的路径')
    await fs.rm(directory, { recursive: true, force: true })
  })
  for (const name of ['scripts', 'contracts', 'src/lib/api'])
    await fs.mkdir(path.join(directory, name), { recursive: true })
  await fs.copyFile(
    path.join(root, 'scripts/contracts.mjs'),
    path.join(directory, 'scripts/contracts.mjs'),
  )
  await fs.writeFile(path.join(directory, sourcePath), source)
  return directory
}

/** 保留 CLI 退出码与输出，确保测试覆盖实际生成与检查流程。 */
function run(directory, check = false) {
  const result = spawnSync(
    process.execPath,
    [path.join(directory, 'scripts/contracts.mjs'), ...(check ? ['--check'] : [])],
    { cwd: directory, encoding: 'utf8' },
  )
  if (result.error) throw result.error
  return result
}

test('LF 与 CRLF 契约生成完全一致的产物和规范化哈希', async (context) => {
  const lf = await fixture(context, lfSource)
  const crlf = await fixture(context, lfSource.replace(/\n/g, '\r\n'))
  for (const directory of [lf, crlf]) {
    const result = run(directory)
    assert.equal(result.status, 0, result.stderr)
  }
  for (const file of outputs)
    assert.ok(
      (await fs.readFile(path.join(lf, file), 'utf8')) ===
        (await fs.readFile(path.join(crlf, file), 'utf8')),
      `${file} 的内容不一致`,
    )
  const manifest = JSON.parse(
    await fs.readFile(path.join(crlf, 'contracts/operations.json'), 'utf8'),
  )
  assert.equal(manifest.sourceSha256, createHash('sha256').update(lfSource).digest('hex'))
})

test('CRLF 环境生成后切换为 LF 检出仍通过严格检查', async (context) => {
  const directory = await fixture(context, lfSource.replace(/\n/g, '\r\n'))
  const generated = run(directory)
  assert.equal(generated.status, 0, generated.stderr)
  await fs.writeFile(path.join(directory, sourcePath), lfSource)
  const checked = run(directory, true)
  assert.equal(checked.status, 0, checked.stderr)
})

test('真实源内容变化仍被契约检查拒绝', async (context) => {
  const directory = await fixture(context, lfSource)
  const generated = run(directory)
  assert.equal(generated.status, 0, generated.stderr)
  await fs.writeFile(path.join(directory, sourcePath), `${lfSource}\n# 契约来源发生变化\n`)
  const checked = run(directory, true)
  assert.notEqual(checked.status, 0)
  assert.match(checked.stderr, /契约产物过期：contracts\/operations\.json/)
})

test('产物内容漂移仍被严格检查拒绝', async (context) => {
  const directory = await fixture(context, lfSource)
  const generated = run(directory)
  assert.equal(generated.status, 0, generated.stderr)
  await fs.appendFile(path.join(directory, 'contracts/operations.json'), ' ')
  const checked = run(directory, true)
  assert.notEqual(checked.status, 0)
  assert.match(checked.stderr, /契约产物过期：contracts\/operations\.json/)
})
