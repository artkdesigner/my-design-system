import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioItem } from './RadioItem';

const meta: Meta<typeof RadioItem> = {
  title: 'Components/Radio/RadioItem',
  component: RadioItem,
  args: { 'aria-label': 'Вариант' }
};

export default meta;
type Story = StoryObj<typeof RadioItem>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

const label: CSSProperties = {
  fontFamily: 'var(--font-family-code)',
  fontSize: 'var(--font-size-hint-m)',
  color: 'var(--element-text-secondary)',
  textAlign: 'center',
  fontWeight: 'var(--font-weight-regular)'
};

export const НеВыбран: Story = { name: 'В покое' };

/** Узел 134:548 в Figma — оба состояния рядом. Рамка одна и та же в обоих:
 * разница только в точке внутри. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
      {(
        [
          ['Не выбран', false],
          ['Выбран', true]
        ] as const
      ).map(([name, selected]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-8)' }}>
          <RadioItem aria-label={name} selected={selected} />
          <span style={label}>{name}</span>
        </div>
      ))}
    </div>
  )
};

/** Состояния взаимодействия все сразу, без наведения мышью — тот же приём,
 * что у Button/CheckboxItem: data-state форсирует псевдокласс через
 * переизлучение токенов. */
export const Взаимодействие: Story = {
  render: () => {
    const states = [
      ['обычное', ''],
      ['наведение', 'hover'],
      ['нажатие', 'pressed'],
      ['недоступно', 'disabled']
    ] as const;

    return (
      <div style={page}>
        <table style={{ borderSpacing: 'var(--margin-12)' }}>
          <thead>
            <tr>
              <th />
              {states.map(([name]) => (
                <th key={name} style={label}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {([false, true] as const).map((selected) => (
              <tr key={String(selected)}>
                <td style={label}>{selected ? 'выбран' : 'не выбран'}</td>
                {states.map(([stateName, forced]) => (
                  <td key={stateName} data-state={forced || undefined}>
                    <RadioItem aria-label="Вариант" selected={selected} disabled={forced === 'disabled'} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

/** Три размера рядом — проверка режимов ComponentSize. */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <RadioItem aria-label="Large" selected size="l" />
      <RadioItem aria-label="Medium" selected size="m" />
      <RadioItem aria-label="Small" selected size="s" />
    </div>
  )
};
