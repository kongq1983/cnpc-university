# 餐饮服务管理页面设计规范｜AI原型生成版 V1.0

> 规则性质：面向 AI 原型与页面生成的执行约束
> 证据来源：现状基线 V0.1 与第二份 Figma Make MJKnJkhfTGx7OodW5Fs5N6
> 适用对象：WorkBuddy、Figma Make、产品原型和前端页面生成
> 校准日期：2026-09-17

# 1 使用说明

本规范用于让 AI 在接到新的餐饮服务管理业务页面需求时，能够选择与现有产品一致的页面模板、壳层、布局、组件、尺寸、颜色、状态和交互样式。

规则优先级如下：

1. 具体业务需求；
2. 本规范中的页面模板规则；
3. 组件规则；
4. 基础 Design Token；
5. AI 自由发挥。

业务需求与本规范不冲突时，必须遵循本规范。业务需求只描述功能、没有描述视觉时，AI 不得以“补充设计”为由改变现有视觉语言。

## 1.1 规则等级

| 等级 | 名称         | AI 执行方式                                        |
| ---- | ------------ | -------------------------------------------------- |
| S1   | 稳定全局规则 | 必须执行，除非业务需求明确覆盖                     |
| S2   | 稳定场景规则 | 先识别页面或组件场景，再执行对应规则               |
| S3   | 推荐规则     | 默认采用；有明确参考页面时可跟随参考               |
| S4   | 暂不强制     | 采用推荐值和允许范围，不得超出边界                 |
| S5   | 暂不约束     | 不得依据本规范自行推导，应沿用参考页或等待需求说明 |

# 2 AI 生成总原则

1. 先判断页面模板，再决定布局和组件。不要从空白画布自由组合。
2. 保持浅灰蓝背景、白色 Surface、蓝色主操作色和中高信息密度。
3. 不自行创造新的视觉风格、导航结构、状态颜色或圆角档位。
4. 不自行增加装饰性渐变。工作台 Hero 是已存在的有限场景，不代表全平台使用渐变。
5. 不使用高饱和装饰色。新增颜色只能来自业务明确要求或现有语义色。
6. 不改变顶部 Header + 业务二级导航的壳层体系。
7. 不因为内容少而放大页面标题、KPI 或 Card。
8. 不因为页面空而增加插画、背景纹理、装饰图形或无业务作用的模块。
9. 不把标准管理页面改造成营销网站式布局。
10. 不创造需求中不存在的指标、图表、告警、业务数据或“示例真实数据”。

# 3 基础 Design Tokens

## 3.1 Color

| Token                    |   Value | Scope                        | Rule Level |
| ------------------------ | ------: | ---------------------------- | ---------- |
| color.background.page    | #eef2f8 | 全局页面背景                 | S1         |
| color.surface            | #ffffff | Card、Header、导航、表单容器 | S1         |
| color.primary            | #2563eb | 主操作、信息、当前选择       | S1         |
| color.primary.hover      | #1d4ed8 | Primary Hover                | S3         |
| color.primary.subtle     | #eff6ff | 选中背景、轻提示背景         | S1         |
| color.primary.tintStrong | #dbeafe | 比 subtle 更强的蓝色浅底     | S3         |
| color.success            | #10b981 | 成功、正常、在线、营业       | S1         |
| color.warning            | #f59e0b | 等待、暂停、警告、待审核     | S1         |
| color.danger             | #ef4444 | 异常、故障、高风险、删除     | S1         |
| color.text.primary       | #1e293b | 主文字                       | S1         |
| color.text.secondary     | #64748b | 次文字、表头、说明           | S1         |
| color.text.muted         | #94a3b8 | 弱提示和元数据               | S1         |
| color.border.control     | #e2e8f0 | 控件、导航、通用分隔线       | S2         |
| color.border.container   | #e8eef6 | Card 和业务容器              | S2         |
| color.border.row         | #f1f5f9 | 管理表行分隔线               | S1         |
| color.table.header       | #f8fafc | 表头和表格 Hover             | S1         |

AI 必须优先使用语义 Token。不得将成功绿、警告黄和危险红用于无状态含义的装饰。

## 3.2 Typography

全局字体：**Noto Sans SC, Inter, sans-serif**。中文优先使用 Noto Sans SC；英文和数字由 Inter 作为备用。

