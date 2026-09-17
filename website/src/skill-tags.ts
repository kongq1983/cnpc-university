export const skillTags = [
  '需求澄清',
  '规划设计',
  '规格定义',
  '行为测试',
  '实现开发',
  '问题诊断',
  '架构重构',
  '数据库文档',
  '界面设计',
  '技能工程',
] as const;

export type SkillTag = (typeof skillTags)[number];
