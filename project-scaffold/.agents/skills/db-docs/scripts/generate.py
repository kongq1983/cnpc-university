from __future__ import annotations

import argparse
import json
import os
import shutil
import tempfile
from pathlib import Path

from common import connect, filename_component, filter_partitioned_tables, qident, rows, value
from validate import validate_bundle


DEFAULT_CONFIG = Path.home() / ".config" / "db-docs" / "config.json"


def query(cur, sql, params=()):
    cur.execute(sql, params)
    return rows(cur)


def stable(items, *keys):
    return sorted(items, key=lambda item: tuple(str(item.get(key) or "") for key in keys))


def table_paths(catalog, schema, name):
    namespace = f"tables/{filename_component(catalog or '_')}/{filename_component(schema or '_')}"
    basename = filename_component(name)
    return f"{namespace}/{basename}.json", f"{namespace}/{basename}.html"


def sqlite_schema(conn, selected):
    cur = conn.cursor()
    out = []
    for ns in selected:
        schema = ns.get("schema") or "main"
        tables = []
        table_names = [r["name"] for r in query(cur, f"SELECT name FROM {qident('sqlite', schema)}.sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")]
        for name in filter_partitioned_tables(table_names):
            columns = []
            for c in query(cur, f"PRAGMA {qident('sqlite', schema)}.table_info({qident('sqlite', name)})"):
                identity = bool(c["pk"]) and (c["type"] or "").upper() == "INTEGER"
                columns.append({"name": c["name"], "ordinal": c["cid"] + 1, "type": c["type"] or None, "length": None, "precision": None, "scale": None, "nullable": not bool(c["notnull"]), "default": c["dflt_value"], "identity": identity, "comment": None})
            table_info = query(cur, f"PRAGMA {qident('sqlite', schema)}.table_info({qident('sqlite', name)})")
            pks = [c["name"] for c in sorted((c for c in table_info if c["pk"]), key=lambda c: c["pk"])]
            fks = {}
            for fk in sorted(query(cur, f"PRAGMA {qident('sqlite', schema)}.foreign_key_list({qident('sqlite', name)})"), key=lambda c: (c["id"], c["seq"])):
                item = fks.setdefault(fk["id"], {"name": f"fk_{name}_{fk['id']}", "columns": [], "ref_table": fk["table"], "ref_columns": []})
                item["columns"].append(fk["from"]); item["ref_columns"].append(fk["to"])
            uniques = []
            indexes = []
            for idx in query(cur, f"PRAGMA {qident('sqlite', schema)}.index_list({qident('sqlite', name)})"):
                idx_name = idx["name"]
                cols = [r["name"] for r in sorted(query(cur, f"PRAGMA {qident('sqlite', schema)}.index_info({qident('sqlite', idx_name)})"), key=lambda c: c["seqno"])]
                entry = {"name": idx_name, "columns": cols, "unique": bool(idx["unique"]), "method": None}
                indexes.append(entry)
                if idx["unique"] and not idx.get("origin") == "pk":
                    uniques.append({"name": idx_name, "columns": cols})
            tables.append({"name": name, "comment": None, "columns": columns, "primary_key": pks, "foreign_keys": list(fks.values()), "unique_constraints": sorted(uniques, key=lambda x: x["name"]), "indexes": sorted(indexes, key=lambda x: x["name"])})
        out.append({"catalog": ns.get("catalog"), "schema": schema, "tables": stable(tables, "name")})
    return out


def mysql_schema(conn, selected):
    cur = conn.cursor(dictionary=True)
    out = []
    for ns in selected:
        db = ns.get("catalog") or ns.get("schema")
        table_names = [r["name"] for r in query(cur, "SELECT TABLE_NAME AS name FROM information_schema.tables WHERE TABLE_SCHEMA=%s AND TABLE_TYPE='BASE TABLE' ORDER BY TABLE_NAME", (db,))]
        out.append({"catalog": ns.get("catalog"), "schema": db, "tables": stable(_mysql_tables(cur, db, filter_partitioned_tables(table_names)), "name")})
    return out


