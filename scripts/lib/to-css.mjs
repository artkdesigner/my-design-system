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

// Комментарий, который предваряет переизлучённые блоки производного слоя
// (см. computeReemission ниже) в сгенерированном CSS — объясняет читателю
// файла, зачем один и тот же текст объявлений повторяется под несколькими
// селекторами.
const REEMIT_COMMENT =
  '/* Переменные CSS наследуют вычисленное значение, а не текст объявления —\n' +
  '   поэтому производный слой переобъявляется здесь, там, где меняются его входы. */';

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
 *
 * Сверх основных блоков режимов каждая коллекция может получить
 * «переизлучённые» блоки — см. computeReemission. Причина в том, что
 * пользовательские свойства CSS наследуют уже ВЫЧИСЛЕННОЕ значение, а не
 * текст объявления: `--element-bg: var(--state-bg)`, объявленное только на
 * :root, вычисляется один раз на корне документа, и все потомки наследуют
 * готовый результат — переопределение `--state-bg` на наведённой кнопке
 * (`.ds-interactive:hover`) на уже вычисленный `--element-bg` не влияет,
 * потому что это другой элемент. Чтобы производная переменная реагировала,
 * её нужно заново объявить (тем же текстом) там же, где переопределяется
 * хотя бы один из её входов.
 */