| Token              | Value               | Scope                | Rule Level |
| ------------------ | ------------------- | -------------------- | ---------- |
| type.pageTitle     | 20px / 700          | 展示、公示类页面标题 | S2         |
| type.heroTitle     | 24px / 700          | 工作台 Hero 标题     | S2         |
| type.sectionTitle  | 14px / 600          | 模块标题             | S1         |
| type.objectTitle   | 16px / 700          | 档口、设备、当前对象 | S2         |
| type.body          | 14px / 400          | 正文、导航           | S1         |
| type.control       | 13px / 400          | 表单、表格、轻量内容 | S1         |
| type.meta          | 12px / 400          | 说明、时间、辅助信息 | S1         |
| type.microLabel    | 10–11px / 400–500 | 视频状态、微型标签   | S3         |
| type.kpi.secondary | 20px / 700          | 次级指标             | S2         |
| type.kpi.standard  | 24px / 700          | 标准 KPI             | S2         |
| type.kpi.emphasis  | 30px / 700          | 页面主强调 KPI       | S2         |

## 3.3 Border

| Token            |      Value | 使用条件                            | Rule Level |
| ---------------- | ---------: | ----------------------------------- | ---------- |
| border.control   | 1px#e2e8f0 | Input、Select、按钮、导航和通用分隔 | S2         |
| border.container | 1px#e8eef6 | Card、筛选区和业务容器              | S2         |
| border.tableRow  | 1px#f1f5f9 | Management Table 行分隔             | S1         |
| border.active    | 2px#2563eb | 二级导航、模块 Tab 和局部侧栏选中态 | S2         |

## 3.4 Radius

| Token                      | Value | 使用条件                            | Rule Level |
| -------------------------- | ----: | ----------------------------------- | ---------- |
| radius.displayContainer    |  12px | Dashboard、运营和公示页一级展示容器 | S2         |
| radius.managementContainer |  10px | CRUD 和密集管理业务容器             | S2         |
| radius.nestedCard          |   8px | 内部子卡、列表项、快捷入口          | S2         |
| radius.control             |   6px | Input、Select、标准按钮             | S1         |
| radius.pagination          |   5px | 分页项                              | S1         |
| radius.tag                 |   4px | 紧凑 Status Tag                     | S1         |
| radius.badge               |  20px | Status Badge 和场景切换项           | S2         |

不要将三档 Card 圆角合并为一个值。AI 必须根据容器层级选取。

## 3.5 Spacing

| Token             | Value | Scope                    | Rule Level |
| ----------------- | ----: | ------------------------ | ---------- |
| space.base        |   4px | 基础节奏                 | S1         |
| space.inline      |   8px | 图标文字、紧邻元素       | S2         |
| space.fieldGap    |  12px | 表单字段、小型内容组     | S2         |
| space.cardGap     |  16px | Card Grid、相邻卡片      | S2         |
| space.sectionGap  |  20px | 页面主要模块             | S2         |
| space.pagePadding |  20px | 主内容区                 | S1         |
| space.navigationX |  24px | 业务二级导航左右 Padding | S1         |

## 3.6 Shadow

| Token           | Value          | Scope          | Rule Level |
| --------------- | -------------- | -------------- | ---------- |
| shadow.card     | none           | 普通 Card      | S1         |
| shadow.floating | 柔和低强度阴影 | 下拉菜单等浮层 | S4         |

普通 Card 使用边框建立层级，不得默认添加阴影。浮层阴影没有唯一 Token，避免明显黑边和大面积扩散。

## 3.7 Page Background

页面根背景使用 **#eef2f8**，业务内容放在白色 Surface 中。不要将白色直接作为整页背景，也不要使用渐变、图片或深色作为全局背景，除非业务需求明确要求新的独立模式。

# 4 页面壳层规范

## 4.1 Header

| 属性         | 规则                                                 |
| ------------ | ---------------------------------------------------- |
| 高度         | 52px                                                 |
| 背景         | #ffffff                                              |
| 边框         | 底部 1px#e2e8f0                                      |
| 水平 Padding | 16px                                                 |
| 内容         | 菜单、Logo、系统名称、平台一级入口、搜索、消息、账号 |
| 一级入口字号 | 14px                                                 |
| 一级入口高度 | 32px                                                 |
| 一级入口圆角 | 8px                                                  |
| 激活状态     | #eff6ff 浅底、Primary 文字、Medium                   |

AI 不得删除 Header，或把 Header 改成深色、玻璃拟态和悬浮大圆角导航。

## 4.2 Secondary Navigation

