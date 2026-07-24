// Список угадывает безразмерные переменные по префиксу имени CSS.
// ВНИМАНИЕ: межстрочный интервал в Figma часто хранится числом в смысле
// процентов (140 означает 140%), а в CSS `line-height: 140` без единицы
// означает 140 крат — это совсем другое значение. Поэтому для
// --line-height-* значение вне правдоподобного диапазона кратности
// (0.5–3) роняет генератор — см. assertLineHeightIsRatio ниже.
//
// --letter-spacing в UNITLESS сознательно НЕ входит: там как раз нужны
// единицы (px). Но по той же причине, что и с line-height, в Figma это
// поле тоже нередко хранится в процентах — на настоящей выгрузке (задача 8)
// нужно отдельно проверить, не подставляется ли туда px там, где нужен %.
//
// --font-weight в этом списке относится только к ЧИСЛОВЫМ значениям
// (вес уже задан числом). На реальных данных начертания чаще приходят
// строками («Medium», «Bold») — такие значения в этот список не попадают,
// они переводятся в числа через FONT_WEIGHT_NAMES ниже, до всякого UNITLESS.
// Значения-стили («Italic», «Oblique») — тоже строки, но не веса вовсе:
// они выводятся как есть, строкой в нижнем регистре, см. FONT_STYLE_VALUES
// и resolveFontWeight ниже.
const UNITLESS = new Set(['--font-weight', '--line-height', '--opacity', '--z-index']);

// Известные имена начертаний Figma → числовой font-weight CSS. Названия
// сверяются без учёта регистра. Список закрытый: незнакомое имя обязано
// уронить генератор, а не превратиться в невалидное `font-weight: Medium`,
// которое браузер молча отбросит и начертание откатится к унаследованному.
const FONT_WEIGHT_NAMES = {
  thin: 100,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900
};

// ЛОВУШКА: в Figma группа «Font weight» хранит начертания в терминах Figma,
// а не в терминах CSS-свойств — и там в одном ряду с весами (Regular,
// Medium, Bold) лежат значения, которые на деле являются СТИЛЕМ шрифта, а
// не весом (Italic, Oblique). Это не огрех выгрузки, а то, как устроена
// сама дизайн-система в Figma. Токен всё равно называется на выходе
// «--font-weight-italic» (так через naming.mjs переводится путь переменной
// «Font weight/Italic»), но по смыслу значение годится только для
// CSS-свойства font-style, а не font-weight: `font-weight: italic`
// невалиден, браузер молча отбросит объявление, и начертание откатится
// к унаследованному. Потребляйте такой токен как
// `font-style: var(--font-weight-italic);`, а не в font-weight.
const FONT_STYLE_VALUES = new Set(['italic', 'oblique']);

/**
 * Превращает модель в набор файлов CSS: по файлу на слой,
 * внутри — по блоку на режим коллекции.
 *
 * Несколько коллекций могут указывать на один слой (например,
 * ComponentSize и Typography обе пишут в scale.css) — их блоки
 * дописываются друг за другом в порядке коллекций модели, а не
 * перезаписывают файл слоя. Порядок между коллекциями одного слоя
 * определяется полем order в конфиге (уникальным для каждой коллекции),
 * а не порядком коллекций в выгрузке Figma — так дифф не шумит от
 * перестановок в самой Figma.
 */
