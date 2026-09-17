import fs from 'node:fs';
import path from 'node:path';
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const projectTemplatePath = path.resolve(__dirname, '..', 'project-scaffold');
const rulesPath = path.join(projectTemplatePath, 'docs', 'rules');
const ruleIds = fs
  .readdirSync(rulesPath, {withFileTypes: true})
  .filter((entry) => entry.isFile() && entry.name.endsWith('.template.md'))
  .map((entry) => entry.name.slice(0, -'.template.md'.length))
   .sort((left, right) => left.localeCompare(right));

const backendRuleIds = ruleIds
  .filter((id) => id.startsWith('backend-'))
  .map((id) => 'project-scaffold/docs/rules/' + id + '.template');
const frontendRuleIds = ruleIds
  .filter((id) => id.startsWith('frontend-'))
  .map((id) => 'project-scaffold/docs/rules/' + id + '.template');

if (backendRuleIds.length === 0 || frontendRuleIds.length === 0) {
  throw new Error('规则侧栏未发现后端或前端规范文档。');
}

const sidebars: SidebarsConfig = {
  templatesSidebar: [
    {type: 'link', label: '模板总览', href: '/templates'},
    {type: 'doc', id: 'project-scaffold/AGENTS.template', label: '候选 AGENTS.md 模板'},
    {type: 'doc', id: 'project-scaffold/DESIGN.template', label: '候选 DESIGN.md 模板'},
    {
      type: 'category',
      label: '候选规则模板',
      collapsed: false,
      collapsible: false,
      link: {
        type: 'generated-index',
        slug: '/templates/rules',
        title: '候选规则模板',
        description: '面向技术负责人与研发工程师的候选工程规则。复制到目标项目后必须按真实技术栈评审、改写和裁剪，不能直接作为生效规范。',
      },
      items: [
        {
          type: 'category',
          label: '后端规则模板',
          items: backendRuleIds,
        },
        {
          type: 'category',
          label: '前端规则模板',
          items: frontendRuleIds,
        },
      ],
    },
  ],
};

export default sidebars;