| 属性         | 规则                                        |
| ------------ | ------------------------------------------- |
| 高度         | 42px                                        |
| 背景         | #ffffff                                     |
| 水平 Padding | 24px                                        |
| 项间距       | 约 24px                                     |
| 字号         | 14px                                        |
| 激活状态     | Primary 文字、Medium、底部 2px Primary 边线 |

有三级菜单时使用白底、1px #e2e8f0、8px 圆角、最小宽度 140px 的下拉菜单。菜单项字号 13px，Padding 9px 16px；选中项使用 #eff6ff 与 #2563eb。

## 4.3 Content Area

- 默认页面 Padding 为 20px。
- Section Gap 默认 20px。
- Dashboard 核心内容最大宽度为 1600px，并水平居中。
- CRUD、运营控制台和公示页保持流式布局；不得自动套用 1600px。
- 内容宽度不足时优先压缩 Grid 列数或允许横向表格滚动，不任意缩小字号。

## 4.4 Footer

Footer 使用白底、顶部 1px #e2e8f0、12px 弱文字和居中对齐。Footer 保持轻量，不加入大 Logo、链接矩阵或营销信息。

## 4.5 Local Sidebar

Local Sidebar 只在 CRUD 等需要局部业务分类的页面使用。

| 属性     | 规则                            |
| -------- | ------------------------------- |
| 宽度     | 200px                           |
| 背景     | #ffffff                         |
| 右边框   | 1px#e2e8f0                      |
| 分组标题 | 12px / 600                      |
| 菜单项   | 14px，紧凑高度                  |
| 选中态   | #eff6ff 背景 + 右侧 2px #2563eb |

# 5 页面模板选择规则

生成任何页面前，AI 必须先输出或在内部确认模板类型。不得绕过模板判断直接排版。

## 5.1 Template A Dashboard

**适用于：** 工作台、总览、经营概览、管理驾驶舱。

**结构：**

1. Hero 或页面概览区；
2. 3–4 个核心 KPI；
3. 左右栏主体；
4. 左侧承载任务、统计、快捷入口；
5. 右侧承载高风险事件、消息和业务提示。

**执行规则：**

- 核心内容最大宽度 1600px，水平居中。
- 页面 Padding 20px，模块 Gap 20px。
- 一级展示容器 12px；常规 KPI Card 可使用 10–12px。
- KPI Grid 优先 4 列，卡片 Gap 16px。
- Hero 可复用已有蓝色渐变 #2563eb → #3b82f6 → #60a5fa；仅 Hero 允许，不能扩展为全页背景。
- Hero Padding 22px 28px。
- 标准 KPI 使用 24px / 700；只有页面核心指标使用 30px。

## 5.2 Template B CRUD Management

**适用于：** 人员、供应商、菜单、设备、订单和基础数据管理。

**结构：**

1. 页面或局部导航；
2. 筛选区；
3. 操作栏；
4. Management Table；
5. 管理分页。

**执行规则：**

- 需要局部分类时使用 200px Local Sidebar。
- 筛选容器白底、1px #e8eef6、10px 圆角、Padding 16px 20px。
- Input、Select、查询和重置按钮统一高 32px、圆角 6px、字号 13px。
- 操作栏按钮高 30px、圆角 6px、字号 12px。
- 新增和查询使用 Primary；重置和导出使用 Secondary。
- Management Table 使用 13px 和 10px 14px 单元格 Padding。
- 分页默认 28×28px。
- 页面保持较高信息密度，不使用宽松营销布局。

## 5.3 Template C Object Operations Console

**适用于：** 设备控制、食堂控制、智慧空间、档口管理和 IoT 控制。

**结构：**

1. 场景或对象选择；
2. 当前组织或对象；
3. 核心 KPI；
4. 左侧对象列表或主工作区；
5. 右侧当前对象控制区。

**执行规则：**

- 主工作区自适应，右侧控制面板宽 280px。
- 页面级场景切换使用 Scene Tabs。
- 右侧控制模块切换使用 Module Tabs。
- 即时设备状态使用 Dot Status；紧凑业务状态使用 Tag。
- 控制项使用既有 Switch 和 Slider，不重新设计控件。
- 一级容器 12px，内部子卡 8px。

## 5.4 Template D Display / Disclosure

**适用于：** 信息公示、阳光食堂、数据展示和公众监督。

**结构：**

1. 页面标题与对象选择；
2. 指标 Card；
3. 展示模块；
4. Display Table、列表或已有图表。

**执行规则：**

