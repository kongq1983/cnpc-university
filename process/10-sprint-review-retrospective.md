---
title: 环节 10：冲刺评审与回顾
sidebar_label: 10. 冲刺评审与回顾
sidebar_position: 10
mdx:
  format: mdx
---

import MermaidDiagram from '@site/src/components/MermaidDiagram';

# 环节 10：冲刺评审与回顾

<MermaidDiagram
  chart={`flowchart TB
    I[输入<br/>已验收的用户故事] --> A1[演示当次功能]
    A1 --> A2[收集评审意见]
    A2 --> A3[回顾协作与流程问题]
    A3 --> A4[整理改进项]
    A4 --> O[产出<br/>评审意见与改进项]
    classDef input fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef activity fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    classDef result fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#022c22
    class I input
    class A1,A2,A3,A4 activity
    class O result`}
  description="冲刺评审与回顾演示成果、收集意见，并汇总未完成沉淀和后续改进项。"
/>

## 何时做与谁参与

| 项目 | 内容 |
| --- | --- |
| 目标 | 演示当次冲刺开发的功能点，收集评审人员的意见和建议，并将有效建议转化为后续改进项 |
| 时机 | 冲刺最后一天 |
| 组织 | 项目经理或产品经理 |
| 参与 | 全体成员；可邀请产品规划部、客户支持部、项目交付中心等外部人员参加评审 |

## 做什么与 DevOps 记录

1. 每个小组派一名成员演示当次开发的功能点。
2. 项目经理或产品经理收集评审人员的意见和建议并登记。
3. 回顾冲刺中的协作、流程与交付问题。
4. 将需要跟进的意见、建议和问题整理为改进项。

| 工作项类型 | 创建人 | 登记内容 | 关联关系 |
| --- | --- | --- | --- |
| 会议 | 项目经理 | 评审意见、建议、回顾改进项 | 会议关联当次冲刺 |

## 产出与完成条件

- 产出：会议工作项、评审意见与建议、回顾改进项。
- 进入：冲刺内计划验收的用户故事已完成验收或有明确遗留结论。
- 完成：演示完成，评审意见、建议和改进项已登记。

## 相关技能

- [grill-me](../skills/grill-me/SKILL)：用于追问改进项的目标、责任与验证方式。