def _mysql_tables(cur, db, table_names):
    result = []
    for name in table_names:
        table_comment = query(cur, "SELECT TABLE_COMMENT AS comment FROM information_schema.tables WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s", (db, name))[0].get("comment")
        cols = query(cur, "SELECT ORDINAL_POSITION ordinal,COLUMN_NAME name,COLUMN_TYPE type,CHARACTER_MAXIMUM_LENGTH length,NUMERIC_PRECISION `precision`,NUMERIC_SCALE scale,IS_NULLABLE nullable,COLUMN_DEFAULT `default`,EXTRA extra,COLUMN_COMMENT comment FROM information_schema.columns WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s ORDER BY ORDINAL_POSITION", (db, name))
        columns = [{"name": c["name"], "ordinal": c["ordinal"], "type": c["type"], "length": c["length"], "precision": c["precision"], "scale": c["scale"], "nullable": c["nullable"] == "YES", "default": c["default"], "identity": "auto_increment" in (c["extra"] or ""), "comment": c["comment"] or None} for c in cols]
        cons = query(cur, "SELECT CONSTRAINT_NAME name,CONSTRAINT_TYPE kind FROM information_schema.table_constraints WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s ORDER BY CONSTRAINT_NAME", (db, name))
        pk = [r["column_name"] for r in query(cur, "SELECT COLUMN_NAME column_name FROM information_schema.key_column_usage WHERE CONSTRAINT_SCHEMA=%s AND TABLE_NAME=%s AND CONSTRAINT_NAME='PRIMARY' ORDER BY ORDINAL_POSITION", (db, name))]
        fks = []
        for r in query(cur, "SELECT CONSTRAINT_NAME name,COLUMN_NAME column_name,REFERENCED_TABLE_NAME ref_table,REFERENCED_COLUMN_NAME ref_column FROM information_schema.key_column_usage WHERE CONSTRAINT_SCHEMA=%s AND TABLE_NAME=%s AND REFERENCED_TABLE_NAME IS NOT NULL ORDER BY CONSTRAINT_NAME,ORDINAL_POSITION", (db, name)):
            item = next((x for x in fks if x["name"] == r["name"]), None)
            if not item: item = {"name": r["name"], "columns": [], "ref_table": r["ref_table"], "ref_columns": []}; fks.append(item)
            item["columns"].append(r["column_name"]); item["ref_columns"].append(r["ref_column"])
        uniques = [{"name": r["name"], "columns": [x["column_name"] for x in query(cur, "SELECT COLUMN_NAME column_name FROM information_schema.key_column_usage WHERE CONSTRAINT_SCHEMA=%s AND TABLE_NAME=%s AND CONSTRAINT_NAME=%s ORDER BY ORDINAL_POSITION", (db, name, r["name"] ))]} for r in cons if r["kind"] == "UNIQUE"]
        indexes = [{"name": r["index_name"], "columns": [x["column_name"] for x in query(cur, "SELECT COLUMN_NAME column_name FROM information_schema.statistics WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s AND INDEX_NAME=%s ORDER BY SEQ_IN_INDEX", (db, name, r["index_name"] ))], "unique": not bool(r["non_unique"]), "method": None} for r in query(cur, "SELECT DISTINCT INDEX_NAME index_name,NON_UNIQUE non_unique FROM information_schema.statistics WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s ORDER BY INDEX_NAME", (db, name))]
        result.append({"name": name, "comment": table_comment or None, "columns": columns, "primary_key": pk, "foreign_keys": fks, "unique_constraints": uniques, "indexes": indexes})
    return result


