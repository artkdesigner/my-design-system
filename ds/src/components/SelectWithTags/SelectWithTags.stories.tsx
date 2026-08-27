import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectWithTags } from './SelectWithTags';

const options = [
  { value: 'aurum', label: 'Aurum' },
  { value: 'berkelium', label: 'Berkelium' },
  { value: 'cerium', label: 'Cerium' },
  { value: 'dubnium', label: 'Dubnium' },
  { value: 'europium', label: 'Europium' }
];

const meta: Meta<typeof SelectWithTags> = {
  title: 'Components/SelectWithTags/SelectWithTags',
  component: SelectWithTags,
  args: { label: 'Label', hint: 'Hint text', placeholder: 'Placeholder', options }
};

export default meta;
type Story = StoryObj<typeof SelectWithTags>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)',
  maxWidth: 320
};

/**
 * Узел 146:1443 в Figma — поле множественного выбора с тегами.
 * Управляемый: сторис хранит value сама, как реальный вызывающий код.
 */
export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={page}>
        <SelectWithTags {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Заполнено: Story = {
  name: 'Заполнено',
  render: (args) => {
    const [value, setValue] = useState(['aurum', 'berkelium']);
    return (
      <div style={page}>
        <SelectWithTags {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

/** Порог сворачивания через maxVisibleTags — «Ещё N» / «Скрыть» появляются,
 * когда выбранных тегов больше порога. */
export const СворачиваниеТегов: Story = {
  name: 'Сворачивание тегов',
  render: (args) => {
    const [value, setValue] = useState(options.map((o) => o.value));
    return (
      <div style={page}>
        <SelectWithTags {...args} value={value} onChange={setValue} maxVisibleTags={2} />
      </div>
    );
  }
};

export const Ошибка: Story = {
  args: { alert: 'error', alertText: 'Выберите хотя бы один элемент' },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={page}>
        <SelectWithTags {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Недоступно: Story = {
  name: 'Недоступно',
  args: { disabled: true },
  render: (args) => (
    <div style={page}>
      <SelectWithTags {...args} defaultValue={['aurum', 'berkelium']} />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <SelectWithTags label="Large" options={options} size="l" defaultValue={['aurum']} />
      <SelectWithTags label="Medium" options={options} size="m" defaultValue={['aurum']} />
      <SelectWithTags label="Small" options={options} size="s" defaultValue={['aurum']} />
    </div>
  )
};
