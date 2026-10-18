# 03 React 组件与页面布局

状态：项目讲解已补充。目标是能修改一个组件而不破坏状态或布局。

## 体验与文件地图

先在发现页调整窗口宽度，再打开移动导航、主题菜单。观察导航不是缩小版桌面侧栏，而是在窄屏中用对话框呈现。

| 文件                                                       | 重点                           |
| ---------------------------------------------------------- | ------------------------------ |
| [video-card.tsx](../../src/features/videos/video-card.tsx) | props、JSX、列表中的复用单元   |
| [shell.tsx](../../src/components/layout/shell.tsx)         | 通用布局、主题、导航、头像回退 |
| [button.tsx](../../src/components/ui/button.tsx)           | 基础按钮样式与 asChild         |
| [dialog.tsx](../../src/components/ui/dialog.tsx)           | Radix 弹层、标题、焦点与关闭   |
| [index.css](../../src/styles/index.css)                    | 全局主题、网格、断点和媒体比例 |

## 组件不是 HTML 模板文件

React 组件是返回 UI 描述的函数。props 是父组件传入的输入；useState 存放跨渲染保留的局部状态。修改普通 let 变量不会要求 React 重绘。组件每次渲染会重新执行，但状态和 DOM 会按 React 规则保留。

JSX 花括号放表达式，className 对应 HTML class，事件用 onClick={函数}。onClick={action()} 会在渲染时执行，不是点击时执行。条件可以用三元表达式或 &&；不要用 count && JSX，否则 count=0 时可能把数字渲染出来。

列表 map 时 key 用 video.videoId。key 不是给用户看的字段，而是 React 判断同一项身份的依据。

## 最小状态设计

评论展开 expanded、弹窗 open 属于局部状态。视频详情来自 Query，不应复制进另一个全局 store。显示 nickname 直接读取 user 数据，不为每个派生字段再写 Effect 同步。

Effect 用于同步外部系统，例如播放器、计时器和对象 URL；普通显示计算可直接在渲染中完成。订阅、定时器和媒体实例必须返回清理函数。不要在渲染或 Effect 中自动执行点赞这类用户命令。

## 样式与结构

Tailwind 在基础组件中组合常用样式；复杂业务布局集中用语义 class，便于阅读。主题变量控制背景、边框与文本，组件不逐个硬编码浅色值。样式不是第二份业务状态。

缩略图/播放器有稳定 aspect-ratio；网格用 minmax(0,1fr) 让长标题可收缩；文本换行与截断按区域选择。不能只在自己屏幕上把 width 写死后认为响应式完成。

按钮负责命令，Link 负责导航。图标按钮要有 aria-label/tooltip；不能靠图标猜含义。input 必须有 label，弹窗有可访问标题。Radix 解决焦点管理，不替你决定业务文案和验证条件。

## 一次局部改动怎么做

修改 video-card 中观看数附近的显示顺序，保留标题链接、图片比例和 card key。先看桌面三列，再看 360 宽的一列。使用键盘 Tab 确认链接焦点仍可见，点击仍进入同一视频。

验证：pnpm typecheck、pnpm lint，以及浏览器发现页场景。更改字号不能使用 vw 缩放或让标题挤出容器；不要为了文案加大整个工具栏高度。

## 常见误区

- React 负责把状态映射成 UI，不负责判断后端事务成功。
- 直接修改 props 对象会破坏单向数据流，不能用来“更新父组件”。
- 注释应该解释约束，而不是把每个 JSX 标签翻译一次。
- 放进组件不意味着必须复用；抽象要减少真实复杂度。

## 自检

1. 为什么播放器放在 Effect 初始化，点赞放在点击回调？
2. 头像加载失败如何保持布局不跳动？
3. button 与 Link 互换，会丢失哪些浏览器/键盘行为？

[上一章](02-JavaScript与TypeScript基础.md) · [下一章](04-路由与接口访问.md) · [返回大纲](大纲.md)
