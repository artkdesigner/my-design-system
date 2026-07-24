import { tokenNames, type TokenName } from '../tokens/tokens';

/**
 * Префиксы имён CSS по слоям дизайн-системы. Порядок важен: имя попадает
 * в первую группу, чей префикс подошёл.
 *
 * Список снят с ds/src/tokens/tokens.map.json, а не выдуман: акценты лежат
 * в `--brand-*`, но это тот же слой CSS, что и тема (одна коллекция
 * ColorsAccent рядом с ColorsTheme), поэтому в витрине они идут вместе.
 * Размеров компонентов здесь нет намеренно — см. groupTokens.
 */
const LAYER_PREFIXES = {
  palette: ['--palette-'],
  theme: ['--theme-', '--brand-'],
  state: ['--state-'],
  message: ['--message-'],
  onAccent: ['--on-accent-'],
  element: ['--element-'],
  scale: ['--scales-', '--padding-', '--margin-', '--radius-', '--stroke-'],
  typography: ['--font-']
} as const;

type Layer = keyof typeof LAYER_PREFIXES;

export type TokenGroups = Record<Layer | 'component', TokenName[]>;

/**
 * Раскладывает имена токенов по слоям — для отдельных страниц витрины.
 *
 * Восемь слоёв перечислены префиксами, девятая группа — component — это
 * остаток. Так сделано сознательно: коллекция ComponentSize в Figma растёт
 * каждым новым компонентом (сейчас в ней больше двух десятков префиксов
 * вида `--button-`, `--input-`, `--tooltip-`), и держать этот список в коде
 * значило бы дописывать его при каждом новом компоненте, а до тех пор молча
 * терять токены. Слоёв же ровно столько, сколько коллекций цвета и шкал, и
 * они не плодятся.
 *
 * Что остаток не подменяет собой слой, проверяется тестом: на настоящем
 * наборе токенов ни одна группа не должна быть пустой.
 */
export function groupTokens(names: readonly TokenName[] = tokenNames): TokenGroups {
  const groups = {
    palette: [],
    theme: [],
    state: [],
    message: [],
    onAccent: [],
    element: [],
    scale: [],
    typography: [],
    component: []
  } as TokenGroups;

  for (const name of names) {
    const layer = (Object.keys(LAYER_PREFIXES) as Layer[]).find((candidate) =>
      LAYER_PREFIXES[candidate].some((prefix) => name.startsWith(prefix))
    );

    groups[layer ?? 'component'].push(name);
  }

  return groups;
}

export type ComponentGroup = { name: string; tokens: TokenName[] };

/**
 * Делит размеры компонентов по компонентам: первое слово имени — это имя
 * компонента (`--button-height` → button). Двести с лишним токенов одной
 * простынёй не читаются, а по компонентам — вполне.
 */
export function groupByComponent(names: readonly TokenName[]): ComponentGroup[] {
  const byName = new Map<string, TokenName[]>();

  for (const token of names) {
    const name = token.replace(/^--/, '').split('-')[0] ?? token;
    const bucket = byName.get(name);
    if (bucket) bucket.push(token);
    else byName.set(name, [token]);
  }

  return [...byName.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, tokens]) => ({ name, tokens }));
}

/**
 * Ставит имена в порядке числа на конце: `--scales-2`, `--scales-12`,
 * `--scales-120`. Токены приходят отсортированными как строки, и линейка
 * шкал в таком порядке нечитаема — 120 оказывается между 12 и 14.
 * Имена без числа на конце (`--radius-max`) идут после числовых, по алфавиту.
 */
export function sortByNumericSuffix(names: readonly TokenName[]): TokenName[] {
  const numberOf = (name: string) => {
    const match = /-(\d+)$/.exec(name);
    return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
  };

  return [...names].sort((a, b) => {
    const diff = numberOf(a) - numberOf(b);
    if (Number.isNaN(diff) || diff === 0) return a.localeCompare(b);
    return diff;
  });
}

/** Вычисленное значение токена в текущей теме — читается из живого документа. */
export function resolveToken(name: TokenName): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