export function toCss(model, config) {
  validateConfig(config);
  assertCollectionsKnown(model, config);

  const reemission = computeReemission(model, config);

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
    // Существование коллекции и всех её режимов в конфиге уже проверено
    // выше, в assertCollectionsKnown — здесь это гарантировано.
    const rules = config[collection.name];

    const modesInOrder = sortRootFirst(collection.modes, rules, collection.name);

    // Блоки коллекции делятся на два разряда, между которыми встают
    // переизлучённые: блок с :root (умолчательный режим) и блоки остальных
    // режимов. Почему именно так — см. ниже, у вставки переизлучения.
    const rootBlocks = [];
    const modeBlocks = [];
    for (const mode of modesInOrder) {
      const selectors = rules.modes[mode.name];

      // Не мёртвый код: срабатывает не только на отдельных режимах, но и
      // целиком на коллекции без переменных (тогда tokens пуст у каждого
      // режима) — например, коллекцию завели в Figma, но переменные в неё
      // ещё не добавили. Такая коллекция обязана пройти проверки выше
      // (её имя и режимы всё равно должны быть в конфиге), но не должна
      // породить пустое CSS-правило `{}`.
      if (mode.tokens.length === 0) continue;

      const block = `${selectors.join(',\n')} {\n${renderDeclarations(mode.tokens)}\n}`;
      (selectors.includes(':root') ? rootBlocks : modeBlocks).push(block);
    }

    let entry = layers.get(rules.layer);
    if (!entry) {
      entry = { sources: [], parts: [] };
      layers.set(rules.layer, entry);
    }
    entry.sources.push(collection.name);

    if (rootBlocks.length > 0) {
      entry.parts.push(rootBlocks.join('\n\n'));
    }

    // Переизлучённые блоки (если для этой коллекции они есть) встают между
    // блоком :root и блоками остальных режимов той же коллекции, в том же
    // файле слоя — см. computeReemission.
    //
    // Место выбрано каскадом, а не косметикой. Переизлучённый блок несёт
    // объявления УМОЛЧАТЕЛЬНОГО режима, и его селектор (скажем,
    // [data-theme="dark"]) имеет ту же специфичность (0,1,0), что и селектор
    // неосновного режима самой коллекции ([data-state="hover"]). На элементе,
    // попадающем под оба, побеждает блок, который ниже в файле. Значит:
    //   — переизлучение обязано быть НИЖЕ :root, иначе тема, включённая на
    //     контейнере, не переопределит корневые значения;
    //   — и обязано быть ВЫШЕ собственных неосновных режимов, иначе
    //     умолчательные значения затрут осознанно включённый режим. Именно так
    //     ломалось принудительное состояние в витрине: [data-theme="dark"]
    //     стоял ниже [data-state="hover"] и возвращал наведению умолчательный
    //     цвет.
    const extra = reemission.get(collection.name);
    if (extra) {
      entry.parts.push(`${REEMIT_COMMENT}\n\n${extra.join('\n\n')}`);
    }

    if (modeBlocks.length > 0) {
      entry.parts.push(modeBlocks.join('\n\n'));
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

// Проверяет, что у каждой коллекции модели и у каждого её режима есть
// запись в scripts/mode-selectors.json. Вынесено из основного цикла
// генерации в отдельный проход по двум причинам: во-первых, computeReemission
// (вызывается сразу после этой проверки) читает rules.modes для ЛЮБОЙ
// коллекции модели, а не только для той, что генератор как раз обрабатывает,
// поэтому к моменту его вызова конфиг обязан быть полным; во-вторых, так
// сообщение об ошибке появляется до всякой другой работы, а не посреди неё.
function assertCollectionsKnown(model, config) {
  for (const collection of model.collections) {
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
  }
}

// Общий рендер объявлений набора токенов — используется и для основных
// блоков режимов, и для переизлучённых блоков ниже. Один и тот же код
// гарантирует, что текст объявлений в переизлучённом блоке побайтово
// совпадает с текстом в исходном блоке коллекции: это важно, потому что
// именно на этой идентичности держится приём (см. header toCss) — какой из
// двух блоков ни выиграл бы по специфичности CSS, результат один и тот же.
function renderDeclarations(tokens) {
  return tokens.map((token) => `  ${token.cssVar}: ${renderValue(token)};`).join('\n');
}

/**
 * Считает, какие коллекции надо переизлучить и под какими селекторами —
 * см. развёрнутое объяснение в header toCss.
 *
 * Возвращает Map<имя коллекции, string[]> — готовые CSS-блоки (селектор(ы)
 * + объявления по умолчательному режиму), которые нужно дописать в файл
 * слоя сразу после основных блоков этой коллекции. Коллекции без такой
 * необходимости в Map не попадают вовсе (см. «не плодить пустого» ниже).
 *
 * Шаги:
 *   1) карта «имя CSS-переменной → коллекция, которой она принадлежит» —
 *      нужна, чтобы по token.ref коллекции C понять, чья это переменная D;
 *   2) прямые зависимости каждой коллекции: множество коллекций, чьи
 *      переменные она читает через ref, по всем режимам, без самоссылок
 *      (коллекция на саму себя — так устроены Scales, см. задание);
 *   3) «переопределяющие» селекторы каждой коллекции: селекторы всех её
 *      режимов, КРОМЕ режимов, где среди селекторов есть :root — именно
 *      отсутствие :root означает «этот блок переопределяет значение не на
 *      корне документа, а где-то ещё», то есть ровно то место, где
 *      наследуемое вычисленное значение производной переменной перестаёт
 *      быть верным;
 *   4) транзитивное замыкание зависимостей (если A зависит от B, а B от C,
 *      то A нужно переизлучить и там, где меняются входы C);
 *   5) для каждой коллекции — объединение переопределяющих селекторов всех
 *      коллекций в её замыкании; если оно пусто, коллекция ничего не
 *      получает. Иначе для каждого (уникального) переопределяющего
 *      селектора собирается блок с объявлениями УМОЛЧАТЕЛЬНОГО режима
 *      коллекции. Остальные её режимы переопределяют это сами, каждый под
 *      своим селектором, — но только за счёт того, что их блоки стоят в
 *      файле НИЖЕ переизлучённых: специфичность у тех и других одинаковая,
 *      и решает порядок. Место вставки задаётся в toCss, см. пояснение там.
 *
 * Селекторы схлопываются по точному тексту (`selectors.join(',\n')`) и
 * сортируются по нему же лексикографически — так порядок блоков в файле не
 * зависит от порядка коллекций в выгрузке Figma или от порядка обхода
 * Map/Set, и повторный запуск на тех же данных даёт побайтово тот же файл.
 */
function computeReemission(model, config) {
  // 1) cssVar -> имя владеющей коллекции.
  const ownerByCssVar = new Map();
  for (const collection of model.collections) {
    for (const mode of collection.modes) {
      for (const token of mode.tokens) {
        ownerByCssVar.set(token.cssVar, collection.name);
      }
    }
  }

  // 2) прямые зависимости, без самоссылок.
  const directDeps = new Map();
  for (const collection of model.collections) {
    const deps = new Set();
    for (const mode of collection.modes) {
      for (const token of mode.tokens) {
        if (!token.ref) continue;
        const owner = ownerByCssVar.get(token.ref);
        if (owner && owner !== collection.name) {
          deps.add(owner);
        }
      }
    }
    directDeps.set(collection.name, deps);
  }

  // 3) переопределяющие селекторы (селекторы режимов без :root в списке).
  const overrideGroups = new Map();
  for (const collection of model.collections) {
    const rules = config[collection.name];
    const groups = [];
    for (const mode of collection.modes) {
      const selectors = rules.modes[mode.name];
      if (selectors.includes(':root')) continue;
      groups.push(selectors);
    }
    overrideGroups.set(collection.name, groups);
  }

  // 4) транзитивное замыкание с мемоизацией и защитой от цикла (в реальных
  // данных циклов быть не должно — ref всегда идёт «вниз», от производного
  // токена к первичному, — но защита не даёт зациклиться, если где-то
  // всё-таки образуется цикл, вместо переполнения стека).
  const closureCache = new Map();
  function closureOf(name, stack) {
    if (closureCache.has(name)) return closureCache.get(name);
    if (stack.has(name)) return new Set();

    stack.add(name);
    const result = new Set();
    for (const dep of directDeps.get(name) ?? []) {
      result.add(dep);
      for (const transitive of closureOf(dep, stack)) {
        result.add(transitive);
      }
    }
    stack.delete(name);

    closureCache.set(name, result);
    return result;
  }

  // 5) итоговые блоки на коллекцию.
  const reemission = new Map();
  for (const collection of model.collections) {
    const closure = new Set(closureOf(collection.name, new Set()));
    closure.delete(collection.name); // страховка на случай цикла зависимостей

    if (closure.size === 0) continue; // «не плодить пустого»: зависимостей нет вовсе

    const bySelectorText = new Map(); // selectors.join(',\n') -> selectors
    for (const depName of closure) {
      for (const selectors of overrideGroups.get(depName) ?? []) {
        const key = selectors.join(',\n');
        if (!bySelectorText.has(key)) {
          bySelectorText.set(key, selectors);
        }
      }
    }

    if (bySelectorText.size === 0) continue; // зависимости есть, но ни у одной нет переопределений

    const defaultMode = collection.modes.find((mode) => mode.isDefault);
    if (!defaultMode || defaultMode.tokens.length === 0) continue; // нечего переизлучать

    const declarations = renderDeclarations(defaultMode.tokens);

    const blocks = [...bySelectorText.keys()]
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `${key} {\n${declarations}\n}`);

    reemission.set(collection.name, blocks);
  }

  return reemission;
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
