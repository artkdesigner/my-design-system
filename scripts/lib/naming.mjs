/**
 * Переводит путь переменной Figma в имя пользовательского свойства CSS.
 *
 * Слова из пути режутся по «/», «_» и пробелам, приводятся к нижнему регистру.
 * Повторяющиеся слова убираются — остаётся последнее вхождение: группа в Figma
 * почти всегда продублирована в самом имени переменной («BG/state_bg_accent»).
 */
export function toCssVarName(figmaPath) {
  const words = figmaPath
    .split(/[/_\s]+/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);

  const kept = words.filter((word, i) => words.lastIndexOf(word) === i);
  return '--' + kept.join('-');
}
