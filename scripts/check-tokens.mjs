import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseExport } from './lib/parse-export.mjs';
import { toCss } from './lib/to-css.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Сравнивает два плоских набора «токен → значение» — то, что лежит
 * в сгенерированных файлах ds/src/tokens, с тем, что даёт свежая
 * генерация прямо из figma-export.json. Расхождение означает, что
 * кто-то поправил токен руками в коде либо забыл прогнать sync-tokens
 * после последней выгрузки.
 */
export function diffTokens(inCode, inFigma) {
  const names = [...new Set([...Object.keys(inCode), ...Object.keys(inFigma)])].sort();
  const drift = [];

  for (const token of names) {
    const a = inCode[token];
    const b = inFigma[token];
    if (a === b) continue;
    const kind = a === undefined ? 'добавлен' : b === undefined ? 'удалён' : 'изменился';
    drift.push({ token, inCode: a, inFigma: b, kind });
  }

  return drift;
}

/**
 * Вытаскивает объявления вида «--имя: значение;» из текста CSS. Один и тот
 * же токен может быть переизлучён (см. computeReemission в to-css.mjs) —
 * текст объявления в этих местах побайтово совпадает с исходным, поэтому
 * взять последнее вхождение так же верно, как любое другое.
 */
export function readDeclarations(css) {
  const found = {};
  for (const match of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    found[match[1]] = match[2].trim();
  }
  return found;
}

function readTokensDir(tokensDir) {
  const inCode = {};
  for (const file of readdirSync(tokensDir).filter((f) => f.endsWith('.css'))) {
    Object.assign(inCode, readDeclarations(readFileSync(join(tokensDir, file), 'utf8')));
  }
  return inCode;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const tokensDir = join(root, 'ds', 'src', 'tokens');
    const exportPath = join(root, 'figma-export.json');
    const configPath = join(root, 'scripts', 'mode-selectors.json');
    const overridesPath = join(root, 'scripts', 'name-overrides.json');

    if (!existsSync(exportPath)) {
      throw new Error(
        `Не найдена выгрузка Figma: ${relative(root, exportPath)}\n` +
          'Сверять код не с чем — сначала выгрузите переменные плагином и положите файл в корень.'
      );
    }

    const inCode = readTokensDir(tokensDir);

    const raw = JSON.parse(readFileSync(exportPath, 'utf8'));
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    const nameOverrides = existsSync(overridesPath)
      ? JSON.parse(readFileSync(overridesPath, 'utf8'))
      : {};

    const fresh = toCss(parseExport(raw, { nameOverrides }), config);

    const inFigma = {};
    for (const css of Object.values(fresh)) Object.assign(inFigma, readDeclarations(css));

    const drift = diffTokens(inCode, inFigma);

    if (drift.length === 0) {
      console.log('Расхождений нет: код совпадает с выгрузкой Figma.');
      process.exit(0);
    }

    console.log(`Расхождений: ${drift.length}\n`);
    for (const item of drift) {
      console.log(`  ${item.kind.padEnd(10)} ${item.token}`);
      console.log(`             в коде:  ${item.inCode ?? '—'}`);
      console.log(`             в Figma: ${item.inFigma ?? '—'}\n`);
    }
    console.log('Токены в коде правятся только через `npm run sync-tokens` на свежей выгрузке.');
    process.exitCode = 1;
  } catch (e) {
    console.error(e && e.message ? e.message : String(e));
    process.exitCode = 1;
  }
}