def postgres_schema(conn, selected):
    cur = conn.cursor()
    out = []
    for ns in selected:
        schema = ns.get("schema") or "public"; catalog = ns.get("catalog")
        table_names = [r["name"] for r in query(cur, "SELECT table_name name FROM information_schema.tables WHERE table_schema=%s AND table_type='BASE TABLE' ORDER BY table_name", (schema,))]
        result = []
        for name in filter_partitioned_tables(table_names):
            table_comment = query(cur, "SELECT obj_description((quote_ident(table_schema)||'.'||quote_ident(table_name))::regclass) comment FROM information_schema.tables WHERE table_schema=%s AND table_name=%s", (schema, name))[0].get("comment")
            cols = query(cur, "SELECT c.ordinal_position ordinal,c.column_name name,format_type(a.atttypid,a.atttypmod) type,c.character_maximum_length length,c.numeric_precision precision,c.numeric_scale scale,c.is_nullable nullable,c.column_default \"default\",c.is_identity identity,col_description((quote_ident(c.table_schema)||'.'||quote_ident(c.table_name))::regclass,c.ordinal_position) comment FROM information_schema.columns c JOIN pg_attribute a ON a.attrelid=(quote_ident(c.table_schema)||'.'||quote_ident(c.table_name))::regclass AND a.attname=c.column_name WHERE c.table_schema=%s AND c.table_name=%s ORDER BY c.ordinal_position", (schema, name))
            columns = [{"name": c["name"], "ordinal": c["ordinal"], "type": c["type"], "length": c["length"], "precision": c["precision"], "scale": c["scale"], "nullable": c["nullable"] == "YES", "default": c["default"], "identity": c["identity"] == "YES", "comment": c["comment"]} for c in cols]
            constraints = query(cur, "SELECT tc.constraint_name name,tc.constraint_type kind,kcu.column_name,kcu.ordinal_position FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_catalog=kcu.constraint_catalog AND tc.constraint_schema=kcu.constraint_schema AND tc.constraint_name=kcu.constraint_name AND tc.table_schema=kcu.table_schema AND tc.table_name=kcu.table_name WHERE tc.table_schema=%s AND tc.table_name=%s AND tc.constraint_type IN ('PRIMARY KEY','UNIQUE') ORDER BY tc.constraint_name,kcu.ordinal_position", (schema, name))
            pks = [r["column_name"] for r in constraints if r["kind"] == "PRIMARY KEY"]
            unique_map = {}
            fk_map = {}
            for r in constraints:
                if r["kind"] == "UNIQUE": unique_map.setdefault(r["name"], []).append(r["column_name"])
            for r in query(cur, "SELECT tc.constraint_name name,kcu.column_name,ccu.table_schema ref_schema,ccu.table_name ref_table,ccu.column_name ref_column,kcu.ordinal_position FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_catalog=kcu.constraint_catalog AND tc.constraint_schema=kcu.constraint_schema AND tc.constraint_name=kcu.constraint_name JOIN information_schema.referential_constraints rc ON tc.constraint_catalog=rc.constraint_catalog AND tc.constraint_schema=rc.constraint_schema AND tc.constraint_name=rc.constraint_name JOIN information_schema.key_column_usage ccu ON ccu.constraint_catalog=rc.unique_constraint_catalog AND ccu.constraint_schema=rc.unique_constraint_schema AND ccu.constraint_name=rc.unique_constraint_name AND ccu.ordinal_position=kcu.position_in_unique_constraint WHERE tc.table_schema=%s AND tc.table_name=%s AND tc.constraint_type='FOREIGN KEY' ORDER BY tc.constraint_name,kcu.ordinal_position", (schema, name)):
                item = fk_map.setdefault(r["name"], {"name": r["name"], "columns": [], "ref_schema": r["ref_schema"], "ref_table": r["ref_table"], "ref_columns": []})
                item["columns"].append(r["column_name"]); item["ref_columns"].append(r["ref_column"])
            indexes = []
            for r in query(cur, "SELECT i.relname name,ix.indisunique AS is_unique,am.amname method,array_agg(a.attname ORDER BY ord.ordinality) columns FROM pg_class t JOIN pg_namespace n ON n.oid=t.relnamespace JOIN pg_index ix ON ix.indrelid=t.oid JOIN pg_class i ON i.oid=ix.indexrelid JOIN pg_am am ON am.oid=i.relam CROSS JOIN LATERAL unnest(ix.indkey) WITH ORDINALITY ord(attnum,ordinality) LEFT JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum=ord.attnum WHERE n.nspname=%s AND t.relname=%s GROUP BY i.relname,ix.indisunique,am.amname ORDER BY i.relname", (schema, name)):
                indexes.append({"name": r["name"], "columns": list(r["columns"]), "unique": r["is_unique"], "method": r["method"]})
            result.append({"name": name, "comment": table_comment or None, "columns": columns, "primary_key": pks, "foreign_keys": list(fk_map.values()), "unique_constraints": [{"name": k, "columns": v} for k, v in sorted(unique_map.items())], "indexes": indexes})
        out.append({"catalog": catalog, "schema": schema, "tables": stable(result, "name")})
    return out


