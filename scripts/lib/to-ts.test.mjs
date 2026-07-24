import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseExport } from './parse-export.mjs';
import { toTs, toMap } from './to-ts.mjs';

const raw = JSON.parse(
  readFileSync(new URL('../../tests/fixtures/figma-export.sample.json', import.meta.url))
);
const model = parseExport(raw);

describe('toTs', () => {
  it('объявляет тип со всеми именами токенов', () => {
    const ts = toTs(model);
    expect(ts).toContain("'--palette-blue-default'");
    expect(ts).toContain("'--button-height'");
    expect(ts).toContain('export type TokenName =');
  });

  it('перечисляет каждое имя ровно один раз', () => {
    const ts = toTs(model);
    const matches = ts.match(/'--palette-blue-default'/g);
    expect(matches).toHaveLength(1);
  });
});

describe('toMap', () => {
  it('связывает имя CSS с исходным именем Figma', () => {
    const map = toMap(model);
    expect(map['--theme-accent-default']).toBe('Accent/theme_accent_default');
  });
});
