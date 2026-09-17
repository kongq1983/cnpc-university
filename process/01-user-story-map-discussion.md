---
title: 环节 1：用户故事地图讨论会
sidebar_label: 1. 用户故事地图讨论会
sidebar_position: 1
mdx:
  format: mdx
---

import MermaidDiagram from '@site/src/components/MermaidDiagram';

# 环节 1：用户故事地图讨论会

<MermaidDiagram
  chart={`flowchart TB
    I[输入<br/>已计划的冲刺需求] --> A1[梳理活动与步骤]
    A1 --> A2[拆分用户故事]
    A2 --> A3[组织故事地图]
    A3 --> A4[标记依赖与顺序]
    A4 --> O[产出<br/>故事地图初稿]
    O --> C[积压项创建]
    classDef input fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef activity fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    classDef result fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#022c22
    class I input
    class A1,A2,A3,A4 activity
    class O,C result`}
  description="用户故事地图讨论会把产品需求拆成用户旅程、故事卡片和可跟踪的积压项。"
/>

## 何时做与谁参与

| 项目 | 内容 |
| --- | --- |
| 目标 | 将已规划好的产品需求分解成用户故事地图，供开发小组后续对照开发和检查 |
| 时机 | 冲刺前 |
| 组织与主持 | 产品经理 |
| 参与 | 产品经理、技术经理；产品规划部负责人可选参与 |

## 做什么与 DevOps 记录

1. 梳理用户活动、步骤和故事卡片。
2. 将产品需求拆成大小合适的用户故事。
3. 按用户旅程和交付价值组织故事地图。
4. 标记故事之间的依赖与交付顺序。

| 工作项类型 | 创建人 | 登记内容 | 关联关系 |
| --- | --- | --- | --- |
| 积压项 | 产品经理 | 用户故事、优先级与交付范围 | 积压项对应故事地图中的故事 |

## 产出与完成条件

- 产出：用户故事地图初稿、DevOps 积压项。
- 进入：产品需求已规划完成。
- 完成：故事地图初稿可用于评审，积压项已创建。

## 相关技能

- [基础概念：从用户故事地图到可执行规范](pathname://../从用户故事地图到可执行规范.html)：先理解用户故事地图如何组织用户旅程、故事卡片与交付切片。
- [storymaps](../skills/storymaps/SKILL)：用于编写、改进和拆分用户故事，并组织到故事地图。
