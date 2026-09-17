---
title: 环节 8：用户故事验收
sidebar_label: 8. 用户故事验收
sidebar_position: 8
mdx:
  format: mdx
---

import MermaidDiagram from '@site/src/components/MermaidDiagram';

# 环节 8：用户故事验收

<MermaidDiagram
  chart={`flowchart TB
    I[输入<br/>通过代码审核的功能] --> A1[对照故事与 Feature]
    A1 --> A2[验证功能]
    A2 --> C{是否通过}
    C --> |有 bug| A3[登记并指派 bug]
    C --> |通过| A5[产出<br/>验收结论]
    classDef input fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef activity fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    classDef decision fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#581c87
    classDef result fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#022c22
    class I input
    class A1,A2,A3,A4 activity
    class C decision
    class A5 result`}
  description="用户故事验收对照需求和 Feature 文件验证功能，不通过时进入 bug 修复闭环。"
/>

## 何时做与谁参与

| 项目 | 内容 |
| --- | --- |
| 目标 | 对通过代码审核的功能进行验收，登记发现的需求问题或编码问题，并形成 bug 闭环 |
| 时机 | 代码审核通过后 |
| 组织与主持 | 该积压项负责人 |
| 参与 | 积压项负责人与团队成员 |

## 做什么与 DevOps 记录

1. 对照用户故事和 Feature 文件验证功能。
2. 记录验收结论与不满足项。
3. 发现需求问题或编码问题时登记 bug。
4. 将 bug 指派给相应负责人，并挂在对应积压项下。

| 工作项类型 | 创建人 | 登记内容 | 关联关系 |
| --- | --- | --- | --- |
| 任务 | 积压项负责人 | 说明框中艾特参与人；验收时长 | 任务关联对应积压项；bug 挂在积压项下 |

## 产出与完成条件

- 产出：验收结论、bug 清单（如有）。
- 进入：代码审核通过。
- 完成：验收结论已记录；如有 bug，bug 已登记、指派并关联积压项。

## 相关技能

- 暂无技能（AI 驱动集成测试处于规划中），当前可以先人工完成测试。
