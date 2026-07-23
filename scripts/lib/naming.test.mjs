import { describe, it, expect } from 'vitest';
import { toCssVarName } from './naming.mjs';

describe('toCssVarName', () => {
  it('отбрасывает группу, продублированную в имени', () => {
    expect(toCssVarName('BG/state_bg_accent')).toBe('--state-bg-accent');
    expect(toCssVarName('Text/element_text_primary')).toBe('--element-text-primary');
  });

  it('схлопывает трёхкратный повтор в компонентных токенах', () => {
    expect(toCssVarName('Button/Button/Button_height')).toBe('--button-height');
    expect(toCssVarName('Addon/Addon_size')).toBe('--addon-size');
  });

  it('сохраняет осмысленный контекст при частичном повторе', () => {
    expect(toCssVarName('Font size/Body/body_m')).toBe('--font-size-body-m');
    expect(toCssVarName('Gray/palette_gray_900')).toBe('--palette-gray-900');
  });

  it('не трогает имена без повторов', () => {
    expect(toCssVarName('Padding/24')).toBe('--padding-24');
    expect(toCssVarName('Font family/Main')).toBe('--font-family-main');
    expect(toCssVarName('Body M/Regular')).toBe('--body-m-regular');
  });

  it('сохраняет дефисы внутри слова', () => {
    expect(toCssVarName('Text/state_text_on-accent')).toBe('--state-text-on-accent');
  });

  it('отбрасывает группу во множественном числе', () => {
    expect(toCssVarName('Icons/state_icon_on-accent-secondary')).toBe('--state-icon-on-accent-secondary');
  });

  it('падает на имени, непригодном для CSS', () => {
    expect(() => toCssVarName('Colors (old)/palette_blue_default')).toThrow(/так в CSS нельзя/);
    expect(() => toCssVarName('')).toThrow();
  });
});
