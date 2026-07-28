import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxGroup } from './CheckboxGroup';
import { Checkbox } from '../Checkbox';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  args: { title: 'Каналы уведомлений' }
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => (
    <div style={page}>
      <CheckboxGroup {...args}>
        <Checkbox label="Почта" state="checked" />
        <Checkbox label="SMS" />
        <Checkbox label="Push-уведомления" state="checked" />
      </CheckboxGroup>
    </div>
  )
};

export const СПодсказкой: Story = {
  name: 'С подсказкой',
  render: (args) => (
    <div style={page}>
      <CheckboxGroup {...args} hint="Выберите хотя бы один канал">
        <Checkbox label="Почта" />
        <Checkbox label="SMS" />
      </CheckboxGroup>
    </div>
  )
};

export const Ошибка: Story = {
  name: 'Ошибка',
  render: (args) => (
    <div style={page}>
      <CheckboxGroup {...args} alert alertText="Нужно выбрать хотя бы один канал">
        <Checkbox label="Почта" />
        <Checkbox label="SMS" />
      </CheckboxGroup>
    </div>
  )
};

export const БезЗаголовка: Story = {
  name: 'Без заголовка',
  render: () => (
    <div style={page}>
      <CheckboxGroup>
        <Checkbox label="Почта" state="checked" />
        <Checkbox label="SMS" />
      </CheckboxGroup>
    </div>
  )
};

/** Много пунктов — проверка переноса строк (flex-wrap, оба зазора сразу). */
export const Перенос: Story = {
  name: 'Перенос строк',
  render: (args) => (
    <div style={{ ...page, width: 360 }}>
      <CheckboxGroup {...args}>
        <Checkbox label="Понедельник" />
        <Checkbox label="Вторник" />
        <Checkbox label="Среда" />
        <Checkbox label="Четверг" />
        <Checkbox label="Пятница" />
        <Checkbox label="Суббота" />
        <Checkbox label="Воскресенье" />
      </CheckboxGroup>
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)' }}>
      <CheckboxGroup title="Large" size="l">
        <Checkbox size="l" label="Почта" state="checked" />
        <Checkbox size="l" label="SMS" />
      </CheckboxGroup>
      <CheckboxGroup title="Medium" size="m">
        <Checkbox size="m" label="Почта" state="checked" />
        <Checkbox size="m" label="SMS" />
      </CheckboxGroup>
      <CheckboxGroup title="Small" size="s">
        <Checkbox size="s" label="Почта" state="checked" />
        <Checkbox size="s" label="SMS" />
      </CheckboxGroup>
    </div>
  )
};