def oracle_schema(conn, selected):
    cur = conn.cursor(); out = []
    for ns in selected:
        schema = (ns.get("schema") or "").upper()
        table_names = [value(r, "TABLE_NAME") for r in query(cur, "SELECT TABLE_NAME FROM ALL_TAB_COMMENTS WHERE OWNER=:owner AND TABLE_TYPE='TABLE' ORDER BY TABLE_NAME", {"owner": schema})]
        result = []
        for name in filter_partitioned_tables(table_names):
            table_comment = value(query(cur, "SELECT COMMENTS FROM ALL_TAB_COMMENTS WHERE OWNER=:owner AND TABLE_NAME=:table_name AND TABLE_TYPE='TABLE'", {"owner": schema, "table_name": name})[0], "COMMENTS")
            cols = query(cur, "SELECT c.COLUMN_ID,c.COLUMN_NAME,c.DATA_TYPE,c.DATA_LENGTH,c.DATA_PRECISION,c.DATA_SCALE,c.NULLABLE,c.DATA_DEFAULT,c.IDENTITY_COLUMN,m.COMMENTS FROM ALL_TAB_COLUMNS c LEFT JOIN ALL_COL_COMMENTS m ON m.OWNER=c.OWNER AND m.TABLE_NAME=c.TABLE_NAME AND m.COLUMN_NAME=c.COLUMN_NAME WHERE c.OWNER=:owner AND c.TABLE_NAME=:table_name ORDER BY c.COLUMN_ID", {"owner": schema, "table_name": name})
            columns = [{"name": value(c, "COLUMN_NAME"), "ordinal": value(c, "COLUMN_ID"), "type": value(c, "DATA_TYPE"), "length": value(c, "DATA_LENGTH"), "precision": value(c, "DATA_PRECISION"), "scale": value(c, "DATA_SCALE"), "nullable": value(c, "NULLABLE") == "Y", "default": str(value(c, "DATA_DEFAULT")).strip() if value(c, "DATA_DEFAULT") is not None else None, "identity": value(c, "IDENTITY_COLUMN") == "YES", "comment": value(c, "COMMENTS")} for c in cols]
            constraints = query(cur, "SELECT CONSTRAINT_NAME,CONSTRAINT_TYPE FROM ALL_CONSTRAINTS WHERE OWNER=:owner AND TABLE_NAME=:table_name ORDER BY CONSTRAINT_NAME", {"owner": schema, "table_name": name})
            pks = []
            uniques = []
            fks = []
            for c in constraints:
                cname, ctype = value(c, "CONSTRAINT_NAME"), value(c, "CONSTRAINT_TYPE")
                ccols = [value(x, "COLUMN_NAME") for x in query(cur, "SELECT COLUMN_NAME FROM ALL_CONS_COLUMNS WHERE OWNER=:owner AND TABLE_NAME=:table_name AND CONSTRAINT_NAME=:constraint_name ORDER BY POSITION", {"owner": schema, "table_name": name, "constraint_name": cname})]
                if ctype == "P": pks = ccols
                elif ctype == "U": uniques.append({"name": cname, "columns": ccols})
                elif ctype == "R":
                    ref = query(cur, "SELECT R_OWNER,R_CONSTRAINT_NAME FROM ALL_CONSTRAINTS WHERE OWNER=:owner AND TABLE_NAME=:table_name AND CONSTRAINT_NAME=:constraint_name", {"owner": schema, "table_name": name, "constraint_name": cname})
                    if ref:
                        ref_owner, ref_constraint = value(ref[0], "R_OWNER"), value(ref[0], "R_CONSTRAINT_NAME")
                        parent = query(cur, "SELECT TABLE_NAME FROM ALL_CONSTRAINTS WHERE OWNER=:owner AND CONSTRAINT_NAME=:constraint_name", {"owner": ref_owner, "constraint_name": ref_constraint})
                        fks.append({"name": cname, "columns": ccols, "ref_schema": ref_owner, "ref_table": value(parent[0], "TABLE_NAME") if parent else None, "ref_columns": [value(x, "COLUMN_NAME") for x in query(cur, "SELECT COLUMN_NAME FROM ALL_CONS_COLUMNS WHERE OWNER=:owner AND CONSTRAINT_NAME=:constraint_name ORDER BY POSITION", {"owner": ref_owner, "constraint_name": ref_constraint})]})
            indexes = []
            for idx in query(cur, "SELECT INDEX_NAME,UNIQUENESS FROM ALL_INDEXES WHERE TABLE_OWNER=:owner AND TABLE_NAME=:table_name ORDER BY INDEX_NAME", {"owner": schema, "table_name": name}):
                idx_name = value(idx, "INDEX_NAME")
                indexes.append({"name": idx_name, "columns": [value(x, "COLUMN_NAME") for x in query(cur, "SELECT COLUMN_NAME FROM ALL_IND_COLUMNS WHERE INDEX_OWNER=:owner AND INDEX_NAME=:index_name ORDER BY COLUMN_POSITION", {"owner": schema, "index_name": idx_name})], "unique": value(idx, "UNIQUENESS") == "UNIQUE", "method": None})
            result.append({"name": name, "comment": table_comment or None, "columns": columns, "primary_key": pks, "foreign_keys": fks, "unique_constraints": uniques, "indexes": indexes})
        out.append({"catalog": None, "schema": schema, "tables": stable(result, "name")})
    return out


