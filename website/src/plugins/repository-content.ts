import fs from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';
import type {LoadContext, Plugin} from '@docusaurus/types';

import {skillCategories} from '../skill-categories';
import {skillTags} from '../skill-tags';

export type SkillMetadata = {
  name: string;
  description: string;
  directory: string;
  dependencies: string[];
  tags: string[];
  author: string;
  source: {
    label: string;
    url?: string;
  };
};

type SkillSourceMetadata = Pick<SkillMetadata, 'name' | 'description' | 'directory'>;

export type RepositoryContent = {
  documentCounts: {
    rules: number;
  };
  skills: SkillMetadata[];
};

type RecordValue = Record<string, unknown>;

const isRecord = (value: unknown): value is RecordValue =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readSkillSources = async (skillsPath: string) => {
  const directories = await fs.readdir(skillsPath, {withFileTypes: true});
  const skills = await Promise.all(
    directories
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const directory = entry.name;
        const skillPath = path.join(skillsPath, directory, 'SKILL.md');

        try {
          const source = await fs.readFile(skillPath, 'utf8');
          const {data} = matter(source);
          return {
            name: typeof data.name === 'string' ? data.name : directory,
            description: typeof data.description === 'string' ? data.description : '',
            directory,
          };
        } catch {
          return null;
        }
      }),
  );

  return skills.filter((skill): skill is NonNullable<typeof skill> => skill !== null);
};

const readSkillMetadata = async (
  metadataPath: string,
  skills: SkillSourceMetadata[],
): Promise<SkillMetadata[]> => {
  const source = await fs.readFile(metadataPath, 'utf8');
  const {data} = matter('---\n' + source + '\n---');

  if (!isRecord(data) || !isRecord(data.skills)) {
    throw new Error('技能元数据格式无效：' + metadataPath + ' 必须包含 skills 对象。');
  }

  const metadataEntries = data.skills;

  const sourceDirectories = new Set(skills.map((skill) => skill.directory));
  const metadataDirectories = new Set(Object.keys(metadataEntries));
  const missing = [...sourceDirectories].filter((directory) => !metadataDirectories.has(directory));
  const stale = [...metadataDirectories].filter((directory) => !sourceDirectories.has(directory));

  if (missing.length > 0 || stale.length > 0) {
    throw new Error(
      '技能元数据与源文件不一致。缺少元数据：' + (missing.join(', ') || '无') +
      '；无对应源文件：' + (stale.join(', ') || '无'),
    );
  }

  return skills
    .map((skill) => {
      const entry = metadataEntries[skill.directory];
      if (!isRecord(entry)) {
        throw new Error('技能元数据无效：' + skill.directory + ' 必须是对象。');
      }

      const dependencies = entry.dependencies ?? [];
      const tags = entry.tags;
      const author = entry.author;
      const sourceInfo = entry.source;

      if (entry.usage !== undefined) {
        throw new Error('技能元数据无效：' + skill.directory + ' 不再支持 .usage，请改用 .tags。');
      }

      if (!Array.isArray(dependencies) || !dependencies.every((item) => typeof item === 'string')) {
        throw new Error('技能元数据无效：' + skill.directory + '.dependencies 必须是字符串数组。');
      }
      if (!Array.isArray(tags) || !tags.every((item) => typeof item === 'string')) {
        throw new Error('技能元数据无效：' + skill.directory + '.tags 必须是字符串数组。');
      }
      if (tags.some((tag) => tag.trim() === '')) {
        throw new Error('技能元数据无效：' + skill.directory + '.tags 不得包含空字符串。');
      }
      if (new Set(tags).size !== tags.length) {
        throw new Error('技能元数据无效：' + skill.directory + '.tags 不得包含重复标签。');
      }
      if (tags.some((tag) => !skillTags.includes(tag as (typeof skillTags)[number]))) {
        throw new Error('技能元数据无效：' + skill.directory + '.tags 包含未定义标签。');
      }
      if (typeof author !== 'string' || author.trim() === '') {
        throw new Error('技能元数据无效：' + skill.directory + '.author 必须是非空字符串。');
      }
      if (!isRecord(sourceInfo) || typeof sourceInfo.label !== 'string' || sourceInfo.label.trim() === '') {
        throw new Error('技能元数据无效：' + skill.directory + '.source.label 必须是非空字符串。');
      }
      if (sourceInfo.url !== undefined && typeof sourceInfo.url !== 'string') {
        throw new Error('技能元数据无效：' + skill.directory + '.source.url 必须是字符串。');
      }
      return {
        ...skill,
        dependencies,
        tags,
        author,
        source: {
          label: sourceInfo.label,
          ...(sourceInfo.url === undefined ? {} : {url: sourceInfo.url}),
        },
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
};

const assertSkillCategoriesCoverSource = (skills: SkillSourceMetadata[]) => {
  const sourceDirectories = new Set(skills.map((skill) => skill.directory));
  const categorizedDirectories = new Set(skillCategories.flatMap((category) => category.skills));
  const missing = [...sourceDirectories].filter((directory) => !categorizedDirectories.has(directory));
  const stale = [...categorizedDirectories].filter((directory) => !sourceDirectories.has(directory));

  if (missing.length > 0 || stale.length > 0) {
    throw new Error(
      `技能分类与源文件不一致。缺少分类：${missing.join(', ') || '无'}；无对应源文件：${stale.join(', ') || '无'}`,
    );
  }
};

export default function repositoryContentPlugin(context: LoadContext): Plugin {
  const repositoryPath = path.resolve(context.siteDir, '..');
  const skillsPath = path.join(repositoryPath, 'project-scaffold', '.agents', 'skills');
  const rulesPath = path.join(repositoryPath, 'project-scaffold', 'docs', 'rules');
  const skillMetadataPath = path.join(context.siteDir, 'skill-metadata.yml');

  return {
    name: 'repository-content',
    async loadContent() {
      const [skillSources, ruleFiles] = await Promise.all([
        readSkillSources(skillsPath),
        fs.readdir(rulesPath, {withFileTypes: true}),
      ]);

      assertSkillCategoriesCoverSource(skillSources);
      const skills = await readSkillMetadata(skillMetadataPath, skillSources);
      const rulesCount = ruleFiles.filter(
        (entry) => entry.isFile() && entry.name.endsWith('.md'),
      ).length;

      return {
        documentCounts: {rules: rulesCount},
        skills,
      };
    },
    contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },
    getPathsToWatch() {
      return [skillsPath, rulesPath, skillMetadataPath];
    },
  };
}
