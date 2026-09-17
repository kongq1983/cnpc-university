---
title: 环节 5：Feature 文件评审
sidebar_label: 5. Feature 文件评审
sidebar_position: 5
mdx:
  format: mdx
---

import MermaidDiagram from '@site/src/components/MermaidDiagram';

# 环节 5：Feature 文件评审

<MermaidDiagram
  chart={`flowchart TB
    I[输入<br/>生成的 Feature 文件] --> A1[核对业务规则]
    A1 --> A2[检查可实现性]
    A2 --> A3[确认场景覆盖]
    A3 --> A4[记录问题与责任人]
    A4 --> O[产出<br/>最终 Feature 文件]
    classDef input fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#172554
    classDef activity fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    classDef result fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#022c22
    class I input
    class A1,A2,A3,A4 activity
    class O result`}
  description="Feature 文件评审从业务、技术和场景覆盖三个角度确认 AI 编码输入可信。"
/>

## 何时做与谁参与

| 项目 | 内容 |
| --- | --- |
| 目标 | 评审 Feature 文件是否偏离产品经理的需求，确保后续 AI 编码输入可信 |
| 时机 | Feature 文件产出后 |
| 组织与主持 | 该积压项负责人 |
| 参与 | 小组成员、技术经理、产品经理 |

## 做什么与 DevOps 记录

1. 产品经理核对业务规则与产品需求是否一致。
2. 技术经理检查行为描述是否可实现、可测试。
3. 小组成员确认验收场景是否覆盖主要路径和边界。
4. 记录发现的问题并明确修改责任人。

| 工作项类型 | 创建人 | 登记内容 | 关联关系 |
| --- | --- | --- | --- |
| 会议 | 积压项负责人 | 发现的问题数量、会议时长、参会人数 | 会议关联对应积压项 |

## 产出与完成条件

- 产出：经最终评审的 Feature 文件。
- 进入：Feature 文件已生成。
- 完成：产品需求、业务规则、验收条件与实现边界已对齐，阻塞问题已处理。

## 相关技能

- [bdd](../skills/bdd/SKILL)：检查业务规则与验收条件的完整性，Given/When/Then 表达是否清晰、无歧义。