- 页面密度比 CRUD 宽松，仍保持 B 端结构，不使用营销式大留白。
- 一级展示 Card 使用 12px，Padding 通常 20px。
- Page Title 使用 20px / 700。
- Display Table 可比 Management Table 更紧凑。
- 展示分页使用 26×26px。
- Status Badge 用于审计、公示、合格与直播等强调状态。

## 5.5 暂未形成模板的页面

详情、新增 / 编辑、配置、统计分析和数据大屏属于 S5。AI 遇到这些需求时：

- 继续使用既有 Header、Secondary Navigation、颜色、字体、间距和组件；
- 优先参考用户提供的现有同类页面；
- 不将菜单名称当作页面模板证据；
- 不自行建立新的大屏、图表或表单视觉体系。

# 6 Card 规范

| Card 类型     |   Radius |  Padding | Border                | Background         | Shadow | 使用条件                    |
| ------------- | -------: | -------: | --------------------- | ------------------ | ------ | --------------------------- |
| 一级展示 Card |     12px |     20px | 1px#e8eef6            | #ffffff            | none   | Dashboard、运营、公示主模块 |
| 管理 Card     |     10px | 16–20px | 1px#e8eef6            | #ffffff            | none   | CRUD、筛选区、密集业务容器  |
| 子 Card       |      8px | 12–16px | 1px#e8eef6 或 #f1f5f9 | #ffffff / #f8fafc  | none   | 嵌套内容、列表项、快捷入口  |
| KPI Card      | 10–12px | 16–20px | 1px#e8eef6            | #ffffff            | none   | 指标展示，按页面模板选圆角  |
| Alert Card    | 10–12px | 16–20px | 对应语义色浅边框      | 对应语义色极浅背景 | none   | 警告、高风险、异常摘要      |

Alert Card 只使用现有状态颜色的浅色版本。AI 不得创建紫色、青色等新的告警语义。

# 7 Button 规范

| 类型              |         高度 |   Radius |     Font |  Padding | 使用场景           | Rule Level |
| ----------------- | -----------: | -------: | -------: | -------: | ------------------ | ---------- |
| Primary Filter    |         32px |      6px |     13px |   0 16px | 查询、确认         | S1         |
| Primary Toolbar   |         30px |      6px |     12px |   0 14px | 新增               | S1         |
| Secondary Filter  |         32px |      6px |     13px |   0 16px | 重置               | S1         |
| Secondary Toolbar |         30px |      6px |     12px |   0 14px | 导出、次级批量操作 | S1         |
| Text              |       自适应 |        0 |     12px |        0 | 查看、编辑、删除   | S1         |
| Danger Filled     |     暂不约束 | 暂不约束 | 暂不约束 | 暂不约束 | 需要明确需求       | S5         |
| Icon Button       | 跟随所在壳层 |   4–8px |       — |   6–8px | 菜单、通知等       | S4         |

Primary 为 #2563eb 蓝底白字。Secondary 为白底和 #e2e8f0 边框。Text 编辑使用蓝色，删除使用红色。单一区域只保留一个主要动作。

# 8 Form 控件

## 8.1 Input

- 高 32px；
- 圆角 6px；
- 字号 13px；
- 水平 Padding 10px；
- 边框 1px #e2e8f0；
- Focus 可使用 blue-400 边框。

## 8.2 Select

- 高 32px；
- 圆角 6px；
- 字号 13px；
- 水平 Padding 8px；
- 白底、1px #e2e8f0。

## 8.3 Search

平台级搜索保持 Header 中的浅灰底、8px 圆角和 14px 文本。业务筛选搜索采用标准 Input，不将平台搜索样式复制到表单。

## 8.4 Switch

- 44×24px；
- 圆角 12px；
- Thumb 20×20px；
- On #2563eb；
- Off #cbd5e1。

## 8.5 Slider

- 轨道高 4px；
- Thumb 14×14px；
- 填充和 Thumb 使用 #2563eb。

完整 Error、Loading 和 Disabled 状态矩阵尚未确认。若业务需要，优先复用已有框架状态，不增加新的状态颜色。

# 9 Table

## 9.1 Management Table

| 属性           | 规则                           |
| -------------- | ------------------------------ |
| 字号           | 13px                           |
| 表头背景       | #f8fafc                        |
| 表头文字       | #64748b                        |
| 表头字重       | 500                            |
| 表头 Padding   | 10px 14px                      |
| 单元格 Padding | 10px 14px                      |
| 行分隔线       | #f1f5f9                        |
| Row Hover      | #f8fafc                        |
| Checkbox 主色  | #2563eb                        |
| 空数据         | 表格容器内居中显示“暂无数据” |
| 行内操作       | 蓝色编辑 / 查看，红色删除      |

