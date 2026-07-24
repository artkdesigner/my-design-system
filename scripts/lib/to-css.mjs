// Список угадывает безразмерные переменные по префиксу имени CSS.
// ВНИМАНИЕ: межстрочный интервал в Figma часто хранится числом в смысле
// процентов (140 означает 140%), а в CSS `line-height: 140` без единицы
// означает 140 крат — это совсем другое значение. На фикстурах такого
// случая нет, поэтому здесь список не проверен на настоящих данных.
// Отдельно перепроверить на задаче 8, когда появится первая настоящая
// выгрузка из Figma с реальными именами переменных line-height.
const UNITLESS = new Set(['--font-weight', '--line-height', '--opacity', '--z-index']);

/**
 * Превращает модель в набор файлов CSS: по файлу на слой,
 * внутри — по блоку на режим коллекции.
 *
 * Несколько коллекций могут указывать на один слой (например,
 * ComponentSize и Typography обе пишут в scale.css) — их блоки
 * дописываются друг за другом в порядке коллекций модели, а не
 * перезаписывают файл слоя.
 */
export function toCss(model, config) {
  // layer -> { sources: string[], parts: string[] }
  const layers = new Map();

  const ordered = [...model.collections].sort(
    (a, b) => (config[a.name]?.order ?? 0) - (config[b.name]?.order ?? 0)
  );

  for (const collection of ordered) {
    const rules = config[collection.name];
    if (!rules) {
      throw new Error(
        `Коллекция «${collection.name}» отсутствует в scripts/mode-selectors.json. ` +
          `Добавьте её со слоем и селекторами режимов.`
      );
    }

    const blocks = [];

    for (const mode of collection.modes) {
      const selectors = rules.modes[mode.name];
      if (!selectors) {
        throw new Error(
          `Режим «${mode.name}» коллекции «${collection.name}» отсутствует ` +
            `в scripts/mode-selectors.json.`
        );
      }
      if (mode.tokens.length === 0) continue;

      const declarations = mode.tokens
        .map((token) => `  ${token.cssVar}: ${renderValue(token)};`)
        .join('\n');

      blocks.push(`${selectors.join(',\n')} {\n${declarations}\n}`);
    }

    let entry = layers.get(rules.layer);
    if (!entry) {
      entry = { sources: [], parts: [] };
      layers.set(rules.layer, entry);
    }
    entry.sources.push(collection.name);
    if (blocks.length > 0) {
      entry.parts.push(blocks.join('\n\n'));
    }
  }

  const files = {};
  for (const [layer, entry] of layers) {
    const header =
      `/* Слой: ${layer}. Источник: коллекци${entry.sources.length > 1 ? 'и' : 'я'} ` +
      `${entry.sources.join(', ')} в Figma.\n` +
      `   Файл генерируется скриптом sync-tokens — правки руками будут стёрты. */\n\n`;

    files[`${layer}.css`] = header + entry.parts.join('\n\n') + '\n';
  }

  return files;
}

function renderValue(token) {
  if (token.ref) return `var(${token.ref})`;
  if (typeof token.value === 'number') {
    const unitless = [...UNITLESS].some((prefix) => token.cssVar.startsWith(prefix));
    return unitless ? String(token.value) : `${token.value}px`;
  }
  return String(token.value);
}
