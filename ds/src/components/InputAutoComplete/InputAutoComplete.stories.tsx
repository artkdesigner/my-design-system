import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputAutoComplete } from './InputAutoComplete';

const options = [
  { value: 'ru', label: 'Россия' },
  { value: 'by', label: 'Беларусь' },
  { value: 'kz', label: 'Казахстан' },
  { value: 'am', label: 'Армения' },
  { value: 'uz', label: 'Узбекистан' }
];

const meta: Meta<typeof InputAutoComplete> = {
  title: 'Components/InputAutoComplete',
  component: InputAutoComplete,
  args: { label: 'Страна', hint: 'Hint text', options }
};

export default meta;
type Story = StoryObj<typeof InputAutoComplete>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)',
  maxWidth: 320
};

/**
 * Узел 153:9902 в Figma — Input с выпадающим OptionList, пока поле в фокусе.
 * Управляемый: сторис хранит value сама, как реальный вызывающий код.
 */
export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={page}>
        <InputAutoComplete {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Заполнено: Story = {
  name: 'Заполнено',
  render: (args) => {
    const [value, setValue] = useState('Казахстан');
    return (
      <div style={page}>
        <InputAutoComplete {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Ошибка: Story = {
  args: { alert: true, alertText: 'Выберите страну из списка' },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={page}>
        <InputAutoComplete {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Недоступно: Story = {
  name: 'Недоступно',
  args: { disabled: true },
  render: (args) => (
    <div style={page}>
      <InputAutoComplete {...args} defaultValue="Россия" />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <InputAutoComplete label="Large" options={options} size="l" />
      <InputAutoComplete label="Medium" options={options} size="m" />
      <InputAutoComplete label="Small" options={options} size="s" />
    </div>
  )
};
