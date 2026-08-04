import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider
};

export default meta;
type Story = StoryObj<typeof Divider>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

/** Узлы 256:597/256:598 в Figma — обе ориентации. */
export const ВПокое: Story = {
  name: 'В покое',
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)' }}>
      <div style={{ width: 200 }}>
        <Divider />
      </div>
      <div style={{ height: 120, display: 'flex' }}>
        <Divider orientation="vertical" />
      </div>
    </div>
  )
};

export const МеждуЭлементами: Story = {
  name: 'Между элементами',
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', height: 48, gap: 'var(--margin-12)' }}>
      <span>Слева</span>
      <Divider orientation="vertical" />
      <span>Справа</span>
    </div>
  )
};
