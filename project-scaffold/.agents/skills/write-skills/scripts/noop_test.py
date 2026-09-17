#!/usr/bin/env python3
"""统计 SKILL.md 各 section 的体量，定位臃肿段落。

用法:
    python noop_test.py path/to/SKILL.md

只做统计，不做语义判断。阈值仅供参考:
    - 单个 section 超过 60 行  -> 建议考虑拆分到 references/
    - body 总行数超过 500 行  -> 必须拆分
"""

import re
import sys
from pathlib import Path

SECTION_WARN_LINES = 60
BODY_MAX_LINES = 500


def estimate_tokens(text: str) -> int:
    """粗略估算: CJK 字符按 1 token/字, 其余按 1 token/词。"""
    cjk = len(re.findall(r"[\u4e00-\u9fff]", text))
    words = len(re.sub(r"[\u4e00-\u9fff]", " ", text).split())
    return cjk + words


def strip_frontmatter(text: str) -> str:
    if text.lstrip().startswith("---"):
        parts = text.split("---", 2)
        if len(parts) == 3:
            return parts[2].lstrip("\n")
    return text


def parse_sections(text: str):
    """按 1-2 级标题切分 section, 返回 [{title, lines}]。"""
    sections = []
    current = {"title": "(导语)", "lines": []}
    for line in text.splitlines():
        if re.match(r"^#{1,2} \S", line):
            sections.append(current)
            current = {"title": line.lstrip("#").strip(), "lines": []}
        else:
            current["lines"].append(line)
    sections.append(current)
    return [s for s in sections if any(l.strip() for l in s["lines"])]


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 1
    path = Path(sys.argv[1])
    if not path.is_file():
        print(f"错误: 文件不存在: {path}")
        return 1

    body = strip_frontmatter(path.read_text(encoding="utf-8"))
    total_lines = len(body.splitlines())

    print(f"文件: {path}")
    print(f"body 总行数: {total_lines} (上限 {BODY_MAX_LINES})")
    print("-" * 64)
    for sec in parse_sections(body):
        chunk = "\n".join(sec["lines"])
        n = len(sec["lines"])
        flag = "  <-- 建议拆分到 references/" if n > SECTION_WARN_LINES else ""
        print(f"{sec['title']:<28} {n:>4} 行  ~{estimate_tokens(chunk):>5} tokens{flag}")
    print("-" * 64)
    if total_lines > BODY_MAX_LINES:
        print("结论: body 超过上限, 必须拆分。")
    else:
        print("结论: 行数在预算内。下一步: 逐句跑无操作测试, "
              "删掉删掉后行为不变的句子。")
    return 0


if __name__ == "__main__":
    sys.exit(main())