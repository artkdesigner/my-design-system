import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const options = [
  { value: 'ru', label: 'Россия' },
  { value: 'by', label: 'Беларусь' },
  { value: 'kz', label: 'Казахстан' },
  { value: 'am', label: 'Армения' },
  { value: 'uz', label: 'Узбекистан' }
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: { label: 'Label', hint: 'Hint text', options }
};

export default meta;
type Story = StoryObj<typeof Select>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)',
  maxWidth: 320
};

/**
 * Узел 119:3032 в Figma — поле-кнопка с выпадающим OptionList.
 * Управляемый: сторис хранит value сама, как реальный вызывающий код.
 */
export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div style={page}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Заполнено: Story = {
  name: 'Заполнено',
  render: (args) => {
    const [value, setValue] = useState('kz');
    return (
      <div style={page}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Ошибка: Story = {
  args: { alert: true, alertText: 'Выберите страну из списка' },
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div style={page}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Недоступно: Story = {
  name: 'Недоступно',
  args: { disabled: true },
  render: (args) => (
    <div style={page}>
      <Select {...args} defaultValue="ru" />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Select label="Large" options={options} size="l" defaultValue="ru" />
      <Select label="Medium" options={options} size="m" defaultValue="ru" />
      <Select label="Small" options={options} size="s" defaultValue="ru" />
    </div>
  )
};
