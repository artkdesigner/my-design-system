import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseExport } from './parse-export.mjs';
import { toCss } from './to-css.mjs';

// Тесты гоняются против собственного тестового конфига
// (tests/fixtures/mode-selectors.sample.json), а не против боевого
// scripts/mode-selectors.json. Боевой конфиг описывает настоящую
// дизайн-систему и меняется вместе с ней; тестовая фикстура —
// небольшой фиксированный набор коллекций и режимов. Если тесты держать
// на боевом конфиге, любое обновление реальной ДС (новые коллекции,
// переименование режимов) ломает тесты, никак не связанные с сутью
// изменения. Синхронизировать эту пару вручную не нужно: имена
// коллекций/режимов в тестовом конфиге просто обязаны совпадать с тем,
// что реально лежит в tests/fixtures/figma-export.sample.json.
const raw = JSON.parse(
  readFileSync(new URL('../../tests/fixtures/figma-export.sample.json', import.meta.url))
);
const config = JSON.parse(
  readFileSync(new URL('../../tests/fixtures/mode-selectors.sample.json', import.meta.url))
);
const model = parseExport(raw);

describe('toCss', () => {
  it('раскладывает коллекции по файлам слоёв', () => {
    const files = toCss(model, config);
    expect(Object.keys(files).sort()).toEqual([
      'palette.css',
      'scale.css',
      'state.css',
      'theme.css'
    ]);
  });

  it('выдаёт значение как есть', () => {
    const files = toCss(model, config);
    expect(files['palette.css']).toContain('--palette-blue-default: #2936cc;');
  });

  it('выдаёт ссылку через var, а не подставляет значение', () => {
    const files = toCss(model, config);
    expect(files['theme.css']).toContain('--theme-accent-default: var(--palette-blue-default);');
    expect(files['theme.css']).not.toContain('#2936cc');
  });

  it('добавляет единицы измерения числовым токенам', () => {
    const files = toCss(model, config);
    expect(files['scale.css']).toContain('--button-height: 56px;');
  });

  it('выдаёт по блоку на режим с нужными селекторами', () => {
    const files = toCss(model, config);
    expect(files['state.css']).toContain('.ds-interactive:hover,\n[data-state="hover"] {');
  });

  it('складывает несколько коллекций в один слой, не перезаписывая', () => {
    const files = toCss(model, config);
    expect(files['scale.css']).toContain('--button-height: 56px;');
    expect(files['scale.css']).toContain('--font-size-body-m: 16px;');
  });

  it('падает на коллекции, которой нет в соответствии', () => {
    const unknown = structuredClone(model);
    unknown.collections.push({ name: 'ColorsWeather', modes: [] });
    expect(() => toCss(unknown, config)).toThrow(/ColorsWeather/);
  });

  it('падает на режиме, которого нет в соответствии', () => {
    const unknown = structuredClone(model);
    unknown.collections.find((c) => c.name === 'ComponentSize').modes.push({
      name: 'XXL',
      isDefault: false,
      tokens: []
    });
    expect(() => toCss(unknown, config)).toThrow(/XXL/);
  });

  it('ставит блок с :root первым, даже если в выгрузке Figma режим стоит ниже', () => {
    const reordered = structuredClone(model);
    const size = reordered.collections.find((c) => c.name === 'ComponentSize');
    size.modes.reverse(); // теперь S идёт раньше L, а у L — :root

    const files = toCss(reordered, config);
    const scaleCss = files['scale.css'];
    const rootBlockIndex = scaleCss.indexOf(':root,\n[data-size="l"]');
    const sBlockIndex = scaleCss.indexOf('[data-size="s"] {');

    expect(rootBlockIndex).toBeGreaterThan(-1);
    expect(sBlockIndex).toBeGreaterThan(-1);
    expect(rootBlockIndex).toBeLessThan(sBlockIndex);
  });

  it('падает, если умолчательный режим в Figma расходится с :root в конфиге', () => {
    const mismatched = structuredClone(model);
    const size = mismatched.collections.find((c) => c.name === 'ComponentSize');
    size.modes.find((m) => m.name === 'L').isDefault = false;
    size.modes.find((m) => m.name === 'S').isDefault = true;

    expect(() => toCss(mismatched, config)).toThrow(/ComponentSize/);
    expect(() => toCss(mismatched, config)).toThrow(/«S»/);
    expect(() => toCss(mismatched, config)).toThrow(/«L»/);
  });

  it('складывает несколько коллекций слоя scale в предсказуемом порядке (order, а не порядок в выгрузке)', () => {
    const files = toCss(model, config);
    const scaleCss = files['scale.css'];
    const buttonHeightIndex = scaleCss.indexOf('--button-height');
    const fontSizeIndex = scaleCss.indexOf('--font-size-body-m');

    expect(buttonHeightIndex).toBeGreaterThan(-1);
    expect(fontSizeIndex).toBeGreaterThan(-1);
    expect(buttonHeightIndex).toBeLessThan(fontSizeIndex);
  });

  it('превращает строковое начертание в числовой font-weight', () => {
    const files = toCss(model, config);
    expect(files['scale.css']).toContain('--font-weight-medium: 500;');
  });

  it('падает на незнакомом имени начертания', () => {
    const unknownWeight = structuredClone(model);
    const typography = unknownWeight.collections.find((c) => c.name === 'Typography');
    typography.modes[0].tokens.find((t) => t.cssVar === '--font-weight-medium').value = 'Ultra';
    expect(() => toCss(unknownWeight, config)).toThrow(/Ultra/);
    expect(() => toCss(unknownWeight, config)).toThrow(/regular/);
  });

  it('выводит стиль начертания «Italic» строкой font-style, а не числом и не падает', () => {
    const files = toCss(model, config);
    expect(files['scale.css']).toContain('--font-weight-italic: italic;');
  });

  it('выводит многословное семейство шрифта без кавычек', () => {
    const files = toCss(model, config);
    expect(files['scale.css']).toContain('--font-family-main: Inter Tight;');
    expect(files['scale.css']).not.toContain('"Inter Tight"');
    expect(files['scale.css']).not.toContain("'Inter Tight'");
  });

  it('выводит прозрачность без px', () => {
    const files = toCss(model, config);
    expect(files['scale.css']).toContain('--opacity-disabled: 0.4;');
  });

  it('падает, если межстрочный интервал похож на проценты', () => {
    const percentLineHeight = structuredClone(model);
    const typography = percentLineHeight.collections.find((c) => c.name === 'Typography');
    typography.modes[0].tokens.find((t) => t.cssVar === '--line-height-body-m').value = 140;

    expect(() => toCss(percentLineHeight, config)).toThrow(
      /--line-height-body-m имеет значение 140 — похоже на проценты/
    );
    expect(() => toCss(percentLineHeight, config)).toThrow(/Задайте в Figma 1\.4/);
  });

  it('падает на значении, похожем на инъекцию CSS', () => {
    const evil = structuredClone(model);
    const palette = evil.collections.find((c) => c.name === 'ColorsPalette');
    palette.modes[0].tokens.find((t) => t.cssVar === '--palette-blue-default').value =
      '#000; } :root { color: red';

    expect(() => toCss(evil, config)).toThrow(/--palette-blue-default/);
  });
});