Management Table 用于可查询、可选择、可批量操作和可编辑的数据管理。

## 9.2 Display Table

Display Table 用于价格公示、供应商公示和只读展示。

- 可使用比 Management Table 更紧凑的密度；
- 保持 12–13px 可读字号；
- 使用白色 Surface、浅色表头和浅分隔线；
- 不默认提供 Checkbox、批量操作和编辑 / 删除；
- 精确单元格 Padding 为 S4，应沿用参考展示页，不自行生成新的密度。

# 10 Pagination

| 类型                | 默认值             | 适用场景     | Rule Level |
| ------------------- | ------------------ | ------------ | ---------- |
| Standard Management | 28×28px，5px 圆角 | CRUD、管理表 | S2         |
| Compact Display     | 26×26px，5px 圆角 | 公示、展示表 | S2         |

两类分页选中项均使用 Primary 蓝底白字，普通项使用白底和 #e2e8f0 边框。AI 不得生成 32px、36px 或更大的分页项。

# 11 Tabs

## 11.1 Scene Tabs

用于页面级场景或模式切换：

- 外层圆角 24px；
- 外层 Padding 4px；
- 内部项圆角 20px；
- 选中项蓝底白字。

## 11.2 Module Tabs

用于同一业务对象内部的模块切换：

- 14px；
- 文字式；
- 选中项底部 2px #2563eb；
- 不使用胶囊背景。

## 11.3 Lightweight Tabs

用于待办 / 已办等局部状态切换：

- 13px；
- 圆角 6px；
- 选中项使用 #eff6ff 和 #2563eb；
- 保持紧凑，不放大为页面主导航。

# 12 Status

## 12.1 Semantic Colors

| 颜色 | 语义                         |
| ---- | ---------------------------- |
| 蓝色 | 正常操作、信息、当前选择     |
| 绿色 | 成功、正常、在线、营业       |
| 黄色 | 等待、暂停、警告、待审核     |
| 红色 | 异常、故障、高风险、删除     |
| 灰色 | 离线、已结束、停用、次级信息 |

## 12.2 Dot Status

用于设备在线、直播、连接和运行等需要快速扫描的即时状态。结构为小圆点 + 文字，不承载复杂业务标签。

## 12.3 Status Tag

用于表格和紧凑列表：

- 11–12px；
- 圆角 4px；
- Padding 2px 8px；
- 使用对应语义色的浅背景和文字。

## 12.4 Status Badge

用于合格 / 不合格、直播中、第三方审计等更强调的公示状态：

- 圆角 20px；
- Padding 3px 12px；
- 使用浅背景、语义色文字和可选浅边框。

# 13 Typography

| 名称          | Font Size |   Weight | Color             | Use Case                      |
| ------------- | --------: | -------: | ----------------- | ----------------------------- |
| Page Title    |      20px |      700 | #1e293b           | Display / Disclosure 页面标题 |
| Hero Title    |      24px |      700 | #ffffff           | Dashboard Hero                |
| Section Title |      14px |      600 | #1e293b           | Card 与模块标题               |
| Object Title  |      16px |      700 | #1e293b           | 档口、设备、当前对象          |
| Body          |      14px |      400 | #1e293b           | 正文、导航                    |
| Control       |      13px |      400 | #1e293b           | 表单、表格                    |
| Meta          |      12px |      400 | #64748b / #94a3b8 | 说明、时间、元数据            |
| Micro Label   |  10–11px | 400–500 | 语义色 /#64748b   | 微型状态                      |
| KPI Secondary |      20px |      700 | #1e293b           | 次级指标                      |
| KPI Standard  |      24px |      700 | #1e293b           | 标准 KPI                      |
| KPI Large     |      30px |      700 | #1e293b           | 页面唯一或少量强调指标        |

同一 KPI Grid 内应使用同一字号层级。不要因为数字位数短而单独放大。

# 14 Spacing

| 名称                 | 默认值 | 允许范围 | 使用条件           |
| -------------------- | -----: | -------: | ------------------ |
| Page Padding         |   20px |     固定 | 主内容区           |
| Section Gap          |   20px | 16–20px | 页面主要模块       |
| Card Gap             |   16px | 16–20px | Grid 和相邻 Card   |
| Card Padding         |   20px | 16–20px | 根据页面密度选择   |
| Field Gap            |   12px |  8–12px | 表单字段和小组件   |
| Inline Gap           |    8px |   4–8px | 图标文字和紧邻元素 |
| Navigation X Padding |   24px |     固定 | 二级导航           |

