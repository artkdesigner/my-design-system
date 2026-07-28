import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Согласен с условиями' }
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

export const ВПокое: Story = { name: 'В покое' };

export const СПодсказкой: Story = {
  name: 'С подсказкой',
  args: { hint: 'Можно отозвать согласие в любой момент в настройках профиля' }
};

/** Три реальных состояния CheckboxItem, теперь с подписью. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Checkbox label="Невыбран" state="unchecked" />
      <Checkbox label="Отмечен" state="checked" />
      <Checkbox label="Промежуточный" state="indeterminate" />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Checkbox label="Large" state="checked" size="l" />
      <Checkbox label="Medium" state="checked" size="m" />
      <Checkbox label="Small" state="checked" size="s" />
    </div>
  )
};

export const Недоступен: Story = {
  name: 'Недоступен',
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Checkbox label="Недоступен, не отмечен" disabled />
      <Checkbox label="Недоступен, отмечен" state="checked" disabled />
    </div>
  )
};

/** Узел 125:2409 в Figma — вариант Alert=True: alertText вместо hint. */
export const Ошибка: Story = {
  name: 'Ошибка',
  args: { alert: true, alertText: 'Нужно отметить чекбокс, чтобы продолжить' }
};
