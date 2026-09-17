# 评估指南

## 何时需要评估

只有当技能的输出可以客观验证时才建评估。主观输出（文案风格、措辞偏好）不建，改用 agent 读者验证（工作流程第 6 步）。

## 目录结构

    .agents/skills/<name>/evals/
    ├── evals.json      # 测试用例与断言
    └── results.json    # 每次运行的评分结果

## evals.json 示例

（本文件刻意使用缩进代码块而非围栏代码块，保证文件自身不含任何围栏。）

    [
      {
        "skill_name": "processing-pdfs",
        "query": "Extract all text from /tmp/report.pdf",
        "assertions": [
          {
            "text": "Output contains the exact string 'Q3 revenue'",
            "passed": true,
            "evidence": "Found in output line 42: 'Q3 revenue grew 12%'"
          }
        ]
      }
    ]

## 字段约定

下游查看器依赖固定字段名，不要自创：

- 断言用 `text` / `passed` / `evidence`
- 不要用 `name` / `met` / `details`
- `passed` 必须是布尔值，不得写成字符串

## 写断言的原则

- 每条断言必须能区分"带技能"与"不带技能"两个运行。两个运行里都通过的断言没有价值，删掉。
- 断言检查行为结果，不检查实现路径。
- 每个用例 3–7 条断言，覆盖正确性与关键输出格式。

## 运行流程

1. 构造 2–3 个真实测试提示。
2. 同一轮对话分别跑"带技能"和"不带技能"两个版本。
3. 逐条评分写入 `results.json`，字段与 `evals.json` 对应。
4. 带技能通过率必须高于基线；否则回到工作流程第 4–6 步修订 body。
