import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseExport } from './parse-export.mjs';

const raw = JSON.parse(
  readFileSync(new URL('../../tests/fixtures/figma-export.sample.json', import.meta.url))
);

describe('parseExport', () => {
  it('переводит имена переменных в имена CSS', () => {
    const model = parseExport(raw);
    const palette = model.collections.find((c) => c.name === 'ColorsPalette');
    expect(palette.modes[0].tokens[0].cssVar).toBe('--palette-blue-default');
  });

  it('превращает ссылку в имя другой переменной, а не в значение', () => {
    const model = parseExport(raw);
    const theme = model.collections.find((c) => c.name === 'ColorsTheme');
    const accent = theme.modes[0].tokens.find((t) => t.cssVar === '--theme-accent-default');
    expect(accent.ref).toBe('--palette-blue-default');
    expect(accent.value).toBeUndefined();
  });

  it('раскладывает многорежимную коллекцию по режимам', () => {
    const model = parseExport(raw);
    const size = model.collections.find((c) => c.name === 'ComponentSize');
    expect(size.modes.map((m) => m.name)).toEqual(['L', 'S']);
    expect(size.modes[0].tokens[0].value).toBe(56);
    expect(size.modes[1].tokens[0].value).toBe(32);
  });

  it('помечает режим по умолчанию', () => {
    const model = parseExport(raw);
    const state = model.collections.find((c) => c.name === 'ColorsState');
    expect(state.modes.find((m) => m.isDefault).name).toBe('Default');
  });

  it('падает на ссылке в никуда', () => {
    const broken = structuredClone(raw);
    broken.collections[1].variables[0].valuesByMode.m2 = { type: 'ALIAS', id: 'V:404' };
    expect(() => parseExport(broken)).toThrow(/V:404/);
  });

  it('падает при совпадении имён CSS у разных переменных', () => {
    const clashing = structuredClone(raw);
    clashing.collections[0].variables[1].name = 'Blue/palette_blue_default';
    expect(() => parseExport(clashing)).toThrow(/--palette-blue-default/);
  });
});
