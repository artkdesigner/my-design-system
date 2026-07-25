import { describe, it, expect } from 'vitest';
import { diffTokens, readDeclarations } from './check-tokens.mjs';

const generated = {
  '--palette-blue-default': '#2936cc',
  '--button-height': '56px'
};

describe('diffTokens', () => {
  it('молчит, когда всё совпадает', () => {
    expect(diffTokens(generated, { ...generated })).toEqual([]);
  });

  it('сообщает о разошедшемся значении', () => {
    const drift = diffTokens(generated, { ...generated, '--button-height': '48px' });
    expect(drift).toEqual([
      { token: '--button-height', inCode: '56px', inFigma: '48px', kind: 'изменился' }
    ]);
  });

  it('сообщает о токене, появившемся в Figma', () => {
    const drift = diffTokens(generated, { ...generated, '--button-gap': '8px' });
    expect(drift).toEqual([
      { token: '--button-gap', inCode: undefined, inFigma: '8px', kind: 'добавлен' }
    ]);
  });

  it('сообщает о токене, исчезнувшем из Figma', () => {
    const drift = diffTokens(generated, { '--palette-blue-default': '#2936cc' });
    expect(drift).toEqual([
      { token: '--button-height', inCode: '56px', inFigma: undefined, kind: 'удалён' }
    ]);
  });
});

describe('readDeclarations', () => {
  it('вытаскивает объявления переменных из текста CSS', () => {
    const css = `:root {\n  --palette-blue-default: #2936cc;\n  --button-height: 56px;\n}\n`;
    expect(readDeclarations(css)).toEqual({
      '--palette-blue-default': '#2936cc',
      '--button-height': '56px'
    });
  });

  it('игнорирует переизлучённые повторы того же токена, беря последнее значение', () => {
    const css = `:root { --a: 1px; }\n[data-theme="dark"] { --a: 1px; }\n`;
    expect(readDeclarations(css)).toEqual({ '--a': '1px' });
  });
});
