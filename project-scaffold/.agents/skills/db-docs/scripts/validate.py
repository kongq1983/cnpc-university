from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


ASSETS = Path(__file__).resolve().parents[1] / "assets"


def validate_json(data, schema_name):
    try:
        import jsonschema
    except ImportError:
        return
    schema = json.loads((ASSETS / schema_name).read_text(encoding="utf-8"))
    jsonschema.validate(data, schema)


def validate_bundle(schema, search_index, tables):
    validate_json(schema, "schema.schema.json")
    validate_json(search_index, "search-index.schema.json")
    refs = [table for namespace in schema["namespaces"] for table in namespace["tables"]]
    ref_paths = {table["detail"] for table in refs}
    search_paths = {item["detail"] for item in search_index}
    detail_paths = {item["path"] for item in tables}
    if len(ref_paths) != len(refs) or ref_paths != search_paths or ref_paths != detail_paths:
        raise ValueError("schema、搜索索引和表详情引用不一致")
    for item in tables:
        validate_json(item["data"], "table.schema.json")
        table = item["data"]["table"]
        ref = next(ref for ref in refs if ref["detail"] == item["path"])
        if table["name"] != ref["name"]:
            raise ValueError(f"表详情名称不一致: {item['path']}")


def validate_html(path):
    html = path.read_text(encoding="utf-8")
    if not re.search(r"<html[ >]", html, re.I):
        raise ValueError(f"HTML 文档不完整: {path}")
    if re.search(r"(?:src|href)=[\"'](?:https?:|//)", html, re.I):
        raise ValueError(f"HTML 不得依赖外部资源: {path}")


def validate_directory(root):
    schema = json.loads((root / "schema.json").read_text(encoding="utf-8"))
    search_index = json.loads((root / "search-index.json").read_text(encoding="utf-8"))
    table_files = []
    root = root.resolve()
    for namespace in schema["namespaces"]:
        for ref in namespace["tables"]:
            detail_path = (root / ref["detail"]).resolve()
            html_path = (root / ref["html"]).resolve()
            if root not in detail_path.parents or root not in html_path.parents:
                raise ValueError(f"表文档路径越界: {ref['name']}")
            if not detail_path.is_file() or not html_path.is_file():
                raise ValueError(f"缺少表文档: {ref['name']}")
            table_files.append({"path": ref["detail"], "data": json.loads(detail_path.read_text(encoding="utf-8"))})
            validate_html(html_path)
    validate_bundle(schema, search_index, table_files)
    validate_html(root / "index.html")


def main():
    parser = argparse.ArgumentParser(description="校验 db-docs 离线文档包")
    parser.add_argument("--dir", type=Path, required=True)
    args = parser.parse_args()
    try:
        validate_directory(args.dir)
    except Exception as exc:
        raise SystemExit(f"文档包校验失败: {exc}") from exc
    print("验证通过")


if __name__ == "__main__":
    main()
