import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OptionListEmptyState } from './OptionListEmptyState';

const meta: Meta<typeof OptionListEmptyState> = {
  title: 'Components/OptionList/OptionListEmptyState',
  component: OptionListEmptyState
};

export default meta;
type Story = StoryObj<typeof OptionListEmptyState>;

const page: CSSProperties = {
  background: 'var(--element-bg-lvl-1)',
  fontFamily: 'var(--font-family-main)',
  width: '320px',
  border: 'var(--stroke-1) solid var(--element-border-secondary)',
  borderRadius: 'var(--radius-16)'
};

/**
 * Узел 120:9181 в Figma — состояние, когда поиск в OptionListHeader не
 * дал совпадений: показывается вместо ряда OptionListCell.
 */
export const ВПокое: Story = {
  name: 'В покое',
  render: () => (
    <div style={page}>
      <OptionListEmptyState />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--margin-16)', alignItems: 'flex-start' }}>
      {(['l', 'm', 's'] as const).map((size) => (
        <div key={size} style={{ ...page, width: '260px' }}>
          <OptionListEmptyState size={size} />
        </div>
      ))}
    </div>
  )
};
