import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TooltipContent } from './TooltipContent';

const meta: Meta<typeof TooltipContent> = {
  title: 'Components/Tooltip/TooltipContent',
  component: TooltipContent,
  args: { text: 'Tooltip text. Tooltip text. Tooltip text.' }
};

export default meta;
type Story = StoryObj<typeof TooltipContent>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)',
  maxWidth: 240
};

export const Текст: Story = {
  render: (args) => (
    <div style={page}>
      <TooltipContent {...args} preset="text" />
    </div>
  )
};

export const Кастомное: Story = {
  render: () => (
    <div style={page}>
      <TooltipContent preset="custom">
        <button type="button">Действие</button>
      </TooltipContent>
    </div>
  )
};
