from __future__ import annotations

import hashlib
import json
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from unittest import mock
from pathlib import Path
from types import SimpleNamespace


SKILL = Path(__file__).resolve().parents[1]
GENERATE = SKILL / "scripts" / "generate.py"
VALIDATE = SKILL / "scripts" / "validate.py"


class DbDocsSmokeTest(unittest.TestCase):
    def test_partition_filter_is_conservative(self):
        sys.path.insert(0, str(SKILL / "scripts"))
        from common import filter_partitioned_tables

        names = ["order", "order202601", "order202602", "order202603", "orders", "orders0", "orders1", "orders2", "invoice", "invoice_2025", "invoice_2026", "audit202601", "audit202602", "user2025", "report209913"]
        self.assertEqual(["order", "orders", "invoice", "audit202601", "audit202602", "user2025", "report209913"], filter_partitioned_tables(names))

    def test_filename_component_is_safe_for_http_and_filesystems(self):
        sys.path.insert(0, str(SKILL / "scripts"))
        from common import filename_component

        self.assertEqual("order", filename_component("order"))
        self.assertEqual("order_items", filename_component("order_items"))
        self.assertEqual("a_u002F_b", filename_component("a/b"))
        self.assertEqual("a_b", filename_component("a_b"))
        self.assertEqual("a_u005F_u002F_b", filename_component("a_u002F_b"))
        self.assertNotEqual(filename_component("a/b"), filename_component("a_u002F_b"))
        self.assertEqual("_CON", filename_component("CON"))
        self.assertEqual("表_u003A_订单", filename_component("表:订单"))

    def test_rows_accepts_dictionary_cursor_rows(self):
        sys.path.insert(0, str(SKILL / "scripts"))
        from common import rows

        cursor = SimpleNamespace(description=[("name",), ("value",)], fetchall=lambda: [{"name": "x", "value": 1}])
        self.assertEqual([{"name": "x", "value": 1}], rows(cursor))

    def test_bundle_write_failure_preserves_existing_output(self):
        sys.path.insert(0, str(SKILL / "scripts"))
        from generate import atomic_write_bundle

        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "database"
            target.mkdir()
            (target / "old.txt").write_text("old", encoding="utf-8")
            with mock.patch.object(Path, "write_text", side_effect=OSError("write failed")):
                with self.assertRaises(OSError):
                    atomic_write_bundle(target, {"new.txt": "new"})
            self.assertEqual("old", (target / "old.txt").read_text(encoding="utf-8"))

    def test_sqlite_generation_is_complete_and_deterministic(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            db = root / "fixture.db"
            conn = sqlite3.connect(db)
            conn.executescript(
                """
                CREATE TABLE parent (id INTEGER PRIMARY KEY, label TEXT NOT NULL);
                CREATE TABLE child (
                  id INTEGER PRIMARY KEY,
                  parent_id INTEGER NOT NULL,
                  note TEXT DEFAULT 'x',
                  FOREIGN KEY(parent_id) REFERENCES parent(id)
                );
                CREATE UNIQUE INDEX uq_child_note ON child(note);
                CREATE TABLE orders (id INTEGER PRIMARY KEY);
                CREATE TABLE orders0 (id INTEGER PRIMARY KEY);
                CREATE TABLE orders1 (id INTEGER PRIMARY KEY);
                CREATE TABLE orders2 (id INTEGER PRIMARY KEY);
                CREATE TABLE archive202601 (id INTEGER PRIMARY KEY);
                CREATE TABLE archive202602 (id INTEGER PRIMARY KEY);
                """
            )
            conn.close()
            config = root / "config.json"
            config.write_text(json.dumps({
                "version": 1,
                "engine": "sqlite",
                "connection": {"host": None, "port": None, "username": None, "password": None, "database": None, "service_name": None, "sqlite_path": str(db), "tls": False},
                "selection": {"namespaces": [{"catalog": None, "schema": "main"}]},
            }), encoding="utf-8")

            self.run_script(GENERATE, "--config", config, "--output-dir", root)
            schema_path = root / "docs" / "database" / "schema.json"
            html_path = root / "docs" / "database" / "index.html"
            bundle_path = root / "docs" / "database"
            self.run_script(VALIDATE, "--dir", bundle_path)
            first = self.tree_digest(bundle_path)
            self.run_script(GENERATE, "--config", config, "--output-dir", root)
            self.assertEqual(first, self.tree_digest(bundle_path))

            data = json.loads(schema_path.read_text(encoding="utf-8"))
            refs = data["namespaces"][0]["tables"]
            names = [table["name"] for table in refs]
            self.assertIn("orders", names)
            self.assertNotIn("orders0", names)
            self.assertNotIn("orders1", names)
            self.assertNotIn("orders2", names)
            self.assertIn("archive202601", names)
            self.assertIn("archive202602", names)
            child_ref = next(table for table in refs if table["name"] == "child")
            self.assertNotIn("columns", child_ref)
            child = json.loads((bundle_path / child_ref["detail"]).read_text(encoding="utf-8"))["table"]
            self.assertEqual(["id"], child["primary_key"])
            self.assertEqual(["parent_id"], child["foreign_keys"][0]["columns"])
            self.assertEqual("parent", child["foreign_keys"][0]["ref_table"])
            self.assertEqual(["note"], child["unique_constraints"][0]["columns"])
            self.assertTrue(next(column for column in child["columns"] if column["name"] == "id")["identity"])
            self.assertTrue((bundle_path / child_ref["html"]).is_file())
            self.assertTrue(child_ref["detail"].endswith("/child.json"))
            self.assertTrue(child_ref["html"].endswith("/child.html"))
            search = json.loads((bundle_path / "search-index.json").read_text(encoding="utf-8"))
            self.assertIn("parent_id", [column["name"] for item in search if item["name"] == "child" for column in item["columns"]])
            self.assertNotIn('"columns":[{"name":"id","ordinal"', html_path.read_text(encoding="utf-8"))

    def test_document_template_has_no_external_resources(self):
        templates = [(SKILL / "assets" / name).read_text(encoding="utf-8") for name in ("document-template.html", "table-template.html")]
        self.assertNotRegex("".join(templates), r'(?:src|href)=["\'](?:https?:|//)')
        self.assertIn("__SCHEMA_JSON__", templates[0])
        self.assertIn("__SEARCH_INDEX_JSON__", templates[0])
        self.assertIn("__TABLE_JSON__", templates[1])
        self.assertIn("history.pushState", templates[0])
        self.assertIn("fetch(ref.detail)", templates[0])
        self.assertIn("renderNav(items)", templates[0])
        self.assertNotIn("__TABLE_JSON__", templates[0])

    @staticmethod
    def digest(path):
        return hashlib.sha256(path.read_bytes()).hexdigest()

    @staticmethod
    def tree_digest(root):
        digest = hashlib.sha256()
        for path in sorted(root.rglob("*")):
            if path.is_file():
                digest.update(path.relative_to(root).as_posix().encode())
                digest.update(path.read_bytes())
        return digest.hexdigest()

    def run_script(self, script, *args):
        result = subprocess.run([sys.executable, str(script), *map(str, args)], text=True, capture_output=True)
        self.assertEqual(0, result.returncode, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
