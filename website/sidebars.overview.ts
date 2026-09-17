import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  overviewSidebar: [
    {type: 'doc', id: 'README', label: '仓库定位'},
    {type: 'doc', id: 'AGENTS', label: '本库维护指令'},
    {type: 'link', label: '路线图', href: '/roadmap'},
  ],
};

export default sidebars;
