import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const SKILLS_DIR = path.join(process.cwd(), '.agents', 'skills');
const REQUIRED_FRONTMATTER_FIELDS = ['name', 'description'];

const errors = [];

async function findSkillFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findSkillFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name === 'SKILL.md') {
      files.push(entryPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function parseFrontmatter(filePath, rawText) {
  const text = rawText.replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/);
  const relativePath = path.relative(process.cwd(), filePath);

  if (lines[0] !== '---') {
    errors.push(`${relativePath}: missing YAML frontmatter delimited by ---`);
    return null;
  }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line === '---');

  if (closingIndex === -1) {
    errors.push(`${relativePath}: missing closing YAML frontmatter delimiter ---`);
    return null;
  }

  const frontmatterLines = lines.slice(1, closingIndex);
  const body = lines.slice(closingIndex + 1).join('\n').trim();

  if (frontmatterLines.every((line) => line.trim() === '')) {
    errors.push(`${relativePath}: YAML frontmatter is empty`);
  }

  if (body.length === 0) {
    errors.push(`${relativePath}: missing Markdown instructions after YAML frontmatter`);
  }

  return { frontmatterLines, relativePath };
}

function takeWhile(values, predicate) {
  const result = [];

  for (const value of values) {
    if (!predicate(value)) {
      break;
    }

    result.push(value);
  }

  return result;
}

function readTopLevelField(frontmatterLines, fieldName) {
  const fieldPrefix = `${fieldName}:`;
  const fieldIndex = frontmatterLines.findIndex((line) => line.startsWith(fieldPrefix));

  if (fieldIndex === -1) {
    return null;
  }

  const rawValue = frontmatterLines[fieldIndex].slice(fieldPrefix.length).trim();

  if (
    rawValue === '>' ||
    rawValue === '>-' ||
    rawValue === '|' ||
    rawValue === '|-'
  ) {
    return takeWhile(frontmatterLines.slice(fieldIndex + 1), (line) =>
      line.trim() === '' || line.startsWith(' '),
    )
      .map((line) => line.trim())
      .join(' ')
      .trim();
  }

  return rawValue.replace(/^['"]|['"]$/g, '').trim();
}

function lintSkillFile(filePath, rawText) {
  const parsed = parseFrontmatter(filePath, rawText);

  if (parsed === null) {
    return;
  }

  const { frontmatterLines, relativePath } = parsed;

  for (const fieldName of REQUIRED_FRONTMATTER_FIELDS) {
    const value = readTopLevelField(frontmatterLines, fieldName);

    if (value === null) {
      errors.push(`${relativePath}: missing required frontmatter field "${fieldName}"`);
      continue;
    }

    if (value.length === 0) {
      errors.push(`${relativePath}: required frontmatter field "${fieldName}" is empty`);
    }
  }

  const expectedName = path.basename(path.dirname(filePath));
  const actualName = readTopLevelField(frontmatterLines, 'name');

  if (actualName !== null && actualName !== '' && actualName !== expectedName) {
    errors.push(
      `${relativePath}: frontmatter name "${actualName}" must match skill folder "${expectedName}"`,
    );
  }
}

let skillFiles = [];

try {
  skillFiles = await findSkillFiles(SKILLS_DIR);
} catch (error) {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'ENOENT'
  ) {
    console.error(
      `Skill lint failed: missing skills directory "${path.relative(process.cwd(), SKILLS_DIR)}".`,
    );
    process.exit(1);
  }

  throw error;
}

if (skillFiles.length === 0) {
  console.error(
    `Skill lint failed: no SKILL.md files found in "${path.relative(process.cwd(), SKILLS_DIR)}".`,
  );
  process.exit(1);
}

for (const skillFile of skillFiles) {
  lintSkillFile(skillFile, await readFile(skillFile, 'utf8'));
}

if (errors.length > 0) {
  console.error('Skill lint failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Skill lint passed: ${skillFiles.length} skill file(s) checked.`);
