import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './templates.module.css';

type TemplateEntry = {
  label: string;
  title: string;
  description: string;
  to: string;
};

const templateEntries: TemplateEntry[] = [
  {
    label: '项目指令',
    title: '候选 AGENTS.md 模板',
    description: '项目级 AI 协作指令与研发约定，接入目标项目后需结合实际情况评审和改写。',
    to: '/templates/AGENTS',
  },
  {
    label: '设计系统',
    title: '候选 DESIGN.md 模板',
    description: '前端视觉、组件和交互约束，为目标项目建立统一的设计事实来源。',
    to: '/templates/DESIGN',
  },
  {
    label: '工程规则',
    title: '候选规则模板',
    description: '按后端与前端分类浏览工程规则，选择适用内容后复制、重命名并完成团队评审。',
    to: '/templates/rules',
  },
];

export default function Templates(): ReactNode {
  return (
    <Layout title="模板总览" description="AI 研发工程指南的候选项目模板总览">
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.kicker}>TEMPLATES</p>
          <h1>模板总览</h1>
          <p>从项目指令、设计系统和工程规则三个层面，为目标项目选择可复用的候选模板。</p>
        </header>

        <section className={styles.grid} aria-label="模板分类">
          {templateEntries.map((entry) => (
            <Link className={styles.card} to={entry.to} key={entry.to}>
              <span className={styles.label}>{entry.label}</span>
              <h2>{entry.title}</h2>
              <p>{entry.description}</p>
              <span className={styles.action}>查看模板 →</span>
            </Link>
          ))}
        </section>

        <aside className={styles.notice}>
          <strong>使用提示</strong>
          <p>这些文件是候选模板，不是本指南仓库的生效规范。复制到目标项目后，请去掉 \`.template\` 后缀，并根据真实技术栈、目录和团队约定完成评审、改写与裁剪。</p>
          <Link to="/quick-start">查看接入目标项目指南 →</Link>
        </aside>
      </main>
    </Layout>
  );
}
