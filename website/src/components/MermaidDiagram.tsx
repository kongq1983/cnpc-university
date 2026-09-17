import {useId, useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import {useColorMode} from '@docusaurus/theme-common';

import styles from './MermaidDiagram.module.css';

type MermaidDiagramProps = {
  chart: string;
  description?: string;
};

const mermaidPromise = import('mermaid').then(({default: mermaid}) => mermaid);
let initializedTheme: 'dark' | 'neutral' | undefined;

export default function MermaidDiagram({chart, description}: MermaidDiagramProps): ReactNode {
  const {colorMode} = useColorMode();
  const reactId = useId();
  const [svg, setSvg] = useState<string>();
  const [renderFailed, setRenderFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const renderDiagram = async () => {
      const mermaid = await mermaidPromise;
      const theme = colorMode === 'dark' ? 'dark' : 'neutral';

      if (initializedTheme !== theme) {
        mermaid.initialize({startOnLoad: false, securityLevel: 'strict', theme});
        initializedTheme = theme;
      }

      const result = await mermaid.render(
        `mermaid-${reactId.replaceAll(/[^a-zA-Z0-9]/g, '')}`,
        chart,
      );

      if (!cancelled) {
        setSvg(result.svg);
        setRenderFailed(false);
      }
    };

    setSvg(undefined);
    setRenderFailed(false);
    renderDiagram().catch(() => {
      if (!cancelled) {
        setRenderFailed(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [chart, colorMode, reactId]);

  if (renderFailed) {
    return (
      <div className={styles.fallback} role="status">
        <p>流程图加载失败，已显示图表源码。</p>
        <pre>
          <code className="language-mermaid">{chart}</code>
        </pre>
      </div>
    );
  }

  return (
    <div
      className={styles.diagram}
      role={svg ? 'img' : undefined}
      aria-label={svg ? (description ?? 'Mermaid 图表') : undefined}
      aria-busy={!svg}
    >
      {svg ? (
        <div dangerouslySetInnerHTML={{__html: svg}} />
      ) : (
        <span className={styles.loading} role="status">正在加载流程图…</span>
      )}
    </div>
  );
}
