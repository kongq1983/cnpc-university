import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import type {RolePath} from '../role-paths';
import ContentGuide from './ContentGuide';
import styles from './RolePathPage.module.css';

type RolePathPageProps = {
  role: RolePath;
};

export default function RolePathPage({role}: RolePathPageProps): ReactNode {
  return (
    <Layout title={`${role.title}阅读路径`}>
      <main className={styles.page}>
        <Link className={styles.backLink} to="/roles">← 所有角色</Link>
        <header className={styles.header}>
          <p className={styles.kicker}>{role.label}</p>
          <h1>{role.title}阅读路径</h1>
        </header>

        <section className={styles.section} aria-labelledby="current-task-title">
          <div className={styles.sectionHeading}>
            <p>快速查找</p>
            <h2 id="current-task-title">我现在要做什么</h2>
          </div>
          <div className={styles.taskGrid}>
            {role.tasks.map((task) => (
              <Link className={styles.task} to={task.to} target="_self" key={task.title}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <span>查看相关内容 →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="journey-title">
          <div className={styles.sectionHeading}>
            <p>系统阅读</p>
            <h2 id="journey-title">完整工作路径</h2>
          </div>
          <ol className={styles.journey}>
            {role.journey.map((step, index) => (
              <li key={step.title}>
                <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3><Link to={step.to} target="_self">{step.title}</Link></h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className={styles.nextStep}>
          <div>
            <p>建议下一步</p>
            <h2>{role.nextStep.title}</h2>
            <span>{role.nextStep.description}</span>
          </div>
          <Link to={role.nextStep.to} target="_self">继续阅读 →</Link>
        </aside>
      </main>
    </Layout>
  );
}