export function toCss(model, config) {
  validateConfig(config);

  // layer -> { sources: string[], parts: string[] }
  const layers = new Map();

  const ordered = [...model.collections].sort((a, b) => {
    const orderA = config[a.name]?.order ?? 0;
    const orderB = config[b.name]?.order ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    // Второй ключ — имя коллекции. При штатном конфиге order уникален
    // для зарегистрированных коллекций (см. validateConfig), так что эта
    // ветка на них не срабатывает; она страхует детерминированность для
    // коллекций, которых нет в конфиге вовсе (у них order падает на 0 и
    // без этого ключа порядок между ними зависел бы от Figma).
    return a.name.localeCompare(b.name);
  });

  for (const collection of ordered) {
    const rules = config[collection.name];
    if (!rules) {
      throw new Error(
        `Коллекция «${collection.name}» отсутствует в scripts/mode-selectors.json. ` +
          `Добавьте её со слоем и селекторами режимов.`
      );
    }

    for (const mode of collection.modes) {
      if (!rules.modes[mode.name]) {
        throw new Error(
          `Режим «${mode.name}» коллекции «${collection.name}» отсутствует ` +
            `в scripts/mode-selectors.json.`
        );
      }
    }

    const modesInOrder = sortRootFirst(collection.modes, rules, collection.name);

    const blocks = [];
    for (const mode of modesInOrder) {
      const selectors = rules.modes[mode.name];

      // Не мёртвый код: срабатывает не только на отдельных режимах, но и
      // целиком на коллекции без переменных (тогда tokens пуст у каждого
      // режима) — например, коллекцию завели в Figma, но переменные в неё
      // ещё не добавили. Такая коллекция обязана пройти проверки выше
      // (её имя и режимы всё равно должны быть в конфиге), но не должна
      // породить пустое CSS-правило `{}`.
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
      `/* Слой: ${layer}. Источник: ${describeSources(entry.sources)} в Figma.\n` +
      `   Файл генерируется скриптом sync-tokens — правки руками будут стёрты. */\n\n`;

    files[`${layer}.css`] = header + entry.parts.join('\n\n') + '\n';
  }

  return files;
}

// Режим, среди селекторов которого есть :root, обязан идти первым блоком
// в файле. Причина не в косметике: :root и, скажем, [data-theme="dark"]
// имеют одинаковую специфичность (0,1,0), и при применении обоих к одному
// элементу (<html data-theme="dark">) побеждает тот блок, что ниже в файле.
// Раньше порядок блоков совпадал с порядком режимов в самой выгрузке —
// то есть с порядком, в котором дизайнер перечислил режимы в Figma.
// Переставит дизайнер Dark выше Light в списке режимов — тёмная тема
// молча перестанет работать. Здесь порядок фиксируется: :root всегда
// первый, остальные — в исходном порядке относительно друг друга.
//
// Заодно (раз уж мы для этого ищем режим с :root) проверяется, что это
// тот же режим, который в Figma помечен умолчательным (isDefault). Кто
// главный режим коллекции задано дважды — флагом в Figma и селектором
// :root в конфиге, — и эти два источника истины обязаны совпадать.
// Разойдутся — упадём с понятным сообщением, а не подставим не тот блок
// первым молча.
function sortRootFirst(modes, rules, collectionName) {
  const rootModeNames = modes
    .filter((mode) => rules.modes[mode.name].includes(':root'))
    .map((mode) => mode.name);

  if (rootModeNames.length > 1) {
    throw new Error(
      `В scripts/mode-selectors.json коллекции «${collectionName}» несколько режимов ` +
        `претендуют на :root: ${rootModeNames.map((n) => `«${n}»`).join(', ')}. ` +
        `У :root должен быть ровно один режим.`
    );
  }

  if (rootModeNames.length === 0) {
    return modes;
  }

  const rootName = rootModeNames[0];
  const rootMode = modes.find((mode) => mode.name === rootName);

  if (!rootMode.isDefault) {
    const figmaDefault = modes.find((mode) => mode.isDefault);
    throw new Error(
      `В Figma умолчательный режим коллекции «${collectionName}» — «${figmaDefault?.name ?? '?'}», а :root в\n` +
        `scripts/mode-selectors.json стоит у режима «${rootName}». Приведите их в соответствие.`
    );
  }

  return [rootMode, ...modes.filter((mode) => mode.name !== rootName)];
}

// Проверяет scripts/mode-selectors.json до того, как он будет использован
// для генерации. Опечатка здесь иначе даёт не падение, а тихо неверный
// вывод (см. таблицу в ревью задачи 5): нет layer — файл называется
// undefined.css и слой исчезает молча; пустой modes у режима — правило
// без селектора, которое браузер просто выбрасывает. И то и другое хуже
// исключения, потому что не видно на глаз.
function validateConfig(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new Error('scripts/mode-selectors.json должен быть объектом коллекций.');
  }

  const orderOwners = new Map(); // order -> имя коллекции, для проверки уникальности

  for (const [name, rules] of Object.entries(config)) {
    if (!rules || typeof rules !== 'object' || Array.isArray(rules)) {
      throw new Error(`Запись «${name}» в scripts/mode-selectors.json должна быть объектом.`);
    }

    if (typeof rules.layer !== 'string' || rules.layer.trim() === '') {
      throw new Error(
        `У коллекции «${name}» в scripts/mode-selectors.json не задан layer (или он пустой). ` +
          `Без него неясно, в какой файл CSS писать её токены.`
      );
    }

    if (typeof rules.order !== 'number' || !Number.isFinite(rules.order)) {
      throw new Error(
        `У коллекции «${name}» в scripts/mode-selectors.json не задан числовой order. ` +
          `Без него порядок коллекции среди остальных не определён.`
      );
    }

    if (orderOwners.has(rules.order)) {
      throw new Error(
        `У коллекций «${orderOwners.get(rules.order)}» и «${name}» в scripts/mode-selectors.json ` +
          `совпадает order: ${rules.order}. Значение order обязано быть уникальным для каждой ` +
          `коллекции — иначе порядок их блоков внутри общего файла слоя определяется порядком ` +
          `коллекций в выгрузке Figma, а не конфигом.`
      );
    }
    orderOwners.set(rules.order, name);

    if (typeof rules.modes !== 'object' || rules.modes === null || Array.isArray(rules.modes)) {
      throw new Error(
        `У коллекции «${name}» в scripts/mode-selectors.json не задан объект modes с селекторами режимов.`
      );
    }

    for (const [modeName, selectors] of Object.entries(rules.modes)) {
      if (!Array.isArray(selectors) || selectors.length === 0) {
        throw new Error(
          `У режима «${modeName}» коллекции «${name}» в scripts/mode-selectors.json пустой или ` +
            `отсутствующий список селекторов. Без селектора правило CSS ни на что не сработает — ` +
            `браузер такой блок просто выбросит.`
        );
      }
      for (const selector of selectors) {
        if (typeof selector !== 'string' || selector.trim() === '') {
          throw new Error(
            `У режима «${modeName}» коллекции «${name}» в scripts/mode-selectors.json селектор ` +
              `должен быть непустой строкой (получено: ${JSON.stringify(selector)}).`
          );
        }
      }
    }
  }
}

