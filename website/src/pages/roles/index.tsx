import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import {rolePaths} from '../../role-paths';
import styles from './index.module.css';

export default function Roles(): ReactNode {
  return (
    <Layout title="按角色开始" description="按当前职责进入 AI 研发工程指南">
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.kicker}>ROLE PATHS</p>
          <h1>按角色开始</h1>
          <p>选择当前职责，先处理手头任务；需要完整了解时，再按工作路径系统阅读。</p>
        </header>

        <section className={styles.roleGrid} aria-label="阅读者角色">
          {rolePaths.map((role) => (
            <Link className={styles.role} to={`/roles/${role.id}`} key={role.id}>
              <span>{role.label}</span>
              <h2>{role.title}</h2>
              <p>{role.summary}</p>
              <strong>进入阅读路径 →</strong>
            </Link>
          ))}
        </section>

        <section className={styles.startModes} aria-labelledby="start-mode-title">
          <div className={styles.sectionHeading}>
            <p>另一种起点</p>
            <h2 id="start-mode-title">需要把指南接入项目？</h2>
          </div>
          <div className={styles.modeRow}>
            <p>由技术负责人评估交付范围、裁剪候选模板，并验证第一项技能。</p>
            <Link to="/quick-start">查看接入目标项目指南 →</Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
