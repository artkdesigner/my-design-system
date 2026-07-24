function allTokens(model) {
  return model.collections.flatMap((c) => c.modes.flatMap((m) => m.tokens));
}

/**
 * Объявление типа: подсказки в редакторе и ошибка на опечатке в имени токена.
 *
 * Имена перечислены ровно один раз — в массиве `tokenNames`. Тип `TokenName`
 * выводится из него через `(typeof tokenNames)[number]`, а не перечисляется
 * заново union'ом. Так список и тип физически не могут разойтись при правке:
 * второй экземпляр перечисления был бы источником рассинхронизации, если
 * когда-нибудь кто-то добавит имя в одно место и забудет про другое.
 */
export function toTs(model) {
  const names = [...new Set(allTokens(model).map((t) => t.cssVar))].sort();
  const list = names.map((n) => `  '${n}'`).join(',\n');

  return (
    '// Файл генерируется скриптом sync-tokens — правки руками будут стёрты.\n\n' +
    'export const tokenNames = [\n' +
    list +
    '\n] as const;\n\n' +
    'export type TokenName = (typeof tokenNames)[number];\n'
  );
}

/** Обратное соответствие: по имени CSS понять, что это было в Figma. */
export function toMap(model) {
  const map = {};
  for (const token of allTokens(model)) {
    map[token.cssVar] = token.figmaName;
  }
  return Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
}
