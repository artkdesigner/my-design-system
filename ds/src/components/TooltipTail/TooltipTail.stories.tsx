import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TooltipTail } from './TooltipTail';

const meta: Meta<typeof TooltipTail> = {
  title: 'Components/Tooltip/TooltipTail',
  component: TooltipTail
};

export default meta;
type Story = StoryObj<typeof TooltipTail>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-2)',
  fontFamily: 'var(--font-family-main)'
};

export const ВПокое: Story = { name: 'В покое' };

/** Узел 181:987 в Figma — все три положения рядом, в растянутом на всю
 * высоту треке (align-self: stretch), чтобы Start/End было видно. */
export const Положения: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'stretch', gap: 'var(--margin-24)', height: 120 }}>
      <TooltipTail position="start" />
      <TooltipTail position="middle" />
      <TooltipTail position="end" />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)', height: 40 }}>
      <TooltipTail size="l" />
      <TooltipTail size="m" />
      <TooltipTail size="s" />
    </div>
  )
};
