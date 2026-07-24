import { describe, it, expect, beforeAll } from 'vitest';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate } from './sync-tokens.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));

describe('generate', () => {
  let outDir;
  let firstRun;

  // configPath указывает на тестовый tests/fixtures/mode-selectors.sample.json,
  // а не на боевой scripts/mode-selectors.json — см. пояснение в
  // scripts/lib/to-css.test.mjs. Боевой конфиг живёт своей жизнью вместе
  // с настоящей дизайн-системой и не обязан описывать то, что есть в
  // маленькой тестовой фикстуре.
  beforeAll(() => {
    outDir = mkdtempSync(join(tmpdir(), 'tokens-'));
    firstRun = generate({
      exportPath: join(here, '..', 'tests', 'fixtures', 'figma-export.sample.json'),
      configPath: join(here, '..', 'tests', 'fixtures', 'mode-selectors.sample.json'),
      outDir
    });
  });

  it('пишет четыре слоя, типы и карту', () => {
    expect(readdirSync(outDir).sort()).toEqual([
      'palette.css',
      'scale.css',
      'state.css',
      'theme.css',
      'tokens.map.json',
      'tokens.ts'
    ]);
  });

  it('сохраняет ссылки между слоями', () => {
    const theme = readFileSync(join(outDir, 'theme.css'), 'utf8');
    expect(theme).toContain('var(--palette-blue-default)');
  });

  it('возвращаемый список описывает все шесть файлов', () => {
    expect(firstRun).toHaveLength(6);
    const names = firstRun.map((f) => f.path.split('/').pop()).sort();
    expect(names).toEqual([
      'palette.css',
      'scale.css',
      'state.css',
      'theme.css',
      'tokens.map.json',
      'tokens.ts'
    ]);
  });

  it('повторный вызов на неизменившихся данных сообщает, что файлы не изменились', () => {
    const secondRun = generate({
      exportPath: join(here, '..', 'tests', 'fixtures', 'figma-export.sample.json'),
      configPath: join(here, '..', 'tests', 'fixtures', 'mode-selectors.sample.json'),
      outDir
    });

    expect(secondRun).toHaveLength(6);
    for (const file of secondRun) {
      expect(file.changed).toBe(false);
      expect(file.isNew).toBe(false);
    }
  });
});
