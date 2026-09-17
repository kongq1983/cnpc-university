---
title: 环节 7：代码审核
sidebar_label: 7. 代码审核
sidebar_position: 7
mdx:
  format: mdx
---

import MermaidDiagram from '@site/src/components/MermaidDiagram';

# 环节 7：代码审核

<MermaidDiagram
  chart={`flowchart TB
    I[输入<br/>AI 生成的功能代码] --> A1[检查架构与安全]
    A1 --> A2[对照验收条件]
    A2 --> A3[登记审核问题]
    A3 --> A4[创建修复任务]
    A4 --> K[沉淀 rules]
    A4 --> O[产出<br/>审核结论]
    classDef input fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef activity fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    classDef result fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#022c22
    class I input
    class A1,A2,A3,A4 activity
    class K,O result`}
  description="代码审核检查工程约束和验收条件，问题进入修复任务，可复用规则沉淀到知识库。"
/>

## 何时做与谁参与

| 项目 | 内容 |
| --- | --- |
| 目标 | 审核 AI 编码结果是否满足工程规范、架构约束和业务需求，并沉淀可复用的编码规则 |
| 时机 | AI 编码后 |
| 任务创建 | 该积压项负责人 |
| 参与 | 组织 2-3 人进行代码审核 |

## 做什么与 DevOps 记录

1. 审核代码是否符合架构分层、代码风格、安全与测试约束。
2. 审核代码是否偏离 Feature 文件中的验收条件。
3. 发现规则问题后，按 SOP 沉淀 rules。
4. 由问题发现者创建相应任务工作项，并明确修复责任人。

| 工作项类型 | 创建人 | 登记内容 | 关联关系 |
| --- | --- | --- | --- |
| 任务 | 积压项负责人 | 说明框中艾特参与人；审核时长、发现的问题数量、审核的代码行数 | 任务关联对应积压项 |

## 产出与完成条件

- 产出：审核结论、rules 沉淀任务（如有）。
- 进入：AI 编码完成。
- 完成：审核结论已记录，发现的问题已创建任务，可进入用户故事验收。

## 相关技能

- 暂无技能（AI 驱动代码审核处于规划中），当前可以先根据 [项目模板](/templates)：按目标项目选定的后端、前端、API、数据库与安全规则模板执行人工审核。
