import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PickerButton } from './PickerButton';
import { OptionListCell } from '../OptionListCell';

const meta: Meta<typeof PickerButton> = {
  title: 'Components/PickerButton',
  component: PickerButton
};

export default meta;
type Story = StoryObj<typeof PickerButton>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)',
  minHeight: 260
};

/** Узел 155:3184 в Figma — компактный вид (SingleIcon=Yes) и с подписью
 * (SingleIcon=No) рядом. */
export const ВПокое: Story = {
  name: 'В покое',
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-16)' }}>
      <PickerButton triggerLabel="Действия" />
      <PickerButton label="Label" />
    </div>
  )
};

export const Открыта: Story = {
  name: 'Открыта (со списком)',
  render: () => (
    <div style={page}>
      <PickerButton label="Сортировка" defaultOpen>
        <OptionListCell label="По дате" selected />
        <OptionListCell label="По имени" />
        <OptionListCell label="По размеру" />
      </PickerButton>
    </div>
  )
};

export const Компактная: Story = {
  name: 'Компактная (kebab-меню)',
  render: () => (
    <div style={page}>
      <PickerButton triggerLabel="Действия со строкой">
        <OptionListCell label="Переименовать" />
        <OptionListCell label="Скопировать" />
        <OptionListCell label="Удалить" />
      </PickerButton>
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <PickerButton label="Large" size="l" />
      <PickerButton label="Medium" size="m" />
      <PickerButton label="Small" size="s" />
    </div>
  )
};

export const Недоступна: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-16)' }}>
      <PickerButton label="Label" disabled />
      <PickerButton triggerLabel="Действия" disabled />
    </div>
  )
};
