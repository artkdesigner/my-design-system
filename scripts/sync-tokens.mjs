import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseExport } from './lib/parse-export.mjs';
import { toCss } from './lib/to-css.mjs';
import { toTs, toMap } from './lib/to-ts.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Читает выгрузку и конфиг, строит модель и пишет шесть файлов
 * (четыре слоя CSS, tokens.ts, tokens.map.json) в outDir.
 *
 * Возвращает список описаний каждого записанного файла: путь,
 * изменился ли он по сравнению с тем, что уже лежало на диске,
 * и был ли он новым. Используется и для отчёта в консоли, и тестами.
 *
 * `overridesPath` — необязательный путь к scripts/name-overrides.json
 * (ручные переопределения имён CSS для разведения коллизий, см. пояснение
 * в этом файле). Если путь не передан или файла нет на диске — работаем
 * без переопределений, это не ошибка: файл заводится только когда реальная
 * выгрузка Figma даёт коллизию имён.
 */
export function generate({ exportPath, configPath, outDir, overridesPath }) {
  const raw = readExport(exportPath);
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  const nameOverrides = readOverrides(overridesPath);

  const model = parseExport(raw, { nameOverrides });
  const files = toCss(model, config);

  mkdirSync(outDir, { recursive: true });

  const written = [];
  for (const [name, contents] of Object.entries(files)) {
    written.push(write(join(outDir, name), contents));
  }
  written.push(write(join(outDir, 'tokens.ts'), toTs(model)));
  written.push(write(join(outDir, 'tokens.map.json'), JSON.stringify(toMap(model), null, 2) + '\n'));

  written.tokenCount = countTokens(model);

  return written;
}

function readExport(exportPath) {
  if (!existsSync(exportPath)) {
    throw new Error(
      `Не найдена выгрузка Figma: ${exportPath}\n\n` +
        'Этот файл создаёт плагин figma-plugin — сам скрипт его не генерирует.\n' +
        'Порядок такой:\n' +
        '  1) откройте файл дизайн-системы в Figma;\n' +
        '  2) запустите плагин figma-plugin (Plugins → Development → figma-plugin);\n' +
        '  3) плагин скачает figma-export.json — положите его в корень проекта ' +
        `(${root});\n` +
        '  4) повторно выполните `npm run sync-tokens`.'
    );
  }

  try {
    return JSON.parse(readFileSync(exportPath, 'utf8'));
  } catch (e) {
    throw new Error(
      `Не удалось разобрать ${exportPath} как JSON: ${e.message}\n` +
        'Файл повреждён или скачан не до конца — выгрузите его из плагина заново.'
    );
  }
}

function readOverrides(overridesPath) {
  if (!overridesPath || !existsSync(overridesPath)) {
    return {};
  }
  return JSON.parse(readFileSync(overridesPath, 'utf8'));
}

function countTokens(model) {
  return model.collections.reduce(
    (sum, collection) =>
      sum + collection.modes.reduce((modeSum, mode) => modeSum + mode.tokens.length, 0),
    0
  );
}

function write(path, contents) {
  const before = existsSync(path) ? readFileSync(path, 'utf8') : null;
  writeFileSync(path, contents);
  return { path, changed: before !== contents, isNew: before === null };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const written = generate({
      exportPath: join(root, 'figma-export.json'),
      configPath: join(root, 'scripts', 'mode-selectors.json'),
      outDir: join(root, 'ds', 'src', 'tokens'),
      overridesPath: join(root, 'scripts', 'name-overrides.json')
    });

    for (const file of written) {
      const mark = file.isNew ? 'новый' : file.changed ? 'изменён' : 'без изменений';
      console.log(`  ${mark.padEnd(14)} ${relative(root, file.path)}`);
    }

    const changedCount = written.filter((f) => f.changed || f.isNew).length;
    console.log(
      `\nГотово: токенов сгенерировано ${written.tokenCount}, ` +
        `файлов изменилось ${changedCount} из ${written.length}.`
    );
  } catch (e) {
    // Все ошибки конвейера (нет выгрузки, битый JSON, нарушения parseExport,
    // отсутствие коллекции/режима в mode-selectors.json) уже несут готовый
    // для человека текст в message — здесь просто печатаем его без стека.
    console.error(e && e.message ? e.message : String(e));
    process.exitCode = 1;
  }
}
