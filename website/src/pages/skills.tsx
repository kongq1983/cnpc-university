import {useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useGlobalData from '@docusaurus/useGlobalData';

import ContentGuide from '../components/ContentGuide';
import {skillCategories} from '../skill-categories';
import {skillTags} from '../skill-tags';
import styles from './skills.module.css';

type SkillMetadata = {
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

type SkillsPluginData = {
  skills: SkillMetadata[];
};

export default function Skills(): ReactNode {
  const globalData = useGlobalData();
  const pluginData = globalData['repository-content']?.default as SkillsPluginData | undefined;
  const skills = pluginData?.skills ?? [];
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const filteredSkills = selectedTag === null
    ? skills
    : skills.filter((skill) => skill.tags.includes(selectedTag));
  const filteredSkillsByDirectory = new Map(filteredSkills.map((skill) => [skill.directory, skill]));
  const tagCounts = new Map(skillTags.map((tag) => [tag, skills.filter((skill) => skill.tags.includes(tag)).length]));

  const toggleTag = (tag: string) => {
    setSelectedTag((current) => current === tag ? null : tag);
  };
  const visibleCategories = skillCategories
    .map((category) => ({
      ...category,
      skills: category.skills.filter((directory) => filteredSkillsByDirectory.has(directory)),
    }))
    .filter((category) => category.skills.length > 0);

  return (
    <Layout title="技能手册" description="当前技能清单与标签">
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.kicker}>SKILLS</p>
          <h1>技能手册</h1>
          <p>按当前任务选择 AI 技能；技能名称、说明与正文始终以工作区中的 SKILL.md 为准。</p>
        </header>
        <div className={styles.contentLayout}>
          <aside className={styles.categoryMenu} aria-label="技能分类菜单">
            <h2>技能分类</h2>
            <nav>
              {visibleCategories.map(({id, label, skills: directories}) => (
                <a href={'#' + id} key={id}>{label}<span>{directories.length}</span></a>
              ))}
            </nav>
          </aside>
          <div className={styles.contentColumn}>
        <section className={styles.tagFilter} aria-label="技能标签筛选">
          <div className={styles.tagFilterHeader}>
            <h2>按标签筛选</h2>
            <span>{filteredSkills.length} 个技能</span>
          </div>
          <div className={styles.tagList}>
            {skillTags.map((tag) => {
              const selected = selectedTag === tag;
              return (
                <button
                  className={[styles.tag, selected && styles.tagSelected].filter(Boolean).join(' ')}
                  type="button"
                  aria-pressed={selected}
                  key={tag}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}<span>{tagCounts.get(tag)}</span>
                </button>
              );
            })}
          </div>
          {selectedTag !== null && (
            <button className={styles.clearTags} type="button" onClick={() => setSelectedTag(null)}>
              清除标签
            </button>
          )}
        </section>
        {filteredSkills.length === 0 && (
          <div className={styles.emptyState}>
            <p>没有匹配的技能。</p>
            <button className={styles.clearTags} type="button" onClick={() => setSelectedTag(null)}>清除标签</button>
          </div>
        )}
        {visibleCategories.map(({id, label, skills: directories}) => (
          <section className={styles.category} id={id} key={id} aria-label={label}>
            <h2>
              {label}
              <span className={styles.categoryCount}>
                {directories.length}
              </span>
            </h2>
            <div className={styles.grid}>
              {directories.flatMap((directory) => {
                const skill = filteredSkillsByDirectory.get(directory);
                return skill ? [skill] : [];
              }).map((skill) => (
                <article className={styles.card} key={skill.directory}>
                  <Link className={styles.cardMain} to={`/skills/${skill.directory}/SKILL`}>
                    <h3 title={skill.name}>{skill.name}</h3>
                    <p title={skill.description}>{skill.description}</p>
                    <div className={styles.cardTags} aria-label="技能标签">
                      {skill.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <span aria-hidden="true">查看技能 →</span>
                  </Link>
                  <dl className={styles.metadata}>
                    <div>
                      <dt>依赖技能</dt>
                      <dd title={skill.dependencies.length > 0 ? skill.dependencies.join("、") : "无"}>
                        {skill.dependencies.length > 0 ? skill.dependencies.join("、") : "无"}
                      </dd>
                    </div>
                    <div>
                      <dt>作者</dt>
                      <dd title={skill.author}>{skill.author}</dd>
                    </div>
                    <div>
                      <dt>来源</dt>
                      <dd>
                        {skill.source.url ? (
                          <a href={skill.source.url} target="_blank" rel="noreferrer" title={skill.source.label}>{skill.source.label}</a>
                        ) : <span title={skill.source.label}>{skill.source.label}</span>}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