def build_schema(config):
    validate_config(config)
    engine = config["engine"]; conn = connect(engine, config["connection"])
    try:
        selected = sorted(config["selection"]["namespaces"], key=lambda n: ((n.get("catalog") or ""), (n.get("schema") or "")))
        namespaces = {"sqlite": sqlite_schema, "mysql": mysql_schema, "postgresql": postgres_schema, "oracle": oracle_schema}[engine](conn, selected)
        return {"version": 1, "engine": engine, "database": config["connection"].get("database") or config["connection"].get("service_name"), "namespaces": namespaces}
    finally:
        conn.close()


def validate_config(config):
    if config.get("version") != 1 or config.get("engine") not in {"mysql", "postgresql", "oracle", "sqlite"}:
        raise ValueError("配置的 version 或 engine 无效；SQL Server 当前不支持")
    if not isinstance(config.get("connection"), dict) or not isinstance(config.get("selection", {}).get("namespaces"), list) or not config["selection"]["namespaces"]:
        raise ValueError("配置必须包含至少一个选择的 catalog/schema")


def atomic_write_bundle(target, files):
    """Build a complete temporary bundle, then replace the old directory."""
    target.parent.mkdir(parents=True, exist_ok=True)
    temp_dir = Path(tempfile.mkdtemp(prefix=target.name + ".", dir=target.parent))
    backup = None
    old_moved = False
    new_published = False
    try:
        for relative, data in files.items():
            path = temp_dir / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(data, encoding="utf-8", newline="\n")
        if target.exists():
            backup = Path(tempfile.mkdtemp(prefix=target.name + ".bak.", dir=target.parent))
            backup.rmdir()
            os.replace(target, backup)
            old_moved = True
        os.replace(temp_dir, target)
        new_published = True
    except Exception:
        if new_published and target.exists():
            shutil.rmtree(target)
        if old_moved and backup and backup.exists():
            os.replace(backup, target)
        raise
    finally:
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
        if new_published and backup and backup.exists():
            shutil.rmtree(backup)


