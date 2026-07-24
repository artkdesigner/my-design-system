import { describe, it, expect } from 'vitest';
import { tokenNames } from '../tokens/tokens';
import { groupTokens, groupByComponent, sortByNumericSuffix } from './tokens-source';

describe('groupTokens', () => {
  it('раскладывает цветовые слои по своим группам', () => {
    const groups = groupTokens([
      '--palette-blue-default',
      '--theme-accent-default',
      '--brand-accent-default',
      '--state-bg-accent',
      '--message-icon',
      '--on-accent-text-primary',
      '--element-bg-action-accent'
    ]);

    expect(groups.palette).toEqual(['--palette-blue-default']);
    expect(groups.state).toEqual(['--state-bg-accent']);
    expect(groups.message).toEqual(['--message-icon']);
    expect(groups.onAccent).toEqual(['--on-accent-text-primary']);
    expect(groups.element).toEqual(['--element-bg-action-accent']);
  });

  it('держит акценты в одной группе с темой — это один слой CSS', () => {
    const groups = groupTokens(['--theme-accent-default', '--brand-accent-default']);
    expect(groups.theme).toEqual(['--theme-accent-default', '--brand-accent-default']);
  });

  it('отделяет шкалы от типографики', () => {
    const groups = groupTokens(['--scales-0', '--stroke-1', '--margin-24', '--font-size-body-m']);
    expect(groups.scale).toEqual(['--scales-0', '--stroke-1', '--margin-24']);
    expect(groups.typography).toEqual(['--font-size-body-m']);
  });

  it('всё остальное считает размерами компонентов', () => {
    const groups = groupTokens(['--button-height', '--addon-size']);
    expect(groups.component).toEqual(['--button-height', '--addon-size']);
  });

  it('не теряет и не удваивает ни одного токена', () => {
    const groups = groupTokens(tokenNames);
    const total = Object.values(groups).reduce((sum, names) => sum + names.length, 0);

    expect(total).toBe(tokenNames.length);
    expect(new Set(Object.values(groups).flat()).size).toBe(tokenNames.length);
  });

  it('на настоящем наборе токенов ни одна группа не пуста', () => {
    // Страховка от переименования в Figma: если префикс слоя перестанет
    // совпадать, группа опустеет и раздел витрины молча исчезнет — а не
    // упадёт на глазах. Ловим это тестом, а не глазами на демонстрации.
    const groups = groupTokens(tokenNames);
    const empty = Object.entries(groups)
      .filter(([, names]) => names.length === 0)
      .map(([layer]) => layer);

    expect(empty).toEqual([]);
  });
});

describe('groupByComponent', () => {
  it('собирает токены компонента по первому слову имени', () => {
    const groups = groupByComponent(['--button-height', '--button-gap', '--addon-size']);
    expect(groups).toEqual([
      { name: 'addon', tokens: ['--addon-size'] },
      { name: 'button', tokens: ['--button-height', '--button-gap'] }
    ]);
  });

  it('перечисляет компоненты по алфавиту, чтобы порядок не зависел от Figma', () => {
    const groups = groupByComponent(['--tag-height', '--input-stepper-gap', '--button-height']);
    expect(groups.map((g) => g.name)).toEqual(['button', 'input', 'tag']);
  });
});

describe('sortByNumericSuffix', () => {
  it('ставит шкалу по возрастанию, а не по алфавиту', () => {
    // tokenNames отсортированы как строки, поэтому --scales-120 стоит между
    // --scales-12 и --scales-14. Для линейки это бессмыслица.
    expect(sortByNumericSuffix(['--scales-12', '--scales-120', '--scales-2', '--scales-0'])).toEqual(
      ['--scales-0', '--scales-2', '--scales-12', '--scales-120']
    );
  });

  it('имена без числа в конце ставит после числовых, по алфавиту', () => {
    expect(sortByNumericSuffix(['--radius-max', '--radius-10', '--radius-0'])).toEqual([
      '--radius-0',
      '--radius-10',
      '--radius-max'
    ]);
  });
});
