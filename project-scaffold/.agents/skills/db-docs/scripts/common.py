"""Shared helpers for db-docs scripts."""
from __future__ import annotations

import importlib
import re
import subprocess
import sys
from collections.abc import Mapping


DRIVER_PACKAGES = {
    "mysql": ("mysql.connector", "mysql-connector-python"),
    "postgresql": ("psycopg", "psycopg[binary]"),
    "oracle": ("oracledb", "oracledb"),
    "sqlite": ("sqlite3", None),
}

PARTITION_MONTH = re.compile(r"^(?P<base>.+?)(?:[_-]?)(?P<year>19|20)\d{2}(?:0[1-9]|1[0-2])$")
PARTITION_YEAR = re.compile(r"^(?P<base>.+?)(?:[_-]?)(?:19|20)\d{2}$")
PARTITION_NUMBER = re.compile(r"^(?P<base>.+?)(?:[_-]?)(?P<index>\d+)$")
WINDOWS_RESERVED = {"CON", "PRN", "AUX", "NUL", *(f"COM{i}" for i in range(1, 10)), *(f"LPT{i}" for i in range(1, 10))}
ESCAPE_TOKEN = re.compile(r"_u[0-9a-f]{4}_", re.IGNORECASE)


def ensure_driver(engine: str):
    if engine not in DRIVER_PACKAGES:
        raise ValueError(f"不支持的数据库类型: {engine}。SQL Server 当前不支持。")
    module_name, package = DRIVER_PACKAGES[engine]
    try:
        return importlib.import_module(module_name)
    except ImportError:
        if not package:
            raise
        print(f"缺少 {engine} 驱动，正在安装 {package}...", file=sys.stderr)
        result = subprocess.run([sys.executable, "-m", "pip", "install", package], text=True, capture_output=True)
        if result.returncode:
            raise RuntimeError(f"自动安装驱动失败: {package}\n{result.stderr.strip()}")
        return importlib.import_module(module_name)


def rows(cursor):
    names = [item[0] for item in cursor.description or ()]
    return [dict(row) if isinstance(row, Mapping) else dict(zip(names, row)) for row in cursor.fetchall()]


def value(row, *names):
    for name in names:
        if name in row:
            return row[name]
        upper = name.upper()
        if upper in row:
            return row[upper]
        lower = name.lower()
        if lower in row:
            return row[lower]
    return None


def filter_partitioned_tables(table_names):
    """Drop date or contiguous numeric shards only when their base table exists."""
    names = list(table_names)
    by_fold = {}
    for name in names:
        by_fold.setdefault(name.casefold(), []).append(name)
    groups = {}
    numeric_groups = {}
    for name in names:
        date_match = PARTITION_MONTH.match(name) or PARTITION_YEAR.match(name)
        if date_match:
            base = date_match.group("base").rstrip("_-")
            groups.setdefault(base.casefold(), []).append(name)
            continue
        numeric_match = PARTITION_NUMBER.match(name)
        if numeric_match:
            base = numeric_match.group("base").rstrip("_-")
            numeric_groups.setdefault(base.casefold(), []).append((int(numeric_match.group("index")), name))
    excluded = set()
    for base_fold, shards in groups.items():
        if len(shards) >= 2 and base_fold in by_fold:
            excluded.update(shards)
    for base_fold, indexed_shards in numeric_groups.items():
        indexes = sorted({index for index, _ in indexed_shards})
        if len(indexes) >= 2 and indexes[0] in (0, 1) and indexes == list(range(indexes[0], indexes[-1] + 1)) and base_fold in by_fold:
            excluded.update(name for _, name in indexed_shards)
    return [name for name in names if name not in excluded]


def filename_component(name: str) -> str:
    """Encode a database identifier as a deterministic, cross-platform path component."""
    text = str(name)
    parts = []
    for index, char in enumerate(text):
        escaped_token = char == "_" and ESCAPE_TOKEN.match(text[index:])
        parts.append(char if (char.isalnum() or char in "-_.~") and not escaped_token else f"_u{ord(char):04X}_")
    encoded = "".join(parts)
    if encoded in {".", ".."} or encoded.upper().split(".", 1)[0] in WINDOWS_RESERVED:
        encoded = "_" + encoded
    if encoded.endswith("."):
        encoded = encoded[:-1] + "_u002E_"
    return encoded or "_"


def qident(engine: str, name: str) -> str:
    if engine == "mysql":
        return "`" + name.replace("`", "``") + "`"
    return '"' + name.replace('"', '""') + '"'


def connect(engine: str, connection: dict):
    driver = ensure_driver(engine)
    if engine == "sqlite":
        return driver.connect(connection["sqlite_path"])
    if engine == "mysql":
        args = {"host": connection.get("host"), "port": connection.get("port") or 3306,
                "user": connection.get("username"), "password": connection.get("password"),
                "database": connection.get("database"), "use_pure": True}
        if connection.get("tls"):
            args["ssl_disabled"] = False
        return driver.connect(**{k: v for k, v in args.items() if v is not None})
    if engine == "postgresql":
        args = {"host": connection.get("host"), "port": connection.get("port") or 5432,
                "user": connection.get("username"), "password": connection.get("password"),
                "dbname": connection.get("database")}
        if connection.get("tls"):
            args["sslmode"] = "require"
        return driver.connect(**{k: v for k, v in args.items() if v is not None})
    if engine == "oracle":
        host = connection.get("host") or "localhost"
        port = connection.get("port") or 1521
        service = connection.get("service_name") or connection.get("database")
        dsn = driver.makedsn(host, port, service_name=service)
        return driver.connect(user=connection.get("username"), password=connection.get("password"), dsn=dsn)
    raise ValueError(f"不支持的数据库类型: {engine}")
