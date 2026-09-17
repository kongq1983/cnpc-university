import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useGlobalData from '@docusaurus/useGlobalData';

import {rolePaths} from '../role-paths';
import styles from './index.module.css';

type SkillMetadata = {
  name: string;
  description: string;
  directory: string;
};

type SkillsPluginData = {
  skills: SkillMetadata[];
  documentCounts: {
    rules: number;
  };
};

type Entry = {
  label: string;
  title: string;
  description: string;
  to: string;
};

const startEntries: Entry[] = [
  {
    label: '阅读',
    title: '查找工作方法',
    description: '从当前角色和手头任务出发，进入对应流程、技能或规范。',
    to: '/roles',
  },
  {
    label: '接入',
    title: '接入目标项目',
    description: '评估项目脚手架范围，裁剪候选规范，并完成第一次技能调用。',
    to: '/quick-start',
  },
];

export default function Home(): ReactNode {
  const globalData = useGlobalData();
  const skillsPluginData = globalData['repository-content']?.default as SkillsPluginData | undefined;
  const skillCount = skillsPluginData?.skills.length ?? 0;
  const rulesCount = skillsPluginData?.documentCounts.rules ?? 0;

  const renderEntries = (entries: Entry[]) => entries.map((entry) => (
    <Link className={styles.entry} to={entry.to} key={entry.to}>
      <span className={styles.entryEyebrow}>{entry.label}</span>
      <h3>{entry.title}</h3>
      <p>{entry.description}</p>
    </Link>
  ));

  return (
    <Layout title="AI 研发工程指南" description="面向 AI 研发平台与编码助手的流程、规范模板与技能知识库">
      <main className={styles.page}>
        <section className={styles.intro}>
          <p className={styles.kicker}>AI ENGINEERING GUIDE</p>
          <h1>AI 研发工程指南</h1>
          <p className={styles.lede}>
            按你的职责找到研发流程、AI 技能和项目规范，把当前任务推进到明确产出。
          </p>
        </section>

        <section className={styles.entrySection} aria-labelledby="role-entry-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>从这里开始</p>
            <h2 id="role-entry-title">选择当前角色</h2>
          </div>
          <div className={styles.roleEntries}>
            {rolePaths.map((role) => (
              <Link className={styles.entry} to={`/roles/${role.id}`} key={role.id}>
                <span className={styles.entryEyebrow}>{role.label}</span>
                <h3>{role.title}</h3>
                <p>{role.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.entrySection} aria-labelledby="start-entry-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>选择方式</p>
            <h2 id="start-entry-title">你准备做什么</h2>
          </div>
          <div className={styles.startEntries}>{renderEntries(startEntries)}</div>
        </section>

        <section className={styles.statusBar} aria-label="知识库统计">
          <span>当前技能</span>
          <strong>{skillCount}</strong>
          <span>个</span>
          <span className={styles.statusDivider} />
          <span>规则模板</span>
          <strong>{rulesCount}</strong>
          <span>篇</span>
        </section>
      </main>
    </Layout>
  );
}
