from __future__ import annotations

import argparse
import json
import os
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from common import connect, rows


DEFAULT_CONFIG = Path.home() / ".config" / "db-docs" / "config.json"
ASSET = Path(__file__).resolve().parents[1] / "assets" / "config-page.html"


def validate_connection(engine, connection):
    if engine not in {"mysql", "postgresql", "oracle", "sqlite"}:
        raise ValueError("不支持的数据库类型；SQL Server 当前不支持")
    if engine == "sqlite":
        if not connection.get("sqlite_path"):
            raise ValueError("SQLite 数据库文件不能为空")
        return
    for field, label in (("host", "主机"), ("username", "用户名")):
        if not connection.get(field):
            raise ValueError(f"{label}不能为空")
    if engine == "postgresql" and not connection.get("database"):
        raise ValueError("数据库名不能为空")
    if engine == "oracle" and not connection.get("service_name"):
        raise ValueError("Oracle service name 不能为空")


def fingerprint(engine, connection):
    return json.dumps([engine, connection], ensure_ascii=False, sort_keys=True)


def restore_password(config_path: Path, engine: str, connection: dict) -> dict:
    if connection.get("password") or not config_path.exists():
        return connection
    try:
        previous = json.loads(config_path.read_text(encoding="utf-8"))
        old = previous.get("connection", {})
    except (OSError, ValueError):
        return connection
    comparable = set(connection) | set(old)
    comparable.discard("password")
    if all(connection.get(key) == old.get(key) for key in comparable):
        copy = dict(connection)
        copy["password"] = old.get("password")
        return copy
    return connection


def namespaces(conn, engine: str):
    cur = conn.cursor()
    if engine == "sqlite":
        return [{"catalog": None, "schema": "main"}]
    if engine == "mysql":
        cur.execute("SELECT SCHEMA_NAME AS schema_name FROM information_schema.schemata WHERE SCHEMA_NAME NOT IN ('information_schema','mysql','performance_schema','sys') ORDER BY SCHEMA_NAME")
        return [{"catalog": None, "schema": r["schema_name"]} for r in rows(cur)]
    if engine == "postgresql":
        cur.execute("SELECT catalog_name, schema_name FROM information_schema.schemata WHERE schema_name NOT LIKE 'pg_%' AND schema_name <> 'information_schema' ORDER BY catalog_name, schema_name")
        return [{"catalog": r["catalog_name"], "schema": r["schema_name"]} for r in rows(cur)]
    if engine == "oracle":
        cur.execute("SELECT USER AS schema_name FROM DUAL")
        return [{"catalog": None, "schema": r["schema_name"]} for r in rows(cur)]
    raise ValueError("SQL Server 当前不支持")


class Handler(BaseHTTPRequestHandler):
    config_path: Path
    template: str
    tested_connections = set()

    def _send(self, status, payload, content_type="application/json; charset=utf-8"):
        body = payload if isinstance(payload, bytes) else payload.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/":
            self._send(200, self.template, "text/html; charset=utf-8")
            return
        if self.path == "/api/config" and self.config_path.exists():
            data = json.loads(self.config_path.read_text(encoding="utf-8"))
            data.get("connection", {}).pop("password", None)
            self._send(200, json.dumps(data, ensure_ascii=False))
            return
        self._send(404, json.dumps({"error": "not found"}))

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            data = json.loads(self.rfile.read(length).decode("utf-8"))
            if self.path == "/api/test":
                data["connection"] = restore_password(self.config_path, data.get("engine"), data.get("connection", {}))
                validate_connection(data.get("engine"), data.get("connection", {}))
                conn = connect(data["engine"], data["connection"])
                try:
                    options = namespaces(conn, data["engine"])
                finally:
                    conn.close()
                self.tested_connections.add(fingerprint(data["engine"], data["connection"]))
                self._send(200, json.dumps({"namespaces": options}, ensure_ascii=False))
            elif self.path == "/api/save":
                data["connection"] = restore_password(self.config_path, data.get("engine"), data.get("connection", {}))
                validate_connection(data.get("engine"), data.get("connection", {}))
                if fingerprint(data["engine"], data["connection"]) not in self.tested_connections:
                    raise ValueError("连接信息已改变，请重新测试连接")
                if not data.get("selection", {}).get("namespaces"):
                    raise ValueError("至少选择一个 catalog/schema")
                existing = None
                if self.config_path.exists():
                    existing = json.loads(self.config_path.read_text(encoding="utf-8"))
                if existing and not data["connection"].get("password"):
                    old = existing.get("connection", {})
                    comparable = set(data["connection"]) | set(old)
                    comparable.discard("password")
                    if all(data["connection"].get(k) == old.get(k) for k in comparable):
                        data["connection"]["password"] = old.get("password")
                config = {"version": 1, "engine": data["engine"], "connection": data["connection"], "selection": data["selection"]}
                self.config_path.parent.mkdir(parents=True, exist_ok=True)
                self.config_path.write_text(json.dumps(config, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                if os.name != "nt":
                    os.chmod(self.config_path, 0o600)
                self.tested_connections.clear()
                self._send(200, json.dumps({"ok": True}, ensure_ascii=False))
                threading.Thread(target=self.server.shutdown, daemon=True).start()
            else:
                self._send(404, json.dumps({"error": "not found"}))
        except Exception as exc:
            self._send(400, json.dumps({"error": str(exc)}, ensure_ascii=False))

    def log_message(self, *_args):
        return


def main():
    parser = argparse.ArgumentParser(description="db-docs 本地配置页")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--port", type=int, default=0)
    args = parser.parse_args()
    Handler.config_path = args.config.expanduser()
    Handler.template = ASSET.read_text(encoding="utf-8")
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    url = f"http://127.0.0.1:{server.server_port}/"
    print(f"请在浏览器中完成配置: {url}")
    threading.Timer(0.2, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
