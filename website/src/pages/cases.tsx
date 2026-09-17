import type {ReactNode} from 'react';
import Layout from '@theme/Layout';

import styles from './cases.module.css';

type CaseItem = {
  name: string;
  type: string;
};

const cases: CaseItem[] = [
  {name: '收支一体化平台', type: '产品迭代型'},
  {name: '师大智汇通', type: '创新型'},
  {name: 'K12易通云应用研发项目', type: '产品迭代型'},
  {name: '物联ECP2.0.27.0331', type: '产品迭代型'},
  {name: '智慧环境IEM2.0.27.0331', type: '产品迭代型'},
];

export default function Cases(): ReactNode {
  return (
    <Layout title="案例" description="AI 研发工程指南已有项目试点案例">
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.kicker}>CASES</p>
          <h1>案例</h1>
          <p>本工程已有项目试点，覆盖产品迭代与创新两类研发场景。</p>
        </header>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">序号</th>
                <th scope="col">项目名称</th>
                <th scope="col">项目类型</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item, index) => (
                <tr key={item.name}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
}