所有新增间距优先取 4px 的倍数。不得无依据生成 18px、22px、30px 等新的间距档位；现有明确实现中的特殊 Padding 除外。

# 15 页面密度

## 15.1 管理型页面

- 密度较高；
- 32px 表单控件、30px 操作栏按钮；
- 13px 表格；
- 10px 管理容器圆角；
- 模块间距主要为 16–20px。

## 15.2 Dashboard

- 中等密度；
- KPI 与业务模块并重；
- 允许 12px 一级容器和 20px Section Gap；
- 不使用营销型超大标题。

## 15.3 展示型页面

- 相对宽松；
- 12px 一级 Card、20px Padding；
- 表格可紧凑，模块整体留白较管理页稍宽；
- 仍属于 B 端页面，不使用落地页式大图和大面积留白。

# 16 AI 禁止事项

AI 生成时禁止：

- 自行使用玻璃拟态；
- 自行使用大面积渐变背景；
- 自行使用黑色深色主题；
- 自行将 Card 做成 20px 以上圆角；
- 自行增加大面积或高对比阴影；
- 自行使用 emoji 代替功能图标；
- 混用多套明显不同的图标风格；
- 将标准后台页面设计成营销网站；
- 取消或重组现有 Header 与 Secondary Navigation；
- 改变蓝、绿、黄、红、灰的状态语义；
- 创建规范外颜色、圆角和间距档位；
- 加入需求未说明的图表、指标和操作；
- 美化、补充或推断不存在的业务数据；
- 为填满页面而复制重复 Card；
- 将 1600px 最大宽度默认应用到所有模板；
- 将管理分页放大到 32px 以上。

# 17 WorkBuddy 页面生成流程

## Step 1 读取业务需求

识别用户、任务、数据对象、主要动作、状态、是否需要筛选和批量处理。

## Step 2 判断页面模板

在 Dashboard、CRUD Management、Object Operations Console、Display / Disclosure 中选择。无法归类时标记为未形成模板，不自由创造。

## Step 3 确认信息层级

确定页面标题、核心 KPI、主要工作区、次级模块、警告和辅助信息。

## Step 4 套用对应布局

应用壳层、页面 Padding、列结构、Local Sidebar 或右侧控制面板。

## Step 5 选择规范组件

选择正确的 Card、Button、Form、Table、Pagination、Tabs 和 Status 表达。

## Step 6 应用 Token

应用颜色、字体、边框、圆角、间距和阴影规则。

## Step 7 检查状态语义

确认所有业务状态使用正确的语义色，并选择 Dot、Tag 或 Badge。

## Step 8 检查规范外样式

删除未经需求支持的新颜色、新圆角、新阴影、emoji、装饰和业务数据。

# 18 原型生成前检查清单

- [ ] 已选择正确的页面模板；
- [ ] 已沿用 52px Header 和 42px Secondary Navigation；
- [ ] 页面 Padding 为 20px；
- [ ] Dashboard 才使用 1600px 最大宽度；
- [ ] Local Sidebar 或右侧控制面板只在对应模板中出现；
- [ ] Card 圆角与容器层级一致；
- [ ] 管理页控件高 32px、操作栏按钮高 30px；
- [ ] Primary、Secondary 和 Text Action 层级正确；
- [ ] 表格类型与页面用途一致；
- [ ] 分页使用正确的 28px 或 26px；
- [ ] Tabs 类型与切换层级一致；
- [ ] Dot、Tag、Badge 使用场景正确；
- [ ] 状态颜色语义一致；
- [ ] 未新增规范外颜色；
- [ ] 未新增规范外圆角；
- [ ] 未给普通 Card 添加阴影；
- [ ] 未使用 emoji 代替功能图标；
- [ ] 未改变页面信息密度；
- [ ] 未擅自增加图表或指标；
- [ ] 未生成需求中不存在的业务数据；
- [ ] 所有 S4 项均处于允许范围内；
- [ ] 所有 S5 项均未被 AI 自行补成“标准”。

本规范的目标是稳定复现当前产品的视觉与交互语言。若后续出现第三份有效设计证据，应继续更新校准记录，而不是直接覆盖本版本的判断依据。
