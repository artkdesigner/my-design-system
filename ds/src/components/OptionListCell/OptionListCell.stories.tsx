import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OptionListCell } from './OptionListCell';

const meta: Meta<typeof OptionListCell> = {
  title: 'Components/OptionList/OptionListCell',
  component: OptionListCell,
  args: { label: 'Label' }
};

export default meta;
type Story = StoryObj<typeof OptionListCell>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  fontFamily: 'var(--font-family-main)',
  width: '320px'
};

export const ВПокое: Story = { name: 'В покое' };

export const Выбрана: Story = {
  name: 'Выбрана',
  args: { selected: true }
};

/** Узел 120:9328 в Figma — список опций с одиночным выбором. */
export const Список: Story = {
  name: 'Список',
  render: () => {
    const options = ['Первая', 'Вторая', 'Третья'];
    const [selected, setSelected] = useState(options[0]);
    return (
      <div style={page}>
        {options.map((option) => (
          <OptionListCell key={option} label={option} selected={selected === option} onClick={() => setSelected(option)} />
        ))}
      </div>
    );
  }
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <OptionListCell label="Large" selected size="l" />
      <OptionListCell label="Medium" selected size="m" />
      <OptionListCell label="Small" selected size="s" />
    </div>
  )
};
