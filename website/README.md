# 文档网站

`README.md` 负责说明仓库定位与内容；本目录只负责构建和展示，直接读取仓库根目录的 `README.md`、`AGENTS.md`、`process/` 与 `project-scaffold/`，不复制知识源。`project-scaffold/` 下的规范文件是候选模板，不是文档网站自身或本仓库的生效规范；`.agents/skills/` 是项目脚手架内的可复用技能源。

```bash
pnpm install
pnpm start
```

生产构建：

```bash
pnpm build
```

部署时可用 `DOCUSAURUS_URL` 和 `DOCUSAURUS_BASE_URL` 覆盖站点地址与路径前缀。流程文档中的跨内容源链接会在构建时按 `DOCUSAURUS_BASE_URL` 解析，适合部署在域名子路径下。
