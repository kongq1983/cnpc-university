---
title: 环节 3：冲刺计划
sidebar_label: 3. 冲刺计划
sidebar_position: 3
mdx:
  format: mdx
---

import MermaidDiagram from '@site/src/components/MermaidDiagram';

# 环节 3：冲刺计划

<MermaidDiagram
  chart={`flowchart TB
    I[输入<br/>经规划的产品需求] --> A1[确认冲刺目标]
    A1 --> A2[评估容量与依赖]
    A2 --> A3[选择候选需求]
    A3 --> A4[识别风险]
    A4 --> A5[确定积压项优先级、负责人]
    A5 --> O[产出冲刺计划]
    classDef input fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef activity fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    classDef result fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#022c22
    class I input
    class A1,A2,A3,A4,A5 activity
    class O result`}
  description="冲刺计划从产品需求出发，经过目标、容量、范围和风险确认，产出可执行的冲刺计划。"
/>

## 何时做与谁参与

| 项目 | 内容 |
| --- | --- |
| 目标 | 在冲刺开始前确定目标、容量、范围、风险与依赖 |
| 时机 | 冲刺前 |
| 组织与主持 | 项目经理 |
| 参与 | 产品经理、技术经理、项目经理 |

## 做什么与 DevOps 记录

1. 确认冲刺目标，并检查其与产品规划的一致性。
2. 评估团队可用容量和已知外部依赖。
3. 从已规划的产品需求中选出候选积压项。
4. 识别技术、人员、环境与排期风险。
5. 确定积压项优先级、负责人和冲刺归属。

| 工作项类型 | 创建人 | 登记内容 | 关联关系 |
| --- | --- | --- | --- |
| 积压项更新 | 项目经理 | 冲刺归属、优先级、负责人 | 积压项与冲刺计划对应 |

## 产出与完成条件

- 产出：冲刺计划、已纳入冲刺范围的积压项。
- 进入：已有经规划的产品需求，且团队容量可评估。
- 完成：冲刺目标、范围、负责人、风险与依赖已确认，积压项已更新。

## 相关技能

- [grill-me](../skills/grill-me/SKILL)：用于追问目标、容量、范围与风险中的未决问题。
