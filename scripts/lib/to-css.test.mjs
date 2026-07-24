import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseExport } from './parse-export.mjs';
import { toCss } from './to-css.mjs';

const raw = JSON.parse(
  readFileSync(new URL('../../tests/fixtures/figma-export.sample.json', import.meta.url))
);
const config = JSON.parse(readFileSync(new URL('../mode-selectors.json', import.meta.url)));
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
});
