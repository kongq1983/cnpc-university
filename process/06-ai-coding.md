---
title: 环节 6：AI 编码
sidebar_label: 6. AI 编码
sidebar_position: 6
mdx:
  format: mdx
---

import MermaidDiagram from '@site/src/components/MermaidDiagram';

# 环节 6：AI 编码

<MermaidDiagram
  chart={`flowchart TB
    I[输入<br/>Feature 文件] --> A1[整理编码输入]
    A1 --> A2[执行 AI 生成]
    A2 --> A3[等待时处理其他故事]
    A3 --> O[产出<br/>功能代码]
    classDef input fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef activity fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    classDef result fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#022c22
    class I input
    class A1,A2,A3 activity
    class O result`}
  description="AI 编码以 Feature 文件和项目规则模板为输入，生成可进入代码审核的功能代码。"
/>

## 何时做与谁参与

| 项目 | 内容 |
| --- | --- |
| 目标 | 基于通过评审的 Feature 文件执行 AI 代码生成，产出可进入代码审核的功能代码 |
| 时机 | Feature 文件评审通过后 |
| 执行 | 该积压项负责人 |
| 参与 | 积压项负责人 |

## 做什么与 DevOps 记录

1. 整理 Feature 文件、用户故事和目标项目选定的规则模板作为 AI 编码输入。
2. 执行 AI 代码生成。
3. 在等待生成或执行过程中，可参与其他用户故事讨论。
4. 编码完成后整理变更范围，准备代码审核。

<div className="ai-coding-warning">
  <strong>注意事项</strong>

  <p>当项目规则尚不完善时，AI 编码前可以先形成一份详细设计文档，用于明确实现方案并辅助评审。但该文档属于临时性的增量产物，原则上不建议提交到代码库。详细设计文档评审中发现的问题，应尽量提炼为项目规则，减少后续重复沟通和审核成本。</p>

  <p>在这种模式下，需要分别审核详细设计文档和实现代码。待项目规则逐步完善后，可以直接开展 AI 编码，再以代码审核为主，并继续将审核中发现的共性问题沉淀为规则。核心目标是持续完善规则，把一次性的评审经验转化为可复用约束，逐步降低代码审核成本。</p>
</div>

本环节不单独创建 DevOps 工作项，编码状态在关联用户故事或任务中更新。

## 产出与完成条件

- 产出：AI 生成的功能代码。
- 进入：Feature 文件评审通过。
- 完成：功能代码已生成，具备进入代码审核的条件。

## 相关技能

- [implement](../skills/implement/SKILL)：基于需求、行为规格和目标项目规则模板实现功能代码。