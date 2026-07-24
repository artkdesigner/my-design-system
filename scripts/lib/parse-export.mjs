import { toCssVarName } from './naming.mjs';

/**
 * Превращает выгрузку плагина в модель, пригодную для генерации:
 * коллекция → режимы → токены, где токен либо несёт значение,
 * либо ссылается на другую переменную по её имени CSS.
 *
 * Ссылки НЕ разворачиваются до конечного значения. Если развернуть цепочку
 * alias'ов на этом шаге, значение зафиксируется на момент генерации модели,
 * и переключение темы/состояния в рантайме (смена CSS-блока по data-атрибуту)
 * перестанет работать — палитра рассыплется на копии. Не «оптимизируйте» это.
 * `resolvedType` из выгрузки отброшен намеренно: различение value/ref и типов
 * значений ниже по конвейеру идёт через typeof результата, а не через это
 * поле Figma. `textStyles` и `stats` в модель осознанно не переносятся — они
 * не нужны для генерации CSS и типов.
 */
export function parseExport(raw) {
  if (!raw || !Array.isArray(raw.collections)) {
    throw new Error(
      'Это не похоже на выгрузку плагина: в переданном объекте нет раздела collections.'
    );
  }

  // Нарушения копятся в один список за весь проход и бросаются одной
  // ошибкой в конце — см. formatViolations. Порядок списка зависит только
  // от порядка коллекций/переменных/режимов в самой выгрузке (обычные
  // массивы и Map, сохраняющие порядок вставки), поэтому повторный запуск
  // на тех же данных даёт тот же текст.
  const violations = [];

  const nameById = new Map();
  const figmaNameByCssVar = new Map();

  for (const collection of raw.collections) {
    for (const variable of collection.variables) {
      const cssVar = toCssVarName(variable.name);
      nameById.set(variable.id, cssVar);

      const clashGroup = figmaNameByCssVar.get(cssVar) ?? [];
      clashGroup.push({ figmaName: variable.name, collectionName: collection.name });
      figmaNameByCssVar.set(cssVar, clashGroup);
    }
  }

  for (const [cssVar, group] of figmaNameByCssVar) {
    if (group.length > 1) {
      violations.push(formatClashViolation(cssVar, group));
    }
  }

  const collections = raw.collections.map((collection) => ({
    name: collection.name,
    modes: collection.modes.map((mode) => ({
      name: mode.name,
      isDefault: mode.modeId === collection.defaultModeId,
      tokens: collection.variables
        .map((variable) => toToken(variable, mode, collection, nameById, violations))
        .filter((token) => token !== null)
    }))
  }));

  if (violations.length > 0) {
    throw new Error(formatViolations(violations));
  }

  return { fileName: raw.fileName, exportedAt: raw.exportedAt, collections };
}

function toToken(variable, mode, collection, nameById, violations) {
  const entry = variable.valuesByMode[mode.modeId];
  const cssVar = nameById.get(variable.id);

  if (!hasUsableValue(entry)) {
    violations.push(formatMissingValueViolation(variable, mode, collection));
    return null;
  }

  if (entry.type === 'ALIAS') {
    const ref = nameById.get(entry.id);
    if (!ref) {
      violations.push(formatDanglingRefViolation(variable, mode, collection, entry.id));
      return null;
    }
    return { cssVar, figmaName: variable.name, ref };
  }

  return { cssVar, figmaName: variable.name, value: entry.value };
}

// В Figma переменная обязана иметь значение во всех режимах своей
// коллекции — это таблица, а не разреженный набор. Сюда же относится
// вырожденная запись вида {"type":"VALUE"} без поля value: она формально
// присутствует в valuesByMode, но не несёт ни значения, ни ссылки, и без
// этой проверки в CSS попало бы буквально "undefined".
function hasUsableValue(entry) {
  if (entry === undefined) return false;
  if (entry.type === 'ALIAS') return entry.id !== undefined;
  return entry.value !== undefined;
}

function formatClashViolation(cssVar, group) {
  const count = group.length === 2 ? 'двух' : String(group.length);
  const lines = group.map((g) => `  «${g.figmaName}» (${g.collectionName})`).join('\n');
  return (
    `Имя ${cssVar} получается сразу из ${count} переменных:\n${lines}\n` +
    `Правило перевода имён схлопывает повторяющиеся слова пути (scripts/lib/naming.mjs), ` +
    `поэтому разные имена в Figma могут дать одно имя CSS. Переименуйте одну из них.`
  );
}

function formatMissingValueViolation(variable, mode, collection) {
  return (
    `У переменной «${variable.name}» нет значения в режиме «${mode.name}» коллекции «${collection.name}».\n` +
    `В Figma каждая переменная обязана иметь значение во всех режимах своей коллекции — ` +
    `откройте переменную и задайте его.`
  );
}

function formatDanglingRefViolation(variable, mode, collection, aliasId) {
  return (
    `Переменная «${variable.name}» (${collection.name}, режим ${mode.name}) ссылается на ${aliasId}, ` +
    `которого нет в выгрузке. Обычно это переменная из подключённой библиотеки или ` +
    `удалённая переменная. Список таких id плагин кладёт в stats.danglingAliasIds — ` +
    `проверьте его в figma-export.json и почините ссылку в Figma.`
  );
}

function formatViolations(violations) {
  const header =
    violations.length === 1
      ? 'Выгрузка Figma не прошла проверку: найдено 1 нарушение.'
      : `Выгрузка Figma не прошла проверку: найдено нарушений: ${violations.length}.`;
  return [header, ...violations.map((v, i) => `${i + 1}) ${v}`)].join('\n\n');
}
