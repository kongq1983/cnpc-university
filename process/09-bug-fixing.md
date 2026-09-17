---
title: 环节 9：修复 bug
sidebar_label: 9. 修复 bug
sidebar_position: 9
mdx:
  format: mdx
---

import MermaidDiagram from '@site/src/components/MermaidDiagram';

# 环节 9：修复 bug

<MermaidDiagram
  chart={`flowchart TB
    I[输入<br/>已登记并指派的 bug] --> A1[复现并定位根因]
    A1 --> A2[登记 bug 根因]
    A2 --> A3[沉淀 rules]
    A3 --> A4[修复并补充回归]
    A4 --> C[重新验收]
    classDef input fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef activity fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    classDef decision fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#581c87
    class I input
    class A1,A2,A3,A4 activity
    class C decision`}
  description="修复 bug 先定位根因，再按 skill、rules 或 AI 编码问题分类沉淀，并回到验收闭环。"
/>

## 何时做与谁参与

| 项目 | 内容 |
| --- | --- |
| 目标 | 按根因分类、登记和修复验收阶段发现的 bug，并循环至用户故事验收通过 |
| 时机 | 验收后循环至通过 |
| 参与 | bug 被指派的负责人 |

## 做什么与 DevOps 记录

1. 复现问题并定位根因。
2. 将根因分为 skill 的问题、rules 的问题、实际 AI 编码的问题。
3. 按 SOP 登记根因分类。
4. 修复功能并补充必要的回归验证。
5. 回到[环节 8：用户故事验收](./08-user-story-acceptance.md)重新验证。

<div className="ai-coding-warning">
  <strong>注意事项</strong>

  <p>非研发人员也可以在 AI 协助下尝试修复影响范围明确、改动较小的 bug。对于 AI 生成或修改的代码，如果对实现内容、影响范围或潜在风险不确定，可以邀请研发人员协助审核，确认修改方案和回归验证是否充分。</p>

  <p>初期建议从边界清晰、风险较低的小 bug 开始，并在修复和审核过程中持续沉淀项目规则、常见问题和验证方法。随着规则不断完善、可复用经验逐步增加，非研发人员可以在明确的约束下处理更大粒度、更复杂的 bug；涉及核心架构、安全等高风险变更，仍应由研发人员主导或完成审核。</p>
</div>

| 工作项类型 | 创建人 | 登记内容 | 关联关系 |
| --- | --- | --- | --- |
| 任务 | 问题发现者 | bug 根因分类与修复要求 | 任务挂在对应积压项下 |

## 产出与完成条件

- 产出：修复后的功能、回归验证结果。
- 进入：bug 已登记并指派。
- 完成：bug 修复完成，并通过用户故事验收。

## 相关技能

- [diagnosing-bugs](../skills/diagnosing-bugs/SKILL)：系统复现、定位和最小化问题。
