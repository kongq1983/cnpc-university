import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  processSidebar: [
    {type: 'doc', id: 'process/index', label: '流程总览'},
    {
      type: 'category',
      label: '冲刺计划',
      items: [
        {type: 'doc', id: 'process/user-story-map-discussion', label: '用户故事地图讨论会'},
        {type: 'doc', id: 'process/user-story-map-review', label: '用户故事地图评审'},
        {type: 'doc', id: 'process/sprint-planning', label: '冲刺计划'},
      ],
    },
    {
      type: 'category',
      label: '需求梳理',
      items: [
        {type: 'doc', id: 'process/user-story-feature-file', label: '用户故事讨论与 Feature 文件'},
        {type: 'doc', id: 'process/feature-file-review', label: 'Feature 文件评审'},
      ],
    },
    {
      type: 'category',
      label: '编码开发',
      items: [
        {type: 'doc', id: 'process/ai-coding', label: 'AI 编码'},
        {type: 'doc', id: 'process/code-review', label: '代码审核'},
      ],
    },
    {
      type: 'category',
      label: '测试验收',
      items: [
        {type: 'doc', id: 'process/user-story-acceptance', label: '用户故事验收'},
        {type: 'doc', id: 'process/bug-fixing', label: '修复 bug'},
      ],
    },
    {
      type: 'category',
      label: '冲刺回顾',
      items: [{type: 'doc', id: 'process/sprint-review-retrospective', label: '冲刺评审与回顾'}],
    },
  ],
};

export default sidebars;
