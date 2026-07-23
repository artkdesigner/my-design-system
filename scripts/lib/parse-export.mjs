import { toCssVarName } from './naming.mjs';

/**
 * Превращает выгрузку плагина в модель, пригодную для генерации:
 * коллекция → режимы → токены, где токен либо несёт значение,
 * либо ссылается на другую переменную по её имени CSS.
 */
export function parseExport(raw) {
  const nameById = new Map();
  const seen = new Map();

  for (const collection of raw.collections) {
    for (const variable of collection.variables) {
      const cssVar = toCssVarName(variable.name);
      if (seen.has(cssVar)) {
        throw new Error(
          `Имя ${cssVar} получено сразу из двух переменных: ` +
            `«${seen.get(cssVar)}» и «${variable.name}». Правило перевода имён даёт совпадение.`
        );
      }
      seen.set(cssVar, variable.name);
      nameById.set(variable.id, cssVar);
    }
  }

  const collections = raw.collections.map((collection) => ({
    name: collection.name,
    modes: collection.modes.map((mode) => ({
      name: mode.name,
      isDefault: mode.modeId === collection.defaultModeId,
      tokens: collection.variables
        .filter((variable) => variable.valuesByMode[mode.modeId] !== undefined)
        .map((variable) => toToken(variable, mode.modeId, nameById))
    }))
  }));

  return { fileName: raw.fileName, exportedAt: raw.exportedAt, collections };
}

function toToken(variable, modeId, nameById) {
  const cssVar = toCssVarName(variable.name);
  const entry = variable.valuesByMode[modeId];

  if (entry.type === 'ALIAS') {
    const ref = nameById.get(entry.id);
    if (!ref) {
      throw new Error(
        `Переменная «${variable.name}» ссылается на ${entry.id}, которого нет в выгрузке.`
      );
    }
    return { cssVar, figmaName: variable.name, ref };
  }

  return { cssVar, figmaName: variable.name, value: entry.value };
}