// Переменные CSS наследуют вычисленное значение, а не текст объявления, поэтому
// объявленный только на :root производный слой не реагирует на переопределение
// его входов на другом элементе (см. header toCss). Фикстура воспроизводит эту
// схему: ColorsState — «источник состояния» с двумя режимами (Default/Hover);
// ColorsOnAccent ссылается на ColorsState напрямую; ColorsElement ссылается на
// ColorsOnAccent, то есть на ColorsState только транзитивно. ComponentSize,
// в свою очередь, содержит токен, который ссылается сам на себя (как устроены
// Scales в настоящей дизайн-системе) — на нём проверяется, что самоссылки не
// порождают переизлучения.
describe('переизлучение производных слоёв там, где меняются их входы', () => {
  it('переизлучает производный слой под селектором, где меняется его прямой вход (наведение)', () => {
    const files = toCss(model, config);
    // ColorsOnAccent: --on-accent-surface: var(--state-bg-accent) — прямая
    // ссылка на ColorsState. При наведении --state-bg-accent переопределяется
    // на другом элементе (.ds-interactive:hover/[data-state="hover"]), поэтому
    // --on-accent-surface обязана быть переобъявлена под тем же селектором.
    expect(files['state.css']).toContain(
      '.ds-interactive:hover,\n[data-state="hover"] {\n' +
        '  --on-accent-surface: var(--state-bg-accent);\n' +
        '}'
    );
  });

  it('переизлучает слой, зависящий от источника изменения только транзитивно', () => {
    const files = toCss(model, config);
    const stateCss = files['state.css'];
    // ColorsElement ссылается на ColorsOnAccent, а не напрямую на ColorsState —
    // но ColorsOnAccent сама зависит от ColorsState, поэтому переизлучение
    // ColorsElement обязано учитывать эту цепочку и сработать и на наведении...
    expect(stateCss).toContain(
      '.ds-interactive:hover,\n[data-state="hover"] {\n' +
        '  --element-bg-accent: var(--on-accent-surface);\n' +
        '}'
    );
    // ...и на собственном прямом входе ColorsElement — переключателе onAccent.
    expect(stateCss).toContain(
      '[data-on-accent] {\n  --element-bg-accent: var(--on-accent-surface);\n}'
    );
  });

  it('текст объявлений в переизлучённом блоке совпадает с основным блоком коллекции', () => {
    const files = toCss(model, config);
    const declaration = '--on-accent-surface: var(--state-bg-accent);';
    const occurrences = files['state.css'].split(declaration).length - 1;
    // Четыре вхождения одного и того же текста: основной :root, основной
    // [data-on-accent], переизлучённый блок под hover и составной
    // .ds-interactive:hover[data-on-accent]. В фикстуре у режима onAccent
    // то же значение, что у умолчательного, поэтому текст совпадает во всех
    // четырёх — на настоящих данных значения режимов различаются.
    expect(occurrences).toBe(4);
  });

  it('добавляет поясняющий комментарий перед переизлучёнными блоками', () => {
    const files = toCss(model, config);
    expect(files['state.css']).toContain('Переменные CSS наследуют вычисленное значение');
  });

  it('переизлучённые блоки идут после блока :root той же коллекции', () => {
    const files = toCss(model, config);
    const stateCss = files['state.css'];
    const rootBlockIndex = stateCss.indexOf(':root {\n  --on-accent-surface:');
    const reemitCommentIndex = stateCss.indexOf('Переменные CSS наследуют вычисленное значение');

    expect(rootBlockIndex).toBeGreaterThan(-1);
    expect(reemitCommentIndex).toBeGreaterThan(rootBlockIndex);
  });

  it('собственные блоки неосновных режимов идут ниже переизлучённых', () => {
    // Иначе переизлучение затирает собственный режим коллекции. Переизлучённый
    // блок несёт значения УМОЛЧАТЕЛЬНОГО режима, а специфичность у него и у
    // блока неосновного режима одинаковая — [data-on-accent] и [data-state="hover"]
    // это (0,1,0) оба. На элементе, попадающем под оба селектора, побеждает
    // тот, что ниже в файле. Значит ниже обязан быть собственный режим:
    // переключатель выставили осознанно, и его значения не должны молча
    // подменяться умолчательными.
    const files = toCss(model, config);
    const stateCss = files['state.css'];
    const reemitCommentIndex = stateCss.indexOf('Переменные CSS наследуют вычисленное значение');
    const ownOnAccentBlockIndex = stateCss.indexOf(
      '[data-on-accent] {\n  --on-accent-surface: var(--state-bg-accent);\n}'
    );

    expect(reemitCommentIndex).toBeGreaterThan(-1);
    expect(ownOnAccentBlockIndex).toBeGreaterThan(reemitCommentIndex);
  });

  it('переизлучает и собственные неосновные режимы, составным селектором', () => {
    // Одного порядка блоков мало. Селекторы состояний в дизайн-системе несут
    // класс (.ds-interactive:hover — специфичность (0,2,0)), а контейнерные
    // переключатели — только атрибут ((0,1,0)). На элементе, который и
    // интерактивен, и несёт переключатель, переизлучение с умолчательными
    // значениями побеждает по специфичности, и порядок тут не спасает.
    // Поэтому под каждым триггером режим объявляется ещё раз, составным
    // селектором: он специфичнее и самого триггера, и переключателя.
    const model2 = structuredClone(model);
    const onAccent = model2.collections.find((c) => c.name === 'ColorsOnAccent');
    onAccent.modes.find((m) => m.name === 'onAccent').tokens[0].ref = '--theme-accent-600';

    const files = toCss(model2, config);

    expect(files['state.css']).toContain(
      '.ds-interactive:hover[data-on-accent],\n[data-state="hover"][data-on-accent] {\n' +
        '  --on-accent-surface: var(--theme-accent-600);\n' +
        '}'
    );
  });

  it('коллекция с единственным режимом составных блоков не получает', () => {
    const files = toCss(model, config);
    // ColorsElement — один режим Value на :root, переизлучать внутрь триггеров
    // нечего, кроме умолчательного блока: составных селекторов быть не должно.
    expect(files['state.css']).not.toMatch(
      /\.ds-interactive:hover\[[^\]]+\][^{]*\{\n {2}--element-bg-accent/
    );
  });

  it('коллекция без зависимостей не получает переизлучённых блоков', () => {
    const files = toCss(model, config);
    // ColorsPalette не ссылается ни на что.
    expect(files['palette.css']).not.toContain('Переменные CSS наследуют вычисленное значение');
  });

  it('самоссылка коллекции на саму себя не создаёт переизлучения', () => {
    const files = toCss(model, config);
    // --button-min-width в режиме S коллекции ComponentSize ссылается на
    // --button-height той же коллекции. Без исключения самоссылок
    // ComponentSize считала бы себя зависимой от себя и переизлучала бы
    // умолчательный режим L под собственным override-селектором [data-size="s"].
    expect(files['scale.css']).not.toContain('Переменные CSS наследуют вычисленное значение');
  });

  it('вывод детерминирован при повторном вызове на тех же данных', () => {
    const files1 = toCss(model, config);
    const files2 = toCss(model, config);

    expect(files1).toEqual(files2);
    expect(files1['state.css']).toBe(files2['state.css']);
  });
});

describe('validateConfig (через toCss)', () => {
  it('падает, если у коллекции нет layer', () => {
    const broken = structuredClone(config);
    delete broken.ColorsPalette.layer;
    expect(() => toCss(model, broken)).toThrow(/ColorsPalette/);
  });

  it('падает, если у режима пустой список селекторов', () => {
    const broken = structuredClone(config);
    broken.ColorsState.modes.Hover = [];
    expect(() => toCss(model, broken)).toThrow(/Hover/);
    expect(() => toCss(model, broken)).toThrow(/ColorsState/);
  });

  it('падает, если у коллекции нет modes', () => {
    const broken = structuredClone(config);
    delete broken.ColorsTheme.modes;
    expect(() => toCss(model, broken)).toThrow(/ColorsTheme/);
  });

  it('падает, если селектор задан строкой, а не массивом', () => {
    const broken = structuredClone(config);
    broken.ColorsPalette.modes.Default = ':root';
    expect(() => toCss(model, broken)).toThrow(/ColorsPalette/);
  });

  it('падает, если у коллекции нет order', () => {
    const broken = structuredClone(config);
    delete broken.ComponentSize.order;
    expect(() => toCss(model, broken)).toThrow(/ComponentSize/);
  });

  it('падает, если order повторяется у двух коллекций', () => {
    const broken = structuredClone(config);
    broken.Typography.order = broken.ComponentSize.order;
    expect(() => toCss(model, broken)).toThrow(/ComponentSize/);
    expect(() => toCss(model, broken)).toThrow(/Typography/);
  });
});
