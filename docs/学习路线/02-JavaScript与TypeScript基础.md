# 02 结合项目恢复 JavaScript 与 TypeScript

状态：项目讲解已补充。目标是读懂已有逻辑，不背完整语法表。

## 先抓住这些区别

JavaScript 真正在浏览器执行；TypeScript 类型大多在构建时被移除。类型正确不保证服务器返回值正确，因此 API 边界还需要 Zod。TS 的 strict 用来尽早发现不确定值，不是替后端鉴权。

与 Go 对照：对象类似有字段的结构，但运行时可多字段；interface/type 主要描述编译期形状；Promise 不是 goroutine，await 也不是同步阻塞整个浏览器线程。

## 文件地图

| 文件                                              | 看什么                           |
| ------------------------------------------------- | -------------------------------- |
| [utils.ts](../../src/lib/utils.ts)                | 导出函数、可选值、BigInt、返回值 |
| [models.ts](../../src/lib/api/models.ts)          | Zod schema、默认值、infer        |
| [videos/api.ts](../../src/features/videos/api.ts) | async、await、参数与 JSON 边界   |
| [client.ts](../../src/lib/api/client.ts)          | unknown 收窄、泛型、异常         |
| [utils.test.ts](../../src/lib/utils.test.ts)      | 用具体输入检查理解               |

## 关键语法放回代码里

```ts
const { body, auth = true, ...init } = options
```

解构取出 body/auth，auth 未提供才用 true，其余字段成为 init。rest 不是深拷贝，也不会删除原对象字段。函数参数与变量标识仍有各自作用域。

```ts
const query = new URLSearchParams({
  class: category,
  page_num: String(page),
  page_size: '12',
})
```

对象字段名是接口契约，变量名是本地选择；page_num 不能因为前端喜欢 camelCase 就随意重命名。URLSearchParams 负责编码，中文不用自己拼百分号。

```ts
type VideoSummary = z.infer<typeof videoSummarySchema>
```

typeof 在这里取 schema 的类型，infer 得到解析后的数据类型。与运行时 typeof value === 'string' 不是同一用途。

## Promise 与失败

async 函数总返回 Promise。await 等到成功值，失败会抛异常；try/catch 只能捕获其等待链上的异常。不 await 的 Promise 需要明确处理，void 只是告诉类型/读者“不使用返回值”，不会神奇吞掉异常。

request<T> 的 T 只描述预期，不验证 JSON。getVideo 用 schema.parse 验证 unknown，解析失败同样进入 Query 的错误状态。不要直接把接口 JSON 强制 as VideoDetail 后认为它安全。

## 为什么 ID 是字符串

9007199254740993 超过 JS Number 安全整数范围。Number(id) 后精度可能已经丢失，String 再转回也救不回来。正 ID 用正十进制字符串；0 只在明确约定的游客或根评论位置使用。计数展示使用 BigInt/formatCount，不能与普通 number 直接相加。

可选链 a?.b 用于 a 不存在时返回 undefined；?? 只处理 null/undefined；|| 也会处理 0、空串、false。计数 0 是否有意义，要按业务选择，不机械替换。

## 不可变更新

```ts
current = { ...current, accessToken }
```

创建新对象替换快照，订阅者能识别变化。数组 map/filter 产生新数组，sort 会原地修改；排序服务端数据前应先复制，避免污染 Query 缓存。React key 用稳定资源 ID，不用会变的位置。

## 可选练习

给 utils.test.ts 新增一个正 ID 边界测试：'0' 应被拒绝，大 ID 字符串不应变化。运行 `pnpm exec vitest run src/lib/utils.test.ts`。先写预期再看实现，不必修改所有工具函数。

## 自检

- unknown 与 any 的区别是什么？
- 类型声明能防止 HTTP 返回 HTML 吗？
- 为什么 Boolean('false') 仍为 true？
- Promise 失败与普通业务码失败为什么都要处理？

[上一章](01-项目全貌与运行方式.md) · [下一章](03-React组件与页面布局.md) · [返回大纲](大纲.md)
