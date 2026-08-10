import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch/Switch',
  component: Switch,
  args: { label: 'Push-уведомления' }
};

export default meta;
type Story = StoryObj<typeof Switch>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

export const ВПокое: Story = { name: 'В покое' };

export const СПодсказкой: Story = {
  name: 'С подсказкой',
  args: { hint: 'Придут даже при отключённом звуке' }
};

/** Узел 169:3099 в Figma — Reverse=No/Yes. */
export const Реверс: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)', width: 320 }}>
      <Switch label="Пилюля перед подписью" hint="Reverse = No" />
      <Switch label="Пилюля после подписи" hint="Reverse = Yes" reverse />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Switch label="Large" checked size="l" />
      <Switch label="Medium" checked size="m" />
      <Switch label="Small" checked size="s" />
    </div>
  )
};

export const Недоступен: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Switch label="Недоступен, выключен" disabled />
      <Switch label="Недоступен, включён" checked disabled />
    </div>
  )
};
