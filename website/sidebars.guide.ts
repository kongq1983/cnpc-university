import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

import overviewSidebars from './sidebars.overview';
import processSidebars from './sidebars.process';
import templatesSidebars from './sidebars.templates';
import skillsSidebars from './sidebars.skills';

const sidebars: SidebarsConfig = {
  ...overviewSidebars,
  ...processSidebars,
  ...templatesSidebars,
  ...skillsSidebars,
};

export default sidebars;