def render_table_html(detail_data, template):
    embedded = json.dumps(detail_data, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")
    return template.replace("__TABLE_JSON__", embedded)


def build_bundle(config):
    full_schema = build_schema(config)
    namespaces = []
    search_index = []
    table_files = []
    seen_paths = set()
    for namespace in full_schema["namespaces"]:
        refs = []
        for table in namespace["tables"]:
            detail_path, html_path = table_paths(namespace["catalog"], namespace["schema"], table["name"])
            path_key = detail_path.casefold()
            if path_key in seen_paths:
                raise ValueError(f"表名文件冲突，无法在当前文件系统中唯一保存: {detail_path}")
            seen_paths.add(path_key)
            detail_data = {
                "version": 1,
                "engine": full_schema["engine"],
                "database": full_schema["database"],
                "catalog": namespace["catalog"],
                "schema": namespace["schema"],
                "table": table,
            }
            refs.append({"name": table["name"], "comment": table["comment"], "detail": detail_path, "html": html_path})
            search_index.append({"catalog": namespace["catalog"], "schema": namespace["schema"], "name": table["name"], "comment": table["comment"], "detail": detail_path, "html": html_path, "columns": [{"name": column["name"], "comment": column["comment"]} for column in table["columns"]]})
            table_files.append({"path": detail_path, "detail_path": detail_path, "html_path": html_path, "data": detail_data})
        namespaces.append({"catalog": namespace["catalog"], "schema": namespace["schema"], "tables": refs})
    index_schema = {"version": 1, "engine": full_schema["engine"], "database": full_schema["database"], "namespaces": namespaces}
    return {"schema": index_schema, "search_index": search_index, "tables": table_files}


def main():
    parser = argparse.ArgumentParser(description="从数据库元数据生成 schema JSON 和离线 HTML")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--output-dir", type=Path, default=Path.cwd())
    args = parser.parse_args()
    config = json.loads(args.config.expanduser().read_text(encoding="utf-8"))
    bundle = build_bundle(config)
    validate_bundle(bundle["schema"], bundle["search_index"], bundle["tables"])
    index_template = (Path(__file__).resolve().parents[1] / "assets" / "document-template.html").read_text(encoding="utf-8")
    table_template = (Path(__file__).resolve().parents[1] / "assets" / "table-template.html").read_text(encoding="utf-8")
    if index_template.count("__SCHEMA_JSON__") != 1 or index_template.count("__SEARCH_INDEX_JSON__") != 1 or table_template.count("__TABLE_JSON__") != 1:
        raise ValueError("HTML 模板占位符数量无效")
    schema_json = json.dumps(bundle["schema"], ensure_ascii=False, indent=2) + "\n"
    search_json = json.dumps(bundle["search_index"], ensure_ascii=False, indent=2) + "\n"
    index_html = index_template.replace("__SCHEMA_JSON__", json.dumps(bundle["schema"], ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")).replace("__SEARCH_INDEX_JSON__", json.dumps(bundle["search_index"], ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c"))
    files = {"schema.json": schema_json, "search-index.json": search_json, "index.html": index_html}
    for item in bundle["tables"]:
        files[item["detail_path"]] = json.dumps(item["data"], ensure_ascii=False, indent=2) + "\n"
        files[item["html_path"]] = render_table_html(item["data"], table_template)
    target = args.output_dir.expanduser() / "docs" / "database"
    atomic_write_bundle(target, files)
    print(f"已生成离线文档包: {target}")


if __name__ == "__main__":
    main()
