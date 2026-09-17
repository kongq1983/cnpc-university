---
title: 环节 4：讨论并生成 Feature 文件
sidebar_label: 4. 讨论并生成 Feature 文件
sidebar_position: 4
mdx:
  format: mdx
---

import MermaidDiagram from '@site/src/components/MermaidDiagram';

# 环节 4：讨论并生成 Feature 文件

<MermaidDiagram
  chart={`flowchart TB
    I[输入<br/>经评审的用户故事] --> A1[明确规则与边界]
    A1 --> A2[梳理验收场景]
    A2 --> A3[生成 Feature 文件]
    A3 --> A4[处理歧义与冲突]
    A4 --> A5[估算开发人天数]
    A5 --> O[产出<br/>Feature 文件]
    classDef input fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef activity fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    classDef result fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#022c22
    class I input
    class A1,A2,A3,A4,A5 activity
    class O,C result`}
  description="用户故事讨论把业务规则和验收场景固化为 Feature 文件，并估算开发工作量。"
/>

## 何时做与谁参与

| 项目 | 内容 |
| --- | --- |
| 目标 | 围绕用户故事展开讨论，生成 Feature 文件（BDD/Gherkin），并估算该故事的开发工作量 |
| 时机 | 冲刺中，按故事推进 |
| 组织与主持 | 该积压项负责人 |
| 参与 | 小组成员；每个用户故事指定一名负责人 |

## 做什么与 DevOps 记录

1. 明确用户故事的业务规则、边界条件与验收场景。
2. 讨论并生成 Feature 文件。
3. 评审生成过程中的歧义与冲突。
4. 会后估算该故事的开发人天数。

| 工作项类型 | 创建人 | 登记内容 | 关联关系 |
| --- | --- | --- | --- |
| 任务 | 积压项负责人 | 说明框中艾特参与人；评论区记录每次生成 Feature 文件花费的积分数量 | 任务关联对应积压项，开发人天数更新到积压项工作量 |

积分数量记录每次 AI 生成 Feature 文件的消耗，开发人天数记录人工工作量估算；两者分开登记，不混在同一个字段。

## 产出与完成条件

- 产出：Feature 文件、工作量估算（开发人天数，任务或积压项中更新）。
- 进入：该用户故事已通过故事地图评审，并指定负责人。
- 完成：Feature 文件已生成，开发人天数已登记。

## 相关技能

- [基础概念：从用户故事地图到可执行规范](pathname://../从用户故事地图到可执行规范.html)：先理解 BDD、Gherkin 与 Feature 文件之间的关系。
- [grill-me](../skills/grill-me/SKILL)：澄清业务规则与未决问题。
- [bdd](../skills/bdd/SKILL)：建立业务规则与验收条件，生成结构化 Feature 文件。
