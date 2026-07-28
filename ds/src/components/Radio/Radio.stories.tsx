import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  args: { label: 'Оплата картой' }
};

export default meta;
type Story = StoryObj<typeof Radio>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

export const ВПокое: Story = { name: 'В покое' };

export const СПодсказкой: Story = {
  name: 'С подсказкой',
  args: { hint: 'Спишется сразу после подтверждения заказа' }
};

export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Radio label="Не выбран" />
      <Radio label="Выбран" selected />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Radio label="Large" selected size="l" />
      <Radio label="Medium" selected size="m" />
      <Radio label="Small" selected size="s" />
    </div>
  )
};

export const Недоступен: Story = {
  name: 'Недоступен',
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Radio label="Недоступен, не выбран" disabled />
      <Radio label="Недоступен, выбран" selected disabled />
    </div>
  )
};
