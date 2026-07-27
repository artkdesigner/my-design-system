import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxItem } from './CheckboxItem';

const meta: Meta<typeof CheckboxItem> = {
  title: 'Components/CheckboxItem',
  component: CheckboxItem,
  args: { 'aria-label': 'Согласие' }
};

export default meta;
type Story = StoryObj<typeof CheckboxItem>;

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

export const НеОтмечен: Story = { name: 'В покое' };

/** Узел 125:2384 в Figma — три реальных состояния рядом: невыбран,
 * отмечен, промежуточный. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
      {(
        [
          ['Невыбран', 'unchecked'],
          ['Отмечен', 'checked'],
          ['Промежуточный', 'indeterminate']
        ] as const
      ).map(([name, state]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-8)' }}>
          <CheckboxItem aria-label={name} state={state} />
          <span style={label}>{name}</span>
        </div>
      ))}
    </div>
  )
};

/** Состояния взаимодействия все сразу, без наведения мышью — тот же приём,
 * что у Button: data-state форсирует псевдокласс через переизлучение
 * токенов. */
export const Взаимодействие: Story = {
  render: () => {
    const states = [
      ['обычное', ''],
      ['наведение', 'hover'],
      ['нажатие', 'pressed'],
      ['недоступно', 'disabled']
    ] as const;

    const checkboxStates = ['unchecked', 'checked', 'indeterminate'] as const;

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
            {checkboxStates.map((state) => (
              <tr key={state}>
                <td style={label}>{state}</td>
                {states.map(([stateName, forced]) => (
                  <td key={stateName} data-state={forced || undefined}>
                    <CheckboxItem aria-label={state} state={state} disabled={forced === 'disabled'} />
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
      <CheckboxItem aria-label="Large" state="checked" size="l" />
      <CheckboxItem aria-label="Medium" state="checked" size="m" />
      <CheckboxItem aria-label="Small" state="checked" size="s" />
    </div>
  )
};
