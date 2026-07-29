import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectTag } from './SelectTag';

const meta: Meta<typeof SelectTag> = {
  title: 'Components/SelectTag',
  component: SelectTag,
  args: { label: 'Aurum' }
};

export default meta;
type Story = StoryObj<typeof SelectTag>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  fontFamily: 'var(--font-family-main)'
};

/** Узел 144:10251 в Figma — тег выбранного значения с крестиком-удалением. */
export const ВПокое: Story = { name: 'В покое' };

/** Узел 147:5775 — без крестика, значение закреплено. */
export const Недоступно: Story = {
  name: 'Недоступно',
  args: { disabled: true }
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <SelectTag label="Large" size="l" />
      <SelectTag label="Medium" size="m" />
      <SelectTag label="Small" size="s" />
    </div>
  )
};
