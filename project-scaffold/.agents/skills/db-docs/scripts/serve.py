from __future__ import annotations

import argparse
import functools
import http.server
import socketserver
import webbrowser
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="在 localhost 提供 db-docs 离线文档包")
    parser.add_argument("--dir", type=Path, required=True)
    parser.add_argument("--port", type=int, default=0)
    parser.add_argument("--no-open", action="store_true", help="只启动服务，不自动打开浏览器")
    args = parser.parse_args()
    root = args.dir.expanduser().resolve()
    if not (root / "index.html").is_file():
        raise SystemExit(f"文档目录缺少 index.html: {root}")
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(root))
    with socketserver.ThreadingTCPServer(("127.0.0.1", args.port), handler) as server:
        server.daemon_threads = True
        url = f"http://127.0.0.1:{server.server_address[1]}/index.html"
        print(f"请在浏览器中查看文档: {url}", flush=True)
        if not args.no_open:
            webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
