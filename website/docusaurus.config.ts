import path from 'node:path';

import matter from 'gray-matter';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import repositoryContentPlugin from './src/plugins/repository-content';

const siteUrl = process.env.DOCUSAURUS_URL ?? 'http://localhost:3000';
const baseUrl = process.env.DOCUSAURUS_BASE_URL ?? '/';
const repositoryUrl = 'https://gitlab.hzlinks.net/staffs/ai-engineering-guide';
const repositoryReadmePath = path.resolve(__dirname, '..', 'README.md');
const skillsRootPath = path.resolve(__dirname, '..', 'project-scaffold', '.agents', 'skills');
const repositoryDocumentSlugs = new Map([
  [repositoryReadmePath, '/overview/README'],
  [path.resolve(__dirname, '..', 'AGENTS.md'), '/overview/AGENTS'],
  [path.resolve(__dirname, '..', 'project-scaffold', 'AGENTS.template.md'), '/templates/AGENTS'],
  [path.resolve(__dirname, '..', 'project-scaffold', 'DESIGN.template.md'), '/templates/DESIGN'],
  [path.resolve(__dirname, '..', 'process', 'index.mdx'), '/process/'],
  [path.resolve(__dirname, '..', 'quick-start.mdx'), '/quick-start'],
]);

const config: Config = {
  title: 'AI 研发工程指南',
  tagline: '面向 AI 研发平台与编码助手的流程、规范模板与技能知识库',
  favicon: 'img/favicon.svg',
  url: siteUrl,
  baseUrl,
  onBrokenLinks: 'throw',
  future: {
    v4: true,
  },
  markdown: {
    format: 'detect',
    preprocessor({filePath, fileContent}) {
      if (!filePath.endsWith(`${path.sep}SKILL.md`)) {
        return fileContent;
      }

      const parsed = matter(fileContent);
      return typeof parsed.data.name === 'string'
        ? fileContent.replace(/^# .+$/m, `# ${parsed.data.name}`)
        : fileContent;
    },
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
    async parseFrontMatter({filePath, fileContent, defaultParseFrontMatter}) {
      const parsed = await defaultParseFrontMatter({filePath, fileContent});
      const skillName = parsed.frontMatter.name;
      const resolvedFilePath = path.resolve(filePath);
      const relativeSkillPath = path.relative(skillsRootPath, resolvedFilePath).replaceAll('\\', '/');
      const skillDirectory = relativeSkillPath.endsWith('/SKILL.md')
        ? relativeSkillPath.slice(0, -'/SKILL.md'.length)
        : null;
      const repositoryDocumentSlug = repositoryDocumentSlugs.get(path.resolve(filePath));
      const relativeTemplatePath = path.relative(
        path.resolve(__dirname, '..', 'project-scaffold'),
        resolvedFilePath,
      ).replaceAll('\\', '/');
      const templateRuleSlug = relativeTemplatePath.startsWith('docs/rules/') && relativeTemplatePath.endsWith('.template.md')
        ? `/templates/rules/${relativeTemplatePath.slice('docs/rules/'.length, -'.template.md'.length)}`
        : null;
      const isSupplementalSkillDoc = [
        'tdd/tests.md',
        'tdd/mocking.md',
        'improve-codebase-architecture/HTML-REPORT.md',
      ].includes(relativeSkillPath);

      return {
        ...parsed,
        frontMatter: {
          ...parsed.frontMatter,
          ...(repositoryDocumentSlug ? {slug: repositoryDocumentSlug} : {}),
          ...(templateRuleSlug ? {slug: templateRuleSlug} : {}),
          ...(skillDirectory && typeof skillName === 'string'
            ? {title: skillName}
            : {}),
          ...(skillDirectory && relativeSkillPath.endsWith('/SKILL.md')
            ? {slug: `/skills/${skillDirectory}/SKILL`}
            : {}),
          ...(isSupplementalSkillDoc ? {unlisted: true} : {}),
        },
      };
    },
  },
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'guide',
        path: path.resolve(__dirname, '..'),
        routeBasePath: '/',
        include: [
          'README.md',
          'AGENTS.md',
          'quick-start.mdx',
          'process/**/*.{md,mdx}',
          'project-scaffold/*.template.md',
          'project-scaffold/docs/rules/*.template.md',
          'project-scaffold/.agents/skills/*/SKILL.md',
          'project-scaffold/.agents/skills/tdd/tests.md',
          'project-scaffold/.agents/skills/tdd/mocking.md',
          'project-scaffold/.agents/skills/improve-codebase-architecture/HTML-REPORT.md',
        ],
        sidebarPath: './sidebars.guide.ts',
        showLastUpdateTime: true,
      },
    ],
    repositoryContentPlugin,
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['zh', 'en'],
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        docsDir: ['..'],
        docsRouteBasePath: ['overview', 'process', 'templates', 'skills'],
        docsPluginIdForPreferredVersion: 'guide',
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutHint: true,
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: false,
      disableSwitch: false,
    },
    navbar: {
      title: 'AI 研发工程指南',
      items: [
        {to: '/roles', label: '按角色开始', position: 'left'},
        {to: 'pathname:///从用户故事地图到可执行规范.html', label: '基础概念', position: 'left', target: '_self'},
        {to: '/process', label: '研发流程', position: 'left'},
        {to: '/skills', label: '技能', position: 'left'},
        {to: '/templates', label: '模板', position: 'left'},
        {to: '/cases', label: '案例', position: 'left'},
        {to: '/overview/README', label: '关于本库', position: 'left'},
        {href: repositoryUrl, label: 'GitLab', position: 'right'},
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: '阅读路径',
          items: [
            {label: '按角色开始', to: '/roles'},
            {label: '研发流程', to: '/process'},
          ],
        },
        {
          title: '可复用资产',
          items: [
            {label: '技能', to: '/skills'},
            {label: '模板', to: '/templates'},
            {label: '接入目标项目', to: '/quick-start'},
          ],
        },
        {
          title: '关于本库',
          items: [
            {label: '仓库定位', to: '/overview/README'},
            {label: '路线图', to: '/roadmap'},
            {label: 'GitLab', href: repositoryUrl},
          ],
        },
      ],
      copyright: `AI 研发工程指南 · ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
