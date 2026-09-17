export type RoleLink = {
  title: string;
  description: string;
  to: string;
};

export type RolePath = {
  id: 'new-member' | 'engineer' | 'tech-lead' | 'project-delivery';
  label: string;
  title: string;
  summary: string;
  prerequisite: string;
  nextStep: RoleLink;
  tasks: RoleLink[];
  journey: RoleLink[];
};

export const rolePaths: RolePath[] = [
  {
    id: 'new-member',
    label: '入门',
    title: '新成员',
    summary: '先建立全局认知，再选择长期职责路径，并用一个真实任务完成第一次实践。',
    prerequisite: '无需预先了解仓库目录或完整研发流程。',
    nextStep: {
      title: '先阅读基础概念',
      description: '理解用户故事地图、BDD、Gherkin 与 Feature 文件如何连接。',
      to: 'pathname:///从用户故事地图到可执行规范.html',
    },
    tasks: [
      {
        title: '了解这套指南',
        description: '确认流程、技能、候选模板与知识库自身说明的边界。',
        to: '/overview/README',
      },
      {
        title: '找到当前环节',
        description: '从研发流程总览定位参与角色、活动和预期产出。',
        to: '/process',
      },
      {
        title: '选择第一个技能',
        description: '按当前任务进入技能手册，不必先学习全部技能。',
        to: '/skills',
      },
    ],
    journey: [
      {
        title: '认识内容边界',
        description: '先理解知识库提供什么，以及哪些内容需要项目化评审。',
        to: '/overview/README',
      },
      {
        title: '阅读基础概念',
        description: '理解用户故事地图如何连接到 BDD、Gherkin 与 Feature 文件。',
        to: 'pathname:///从用户故事地图到可执行规范.html',
      },
      {
        title: '浏览完整研发流程',
        description: '按顺序查看冲刺计划、各阶段工作和评审回顾。',
        to: '/process',
      },
      {
        title: '选择长期职责路径',
        description: '比较研发工程师、技术负责人和项目与交付负责人路径。',
        to: '/roles',
      },
      {
        title: '完成一个真实任务',
        description: '根据当前任务选择技能，并按对应流程节点完成任务交付。',
        to: '/skills',
      },
    ],
  },
  {
    id: 'engineer',
    label: '交付',
    title: '研发工程师',
    summary: '围绕当前任务连接需求、项目规范、AI 技能、代码评审与测试验收。',
    prerequisite: '已经知道自己负责的用户故事、缺陷或技术任务。',
    nextStep: {
      title: '进入 AI 编码环节',
      description: '确认 Feature 文件和项目规范已评审后开始实现。',
      to: '/process/ai-coding',
    },
    tasks: [
      {
        title: '澄清并细化需求',
        description: '把用户故事转化为可实现、可验收的 Feature 文件。',
        to: '/process/user-story-feature-file',
      },
      {
        title: '实现并审核代码',
        description: '按已评审的行为规格和项目生效规范完成实现。',
        to: '/process/ai-coding',
      },
      {
        title: '定位并修复缺陷',
        description: '先确认根因和回归边界，再提交修复结果。',
        to: '/process/bug-fixing',
      },
    ],
    journey: [
      {
        title: '定位当前流程节点',
        description: '确认任务的进入条件、参与者和预期产出。',
        to: '/process',
      },
      {
        title: '确认可验收规格',
        description: '编码前确保 Feature 文件已经讨论并完成评审。',
        to: '/process/feature-file-review',
      },
      {
        title: '遵循项目生效规范',
        description: '优先使用目标项目规则；规范缺失时再参考候选模板。',
        to: '/templates',
      },
      {
        title: '按任务选择技能',
        description: '使用实现、测试或缺陷诊断技能完成具体工作。',
        to: '/skills',
      },
      {
        title: '完成审核与验收',
        description: '通过代码审核、测试和用户故事验收闭环交付。',
        to: '/process/code-review',
      },
    ],
  },
  {
    id: 'tech-lead',
    label: '治理',
    title: '技术负责人',
    summary: '建立项目约束，组织架构与技术评审，并把重复出现的问题沉淀为规范。',
    prerequisite: '了解目标项目的技术栈、目录结构和团队协作方式。',
    nextStep: {
      title: '评审候选规范模板',
      description: '只选择适用模板，并将其改写为目标项目的生效规范。',
      to: '/templates',
    },
    tasks: [
      {
        title: '接入目标项目',
        description: '选择项目脚手架范围，评审模板并验证第一项技能。',
        to: '/quick-start',
      },
      {
        title: '选择项目规范',
        description: '按真实技术栈评估项目指令、设计系统和工程规则。',
        to: '/templates',
      },
      {
        title: '组织代码审核',
        description: '检查实现、测试与规则符合性，并形成沉淀事项。',
        to: '/process/code-review',
      },
    ],
    journey: [
      {
        title: '确定接入边界',
        description: '决定使用完整项目脚手架还是仅复用技能。',
        to: '/quick-start',
      },
      {
        title: '形成项目生效规范',
        description: '裁剪候选模板，删除错误假设并完成团队评审。',
        to: '/templates',
      },
      {
        title: '把关实现与架构',
        description: '在 Feature 评审和代码审核中检查实现与架构问题。',
        to: '/process/feature-file-review',
      },
      {
        title: '沉淀可复用约束',
        description: '把审核和缺陷中反复出现的问题更新到项目规则。',
        to: '/process/code-review',
      },
    ],
  },
  {
    id: 'project-delivery',
    label: '协作',
    title: '项目与交付负责人',
    summary: '围绕冲刺目标组织需求、协作、验收和复盘，让每个环节都有明确产出。',
    prerequisite: '了解项目目标、参与团队和当前待交付范围。',
    nextStep: {
      title: '组织冲刺计划',
      description: '确认目标、容量、范围、依赖和风险。',
      to: '/process/sprint-planning',
    },
    tasks: [
      {
        title: '规划本次冲刺',
        description: '明确目标、容量、范围、负责人和主要风险。',
        to: '/process/sprint-planning',
      },
      {
        title: '组织需求梳理',
        description: '通过用户故事地图明确交付切片和优先级。',
        to: '/process/user-story-map-discussion',
      },
      {
        title: '验收并推动改进',
        description: '闭环验收与缺陷，并在冲刺结束时形成改进项。',
        to: '/process/user-story-acceptance',
      },
    ],
    journey: [
      {
        title: '设定冲刺目标',
        description: '平衡范围、容量、依赖与风险，形成可执行计划。',
        to: '/process/sprint-planning',
      },
      {
        title: '组织需求形成共识',
        description: '根据用户故事地图整理出可验收的 Feature 文件。',
        to: '/process/user-story-map-discussion',
      },
      {
        title: '跟踪研发与审核',
        description: '按流程产出判断进度，不用替代研发执行细节。',
        to: '/process/ai-coding',
      },
      {
        title: '完成验收和缺陷闭环',
        description: '记录验收结论，关联缺陷并跟踪修复结果。',
        to: '/process/user-story-acceptance',
      },
      {
        title: '评审成果并复盘',
        description: '展示交付成果，记录反馈并安排后续改进项。',
        to: '/process/sprint-review-retrospective',
      },
    ],
  },
];

export const rolePathById = Object.fromEntries(
  rolePaths.map((role) => [role.id, role]),
) as Record<RolePath['id'], RolePath>;
