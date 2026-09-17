import type {ReactNode} from 'react';
import Layout from '@theme/Layout';

import styles from './roadmap.module.css';

type RoadmapItem = {
  title: string;
  description: string;
  status: string;
};

const roadmapItems: RoadmapItem[] = [
  {
    title: 'AI 驱动测试',
    status: '规划中',
    description: '补充 AI 编码后的接口级、模块级与端到端测试边界，以及测试环境与数据准备要求。',
  },
  {
    title: 'AI 驱动代码审核',
    status: '规划中',
    description: '明确 AI 编码后的 review 流程、职责与准入标准；规则较少或对 AI 编码不放心时，可在编码前生成设计文档供评审，长期约束应沉淀到目标项目自己的规则中。',
  },
  {
    title: 'AI 驱动 CI/CD',
    status: '规划中',
    description: '探索 AI 在流水线生成、质量门禁、发布决策与失败诊断中的应用，明确自动化边界与人工审批要求。',
  },
];

export default function Roadmap(): ReactNode {
  return (
    <Layout title="路线图" description="AI 研发工程指南的后续建设计划">
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.kicker}>ROADMAP</p>
          <h1>路线图</h1>
          <p>当前优先建设事项与后续方向。</p>
        </header>
        {roadmapItems.length > 0 ? (
          <ol className={styles.timeline}>
            {roadmapItems.map((item, index) => (
              <li className={styles.item} key={item.title}>
                <span className={styles.marker}>{String(index + 1).padStart(2, '0')}</span>
                <article className={styles.card}>
                  <span className={styles.status}>{item.status}</span>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <p className={styles.empty}>暂无路线图事项。</p>
        )}
      </main>
    </Layout>
  );
}