function describeSources(sources) {
  if (sources.length === 1) {
    return `коллекция ${sources[0]}`;
  }
  return `${sources.length} ${pluralizeCollections(sources.length)} (${sources.join(', ')})`;
}

// Русское согласование числительного с «коллекция»: 1 — коллекция,
// 2–4 — коллекции, 5 и далее (а также 11–14) — коллекций.
function pluralizeCollections(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'коллекций';
  if (mod10 === 1) return 'коллекция';
  if (mod10 >= 2 && mod10 <= 4) return 'коллекции';
  return 'коллекций';
}

function renderValue(token) {
  if (token.ref) return `var(${token.ref})`;

  if (typeof token.value === 'string') {
    assertNoInjection(token);
    if (token.cssVar.startsWith('--font-weight')) {
      return String(resolveFontWeight(token));
    }
    // Многословные значения (семейство шрифта вида «Inter Tight») нарочно
    // выводятся без кавычек: в CSS `font-family: Inter Tight, sans-serif`
    // валиден и без них, а кавычки сломали бы возможность собрать стек
    // шрифтов простой конкатенацией через запятую при потреблении.
    return token.value;
  }

  if (typeof token.value === 'number') {
    return renderNumber(token);
  }

  return String(token.value);
}

// Строковое значение переменной попадает в CSS почти как есть (см. ниже),
// поэтому оно обязано не содержать того, чем можно закрыть текущее
// правило и открыть постороннее. `;`, `}` и перевод строки в значении
// токена Figma законными не бывают ни для одного реального свойства —
// такое значение либо результат порчи данных, либо инъекция.
function assertNoInjection(token) {
  if (/[;}\n]/.test(token.value)) {
    throw new Error(
      `Значение токена ${token.cssVar} содержит «;», «}» или перевод строки: ` +
        `${JSON.stringify(token.value)}. Это ломает CSS-файл (закрывает текущее правило раньше ` +
        `времени и может добавить постороннее) — поправьте значение в Figma.`
    );
  }
}

function resolveFontWeight(token) {
  const key = token.value.toLowerCase();

  // Стили (Italic, Oblique) выводятся как есть строкой в нижнем регистре —
  // это законное значение font-style, но не число font-weight. См.
  // пояснение у FONT_STYLE_VALUES выше про ловушку с потреблением.
  if (FONT_STYLE_VALUES.has(key)) {
    return key;
  }

  const weight = FONT_WEIGHT_NAMES[key];
  if (weight === undefined) {
    const known = [...Object.keys(FONT_WEIGHT_NAMES), ...FONT_STYLE_VALUES].join(', ');
    throw new Error(
      `Токен ${token.cssVar} имеет начертание «${token.value}», которого нет в списке известных ` +
        `(${known}). Добавьте соответствие в FONT_WEIGHT_NAMES в scripts/lib/to-css.mjs или ` +
        `приведите имя в Figma к одному из известных.`
    );
  }
  return weight;
}

function renderNumber(token) {
  if (token.cssVar.startsWith('--line-height')) {
    assertLineHeightIsRatio(token);
  }
  const unitless = [...UNITLESS].some((prefix) => token.cssVar.startsWith(prefix));
  return unitless ? String(token.value) : `${token.value}px`;
}

// В CSS безразмерный line-height — это кратность кегля (140 означает
// «в 140 строк высотой», а не «140%»). В Figma то же поле почти всегда
// хранится в процентах. Значение вне правдоподобного диапазона кратности
// межстрочного интервала (0.5–3) почти наверняка процент, который забыли
// поделить на 100 — генератор роняется, а не превращает верстку в кашу
// молча.
function assertLineHeightIsRatio(token) {
  const value = token.value;
  if (value < 0.5 || value > 3) {
    throw new Error(
      `Токен ${token.cssVar} имеет значение ${value} — похоже на проценты.\n` +
        `В CSS безразмерный межстрочный интервал означает кратность кегля, то есть ${value} строк.\n` +
        `Задайте в Figma ${value / 100} либо заведите переменную с единицами измерения.`
    );
  }
}
