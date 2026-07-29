import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ValueList, type ValueListItem } from './ValueList';

const items: ValueListItem[] = [
  { value: 'aurum', label: 'Aurum' },
  { value: 'berkelium', label: 'Berkelium' },
  { value: 'cerium', label: 'Cerium' },
  { value: 'dubnium', label: 'Dubnium' },
  { value: 'europium', label: 'Europium' }
];

const meta: Meta<typeof ValueList> = {
  title: 'Components/ValueList',
  component: ValueList,
  args: { items }
};

export default meta;
type Story = StoryObj<typeof ValueList>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  fontFamily: 'var(--font-family-main)',
  maxWidth: 320
};

/** Узел 147:8755, Collapsed=Yes — без порога список просто переносит строки. */
export const БезСворачивания: Story = {
  name: 'Без сворачивания',
  render: (args) => {
    const [list, setList] = useState(items);
    return (
      <div style={page}>
        <ValueList {...args} items={list} onRemove={(value) => setList((prev) => prev.filter((i) => i.value !== value))} />
      </div>
    );
  }
};

/** С порогом maxVisible — тот же узел, оба состояния Collapsed=Yes/No,
 * переключаемые через TagControl «Ещё N» / «Скрыть». */
export const Сворачивание: Story = {
  args: { maxVisible: 2 },
  render: (args) => (
    <div style={page}>
      <ValueList {...args} />
    </div>
  )
};

export const Недоступно: Story = {
  name: 'Недоступно',
  args: { maxVisible: 2, disabled: true },
  render: (args) => (
    <div style={page}>
      <ValueList {...args} />
    </div>
  )
};
