# AI 研发工程指南

> 面向 AI 研发平台与 Codex/CodeBuddy 等 AI 编码助手的流程、规范模板与技能知识库。
> 沉淀研发全流程的方法，让 AI 编码助手在执行任务时“有章可循、越用越准”。

本仓库不是业务应用，而是一套**流程 + 模板 + 技能**的集合，并提供独立文档网站用于浏览。`project-scaffold/` 是可接入目标项目的项目脚手架：其中 `.agents/skills/` 可直接复用，`AGENTS.template.md`、`DESIGN.template.md` 与 `docs/rules/*.template.md` 仍只是候选模板，接入具体项目时必须由团队评审、改写和裁剪。

- **研发流程（`process/`）**：定义冲刺计划、需求梳理、编码开发、测试验收、冲刺回顾五阶段与十环节全流程。
- **项目脚手架（`project-scaffold/`）**：提供可直接复制的技能目录，以及需要项目化改写的指令、设计系统和工程规则模板。
- **技能（`project-scaffold/.agents/skills/`）**：覆盖需求、规格、实现、测试、数据库、设计等环节的可复用能力。
- **文档网站（`website/`）**：只读展示层，直接读取本仓库的知识源，不复制内容。

## 两类内容的边界

### 可复用技能

`project-scaffold/.agents/skills/` 下每个子目录是一项技能，以 `SKILL.md` 为入口，并可包含脚本、参考资料或资源。将 `project-scaffold/` 内部的内容复制到目标项目根目录后，技能会直接落在目标项目的 `.agents/skills/` 下，无需再调整技能路径。

### 项目候选模板

`project-scaffold/` 下的规范模板包含当前示例项目的技术栈、目录结构和工程假设，只能作为起点。接入目标项目时，复制脚手架内内容到目标项目根目录；技能可直接使用，规范模板仍需按需选择文件并完成以下重命名和评审：

`AGENTS.template.md` → `AGENTS.md`；`DESIGN.template.md` → `DESIGN.md`；`docs/rules/*.template.md` → `docs/rules/*.md`。

规则模板不要求整目录复制。项目负责人应根据真实技术栈、目录、团队约定和例外逐项确认，删除不适用内容；复制后还应同步更新模板内部链接中的 `.template` 后缀，再把最终文件放入目标项目 docs/rules/ 作为 AI 的生效规范。模板文件使用 `.template.md` 后缀，是为了与目标项目中的生效文件明确区分。

本仓库根目录的 `AGENTS.md` 只约束本指南仓库自身；`project-scaffold/` 内的规范模板不应被当作本仓库的生效指令加载。`.agents/skills/` 是项目脚手架中的可复用技能源，不属于本仓库的项目规范。

---

## 仓库结构

```
.
├── AGENTS.md              # 本指南仓库自身的 AI 指令
├── process/               # 冲刺研发流程
├── project-scaffold/       # 目标项目脚手架
│   ├── .agents/skills/    # 可直接复制使用的技能
│   ├── AGENTS.template.md
│   ├── DESIGN.template.md
│   └── docs/rules/*.template.md
└── website/               # Docusaurus 文档网站
```

---

## 项目脚手架（project-scaffold）

模板规则分为后端与前端两类，覆盖架构、API、数据库、领域事件、异常、日志、安全、租户、代码风格与 UI 约束。完整目录见文档站“项目脚手架”入口；规则导航按模板源文件生成。

---

## 技能（.agents/skills）

按研发阶段组织：规划与故事、规格与行为、实现与测试、架构与重构、数据库、设计与技能工程。技能入口统一为 `.agents/skills/*/SKILL.md`，名称与说明从源文件自动读取；技能卡片补充的依赖、作者、来源和标签信息单独维护在 website/skill-metadata.yml，不会写回或修改任何 SKILL.md。每个技能可以拥有多个标签，标签必须来自网站固定词表。

当需求、技术方案或其他问题存在模糊、缺少约束或多个未决选择时，可先使用 `grill-me` 作为通用澄清入口；它会调用 `grilling`，通过分轮追问把决策树和验收边界梳理清楚。

---

## 冲刺研发流程

主流程采用五阶段十环节：冲刺计划、需求梳理、编码开发、测试验收、冲刺回顾。每个环节明确目的、时机、组织与主持、参与人员、活动、DevOps 记录、产出、进入与完成条件，并映射到对应技能。

完整流程见文档站“研发流程”入口：`/process`。

---

## 如何阅读与接入

日常查找工作方法时，从文档站的[按角色开始](../roles)进入，再按当前任务前往对应流程、技能或规范。

需要把整套指南投放到真实项目时，查看[接入目标项目](../quick-start)。简要路径是：将 `project-scaffold/` 内部内容复制到目标项目根目录，保留 `.agents/skills/` 直接复用；`AGENTS.template.md`、`DESIGN.template.md` 与 `docs/rules/*.template.md` 仍需按需选择、去掉 `.template` 后缀并由团队评审裁剪。规则文件内的相互引用也要同步更新。

如果只需要技能，可单独复制 `project-scaffold/.agents/skills/`，再按各技能 `SKILL.md` 的说明在 AI 编码助手会话中调用。

### 运行文档网站

`README.md` 与根目录 `AGENTS.md` 说明本指南仓库自身；`website/` 是只读发布层，直接读取根目录的 `README.md`、`AGENTS.md`、`process/` 与 `project-scaffold/`，不复制知识源。技能清单从 `project-scaffold/.agents/skills/*/SKILL.md` 自动读取，不在 README 中重复维护描述。

本地启动、构建与部署参数见 `website/README.md`。
