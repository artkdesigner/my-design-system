import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  args: { value: 40 }
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  width: 360
};

export const ВПокое: Story = { name: 'В покое', render: (args) => <div style={page}><ProgressBar {...args} /></div> };

/** Узел 188:4631 в Figma — варианты Size=Big/Small. */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)' }}>
      <ProgressBar value={40} size="l" />
      <ProgressBar value={40} size="s" />
    </div>
  )
};

export const Значения: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <ProgressBar value={0} />
      <ProgressBar value={25} />
      <ProgressBar value={75} />
      <ProgressBar value={100} />
    </div>
  )
};
