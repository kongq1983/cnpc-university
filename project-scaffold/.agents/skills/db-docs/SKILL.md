---
name: db-docs
description: 连接运行中的 MySQL、PostgreSQL、Oracle 或 SQLite 数据库，只读取表结构元数据，生成确定性的 JSON 数据字典和离线 HTML 文档。当用户说“生成数据库文档”“生成数据字典”“整理数据库表和字段说明”，或要求从数据库生成 schema/HTML 文档时使用。不要用于 SQL 优化、数据库迁移、备份恢复、读取业务数据、SQL Server，或从源码生成 API 文档。
---

# Database Docs

## 工作流程

1. 检查 `~/.config/db-docs/config.json`。配置不存在、配置无效或用户要求修改连接时，运行 `python scripts/configure.py`，通过本地配置页填写连接信息、测试连接并选择 catalog/schema。
2. 运行 `python scripts/generate.py`。需要显式指定配置时使用 `--config <路径>`；需要改变输出根目录时使用 `--output-dir <目录>`。只使用配置中选择的 namespace。
3. 脚本缺少当前数据库驱动时自动运行对应的 `pip` 安装：MySQL 使用 `mysql-connector-python`，PostgreSQL 使用 `psycopg[binary]`，Oracle 使用 `oracledb`；SQLite 使用 Python 标准库。安装失败时停止并保留原有输出。
4. 只读取元数据：表、表注释、字段、字段注释、主键、外键、唯一约束和索引。枚举表名后必须先过滤分表，再查询表详情：当同一 namespace 中存在基础表，且至少存在两个同基础名、合法年份/月分表或从 `0`/`1` 开始的连续数字分表时，只保留基础表。没有基础表、序列不连续或只有一个候选分表时不得过滤。禁止执行读取业务行的查询。SQL Server 当前不支持。
5. 检查生成结果必须是离线多文件包：
   - `docs/database/index.html`：目录和搜索页，只内嵌轻量索引。
   - `docs/database/schema.json`：namespace 和表引用目录，符合 `assets/schema.schema.json`。
   - `docs/database/search-index.json`：表名、字段名和注释搜索索引，符合 `assets/search-index.schema.json`。
   - `docs/database/tables/<catalog>/<schema>/<table-name>.json`：单表详情，符合 `assets/table.schema.json`。
   - `docs/database/tables/<catalog>/<schema>/<table-name>.html`：单表备用详情页。
   HTML 只能由对应 JSON 生成，不能手工编辑；不要再生成旧的完整单文件 HTML。
6. 生成前在临时目录构建完整包，校验所有引用和文件后整体替换 `docs/database`。失败时不得删除或覆盖已有文档，也不得遗留旧表详情文件。
7. 运行 `python scripts/validate.py --dir docs/database`。exit code 非零时读取 stderr，修复后重跑。
8. 查看文档必须运行 `python scripts/serve.py --dir docs/database`，然后打开脚本输出的 localhost 地址。不要直接双击 `index.html`，因为单页查看器需要通过 HTTP 按需读取表 JSON。

## 配置约定

- 配置路径默认为 `~/.config/db-docs/config.json`，可通过 `--config` 覆盖。
- 配置页只提供常见连接参数；SQLite 使用文件路径，Oracle 使用 service name。
- 密码按用户确认以明文保存在配置文件中；脚本、日志和错误信息不得打印密码。
- 配置页测试连接成功后才加载 namespace，并要求至少选择一个 namespace 后保存。
- Unix 配置文件权限设置为仅当前用户可读写；Windows 使用当前用户目录，不能保证由 Python 跨版本统一设置 ACL。

## 最小示例

- 首次配置：`python scripts/configure.py`
- 生成默认文档：`python scripts/generate.py`
- 使用指定配置：`python scripts/generate.py --config C:\\work\\db-docs.json --output-dir C:\\work`

## 边界情况 / 坑

- 配置页能打开但测试失败 → 检查连接参数和驱动安装错误；不要跳过测试直接保存。
- namespace 为空 → 阻止生成并要求重新打开配置页选择 catalog/schema。
- 数据库只返回部分元数据 → 保留能读取的对象，并在错误中指出所需元数据权限；不要猜测缺失字段。
- 已有文档而本次连接或渲染失败 → 保留旧文件，修复后重新运行。
- 重复生成产生不同 JSON → 检查排序、时间字段和 JSON 序列化；禁止加入当前时间等非确定性字段。
- 相似数字后缀表被误删 → 只允许 1900–2099 年及合法月份，或从 `0`/`1` 开始的连续数字后缀，并同时要求基础表存在且至少有两个候选分表；不要增加隐式猜测规则。

## References

- `assets/config-page.html` — 运行 `scripts/configure.py` 时作为本地配置页面模板读取。
- `assets/config.schema.json` — 修改配置读写逻辑或排查配置校验问题时读取。
- `assets/schema.schema.json` — 修改元数据字段或 HTML 渲染逻辑时读取。
- `assets/search-index.schema.json` — 修改目录搜索索引时读取。
- `assets/table.schema.json` — 修改单表详情格式时读取。
- `references/backend-notes.md` — 调试某个数据库适配器或确认元数据权限时读取。
- `scripts/configure.py` — 配置缺失或用户要求修改连接、测试连接和 namespace 时运行。
- `scripts/generate.py` — 已有有效配置、需要生成 JSON 和 HTML 时运行。
- `scripts/validate.py` — 每次生成后运行。
- `scripts/serve.py` — 需要查看文档或验证单页按需加载时运行。
