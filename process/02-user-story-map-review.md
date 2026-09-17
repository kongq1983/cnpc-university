---
title: 环节 2：用户故事地图评审
sidebar_label: 2. 用户故事地图评审
sidebar_position: 2
mdx:
  format: mdx
---

import MermaidDiagram from '@site/src/components/MermaidDiagram';

# 环节 2：用户故事地图评审

<MermaidDiagram
  chart={`flowchart TB
    I[输入<br/>用户故事地图初稿] --> A1[讲解故事与边界]
    A1 --> A2[确认理解差异]
    A2 --> A3[检查故事切分]
    A3 --> A4[更新地图与积压项]
    A4 --> O[产出<br/>故事地图终稿与积压项]
    classDef input fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef activity fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    classDef result fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#022c22
    class I input
    class A1,A2,A3,A4 activity
    class O,C result`}
  description="用户故事地图评审通过跨角色讨论，对齐需求理解并更新最终故事范围。"
/>

## 何时做与谁参与

| 项目 | 内容 |
| --- | --- |
| 目标 | 与开发小组宣贯和讨论用户故事，对齐需求理解，便于后续开发 |
| 时机 | 冲刺第 1 天 |
| 组织与主持 | 产品经理 |
| 参与 | 开发小组、产品经理、技术经理 |

## 做什么与 DevOps 记录

1. 产品经理讲解故事地图的目标、旅程和故事边界。
2. 开发小组提出理解差异、缺失场景与技术约束。
3. 技术经理确认故事切分是否适合开发与验收。
4. 会后更新故事地图和积压项。

| 工作项类型 | 创建人 | 登记内容 | 关联关系 |
| --- | --- | --- | --- |
| 积压项更新 | 产品经理 | 评审后的故事范围、优先级与负责人 | 积压项对应最终用户故事 |

## 产出与完成条件

- 产出：经评审的用户故事地图终稿、经评审的积压项。
- 进入：用户故事地图初稿已完成。
- 完成：开发小组、产品经理、技术经理对故事理解达成一致，积压项已更新。

## 相关技能

- [storymaps](../skills/storymaps/SKILL)：用于调整故事结构、拆分粒度和交付切片。
