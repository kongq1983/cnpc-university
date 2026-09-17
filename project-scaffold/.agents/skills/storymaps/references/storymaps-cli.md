# Storymaps CLI 参考

## 命令速查

| 命令 | 用途 | 使用时机 |
| --- | --- | --- |
| `storymaps open --file <file>` | 在浏览器打开本地地图 | 需要目视检查布局或交互时 |
| `storymaps pull --file <file>` | 按源文件中的 `id`/`site` 拉取远程版本 | 需要以远程版本为编辑基线，且本地修改已保存或获授权时 |
| `storymaps push --file <file>` | 将本地修改推送到远程 | 校验通过、差异已审阅并获得同步确认后 |
| `storymaps diff <file>` | 汇总本地与远程差异 | 每次准备同步前，且源文件已有 `id` 时 |
| `storymaps diff --full <file>` | 显示逐行差异 | 汇总差异不足以确认变更时 |
| `storymaps status <file>` | 查看进度概览和同步状态 | 编辑前后、推送后 |
| `storymaps log --file <file>` | 查看活动日志 | 需要追查远程操作历史时 |
| `storymaps validate <file>` | 检查 YAML 结构 | 任何远程操作前，以及转换后 |
| `storymaps convert <file> --to json` | YAML 转 JSON | 用户明确要求 JSON 或下游只接受 JSON 时 |
| `storymaps convert <file> --to yaml --out <file>` | JSON 转 YAML | 用户明确要求恢复 YAML 时，之后重新校验 |

## 同步门槛

已有 `id` 的地图按以下顺序执行：编辑源文件 → `storymaps validate <file>` → `storymaps status <file>` → `storymaps diff <file>` → 必要时 `storymaps diff --full <file>` → 已获得同步授权 → `storymaps push --file <file>` → `storymaps status <file>`。没有 `id` 且请求未提供明确远端目标的新地图没有远端基线，跳过 `diff`；编辑源文件 → `storymaps validate <file>` → `storymaps status <file>` → 已获得同步授权 → `storymaps push --file <file>` → `storymaps status <file>`。当前请求已经明确要求同步时，不要重复询问；已有远端基线的差异出现意外远端改动或删除时仍应停止并报告。

`pull` 不是校验步骤，可能改写本地源文件。不要把 `pull` 和未保存的编辑混用；如果远程与本地都发生了修改，先保存或提交本地版本并让用户决定合并方式。

## 数据约定

- 顶层通常包含 `name`、`id`、`site`、`steps`、`users`、`activities`、`legend` 和 `slices`；保留远程地图要求的其他顶层字段。
- `steps` 是有序字符串列表。`users[].step`、`activities[].step` 以及 `slices[].stories` 的键必须匹配其中的字符串。`users[].color` 必须为 `#fca5a5`，`activities[].color` 必须为 `#93c5fd`。
- 每张故事卡片必须有 `name` 和 `body`。可选字段为 `color`、`status`、`points`、`tags`、`url`。
- `status` 只能取 `done`、`in-progress`、`planned`、`blocked`；`points` 使用数字；`tags` 使用字符串列表；`color` 使用颜色值字符串；`url` 使用完整 URL。

## 失败处理

- `validate` 非零 → 依据 stderr 的文件和行号修复 YAML 语法、缩进、键名或类型，重跑直到退出码为 0。
- 已有远端基线的 `diff` 无法定位远程地图或显示元数据不匹配 → 核对 `id`、`site` 和认证上下文；不要直接 `push`。
- `push` 非零或提示认证/网络错误 → 保留 stderr，报告未同步成功；已有 `id` 的地图修复外部条件后从 `validate <file>` 和 `diff <file>` 重新开始，无 `id` 的新地图从 `validate <file>` 和 `status <file>` 重新开始。
