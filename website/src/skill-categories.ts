export type SkillCategory = {
  id: string;
  label: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: 'planning-and-story',
    label: '规划与故事',
    skills: ['grill-me', 'grilling', 'storymaps'],
  },
  {
    id: 'specification-and-behavior',
    label: '规格与行为',
    skills: ['bdd', 'gherkin'],
  },
  {
    id: 'implementation-and-testing',
    label: '实现与测试',
    skills: ['implement', 'tdd', 'diagnosing-bugs'],
  },
  {
    id: 'architecture-and-refactoring',
    label: '架构与重构',
    skills: ['improve-codebase-architecture'],
  },
  {
    id: 'database',
    label: '数据库',
    skills: ['db-docs'],
  },
  {
    id: 'design',
    label: '设计',
    skills: ['ui-ux-pro-max'],
  },
  {
    id: 'skill-engineering',
    label: '技能工程',
    skills: ['write-skills'],
  },
];
