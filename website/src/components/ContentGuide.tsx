import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';

import styles from './ContentGuide.module.css';

type ContentGuideProps = {
  audience: string;
  contentType: string;
  prerequisite: string;
  nextLabel: string;
  nextTo: string;
};

export default function ContentGuide({
  audience,
  contentType,
  prerequisite,
  nextLabel,
  nextTo,
}: ContentGuideProps): ReactNode {
  return (
    <dl className={styles.guide}>
      <div>
        <dt>适用角色</dt>
        <dd>{audience}</dd>
      </div>
      <div>
        <dt>内容类型</dt>
        <dd>{contentType}</dd>
      </div>
      <div>
        <dt>使用前提</dt>
        <dd>{prerequisite}</dd>
      </div>
      <div>
        <dt>下一步</dt>
        <dd><Link to={nextTo}>{nextLabel}</Link></dd>
      </div>
    </dl>
  );
}
