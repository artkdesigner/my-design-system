import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwitchItem } from './SwitchItem';

const meta: Meta<typeof SwitchItem> = {
  title: 'Components/SwitchItem',
  component: SwitchItem,
  args: { 'aria-label': 'Уведомления' }
};

export default meta;
type Story = StoryObj<typeof SwitchItem>;

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

export const ВПокое: Story = { name: 'В покое' };

/** Узел 169:2319 в Figma — оба состояния рядом. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
      {(
        [
          ['Выключен', false],
          ['Включён', true]
        ] as const
      ).map(([name, checked]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-8)' }}>
          <SwitchItem aria-label={name} checked={checked} />
          <span style={label}>{name}</span>
        </div>
      ))}
    </div>
  )
};

/** Три размера рядом — проверка режимов ComponentSize. */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <SwitchItem aria-label="Large" checked size="l" />
      <SwitchItem aria-label="Medium" checked size="m" />
      <SwitchItem aria-label="Small" checked size="s" />
    </div>
  )
};

export const Недоступен: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <SwitchItem aria-label="Недоступен, выключен" disabled />
      <SwitchItem aria-label="Недоступен, включён" checked disabled />
    </div>
  )
};
