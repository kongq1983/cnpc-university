import fs from 'node:fs';
import path from 'node:path';

const repositoryPath = path.resolve(process.cwd(), '..');
const roots = ['process', 'project-scaffold'];
const errors = [];

const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(filePath);
      continue;
    }

    if (!/\.(md|mdx)$/.test(entry.name)) {
      continue;
    }

    const source = fs.readFileSync(filePath, 'utf8');
    let inFence = false;
    let h1Count = 0;

    for (const line of source.split(/\r?\n/)) {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (!inFence && /^# /.test(line)) {
        h1Count += 1;
      }
    }

    if (h1Count > 1) {
      errors.push(`${path.relative(repositoryPath, filePath)} 包含多个一级标题。`);
    }

    const relativePath = path.relative(repositoryPath, filePath).replaceAll('\\', '/');
    if (relativePath.startsWith('process/') && /\]\(\/(?:skills|rules)(?:\/|\))/.test(source)) {
      errors.push(`${relativePath} 包含未适配 base URL 的根路径链接。`);
    }
  }
};

for (const root of roots) {
  walk(path.join(repositoryPath, root));
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('文档检查通过。');
}
