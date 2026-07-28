import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OptionListHeader } from './OptionListHeader';

const meta: Meta<typeof OptionListHeader> = {
  title: 'Components/OptionList/OptionListHeader',
  component: OptionListHeader
};

export default meta;
type Story = StoryObj<typeof OptionListHeader>;

const page: CSSProperties = {
  background: 'var(--element-bg-lvl-1)',
  fontFamily: 'var(--font-family-main)',
  width: '320px',
  border: 'var(--stroke-1) solid var(--element-border-secondary)',
  borderRadius: 'var(--radius-16)'
};

/** Узел 120:4173 в Figma — preset Search (по умолчанию). */
export const Поиск: Story = {
  render: () => (
    <div style={page}>
      <OptionListHeader />
    </div>
  )
};

/**
 * Узел 120:4175 в Figma — preset SelectAll. Сам чекбокс ничего не знает
 * про список опций, здесь только его собственное переключение состояния;
 * реальная логика «выбрать все ячейки» — в сторис OptionList/OptionList
 * («Выбрать всё»), у которой есть сам список.
 */
export const ВыбратьВсё: Story = {
  name: 'Выбрать всё',
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={page}>
        <OptionListHeader preset="selectAll" state={checked ? 'checked' : 'unchecked'} onClick={() => setChecked((v) => !v)} />
      </div>
    );
  }
};

export const Размеры: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <div style={page}>
        <OptionListHeader size="l" />
      </div>
      <div style={page}>
        <OptionListHeader size="m" />
      </div>
      <div style={page}>
        <OptionListHeader size="s" />
      </div>
    </div>
  )
};
