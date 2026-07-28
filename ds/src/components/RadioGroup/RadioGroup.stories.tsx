import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './RadioGroup';
import { Radio } from '../Radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  args: { title: 'Способ оплаты' }
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

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
      <RadioGroup {...args}>
        <Radio label="Картой" selected />
        <Radio label="Наличными" />
        <Radio label="СБП" />
      </RadioGroup>
    </div>
  )
};

export const СПодсказкой: Story = {
  name: 'С подсказкой',
  render: (args) => (
    <div style={page}>
      <RadioGroup {...args} hint="Спишется сразу после подтверждения заказа">
        <Radio label="Картой" selected />
        <Radio label="Наличными" />
      </RadioGroup>
    </div>
  )
};

export const Ошибка: Story = {
  name: 'Ошибка',
  render: (args) => (
    <div style={page}>
      <RadioGroup {...args} alert alertText="Выберите способ оплаты">
        <Radio label="Картой" />
        <Radio label="Наличными" />
      </RadioGroup>
    </div>
  )
};

export const БезЗаголовка: Story = {
  name: 'Без заголовка',
  render: () => (
    <div style={page}>
      <RadioGroup>
        <Radio label="Картой" selected />
        <Radio label="Наличными" />
      </RadioGroup>
    </div>
  )
};

/** Много пунктов — проверка переноса строк (flex-wrap, оба зазора сразу). */
export const Перенос: Story = {
  name: 'Перенос строк',
  render: (args) => (
    <div style={{ ...page, width: 360 }}>
      <RadioGroup {...args}>
        <Radio label="Понедельник" selected />
        <Radio label="Вторник" />
        <Radio label="Среда" />
        <Radio label="Четверг" />
        <Radio label="Пятница" />
      </RadioGroup>
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)' }}>
      <RadioGroup title="Large" size="l">
        <Radio size="l" label="Картой" selected />
        <Radio size="l" label="Наличными" />
      </RadioGroup>
      <RadioGroup title="Medium" size="m">
        <Radio size="m" label="Картой" selected />
        <Radio size="m" label="Наличными" />
      </RadioGroup>
      <RadioGroup title="Small" size="s">
        <Radio size="s" label="Картой" selected />
        <Radio size="s" label="Наличными" />
      </RadioGroup>
    </div>
  )
};
