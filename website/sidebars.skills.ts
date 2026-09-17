import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

import {skillCategories} from './src/skill-categories';

const skillsPath = path.resolve(__dirname, '..', 'project-scaffold', '.agents', 'skills');
const skillNames = new Map(
  fs
    .readdirSync(skillsPath, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const directory = entry.name;
      const source = fs.readFileSync(path.join(skillsPath, directory, 'SKILL.md'), 'utf8');
      const {data} = matter(source);
      return [directory, typeof data.name === 'string' ? data.name : directory] as const;
    }),
);

const sidebars: SidebarsConfig = {
  skillsSidebar: skillCategories.map(({label, skills}) => ({
    type: 'category' as const,
    label,
    items: skills.map((directory) => ({
      type: 'doc' as const,
      id: `project-scaffold/.agents/skills/${directory}/SKILL`,
      label: skillNames.get(directory) ?? directory,
    })),
  })),
};

export default sidebars;
