import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageButton } from './PageButton';

const meta: Meta<typeof PageButton> = {
  title: 'Components/PageButton',
  component: PageButton,
  args: { page: 1 }
};

export default meta;
type Story = StoryObj<typeof PageButton>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)'
};

export const ВПокое: Story = { name: 'В покое', render: (args) => <div style={page}><PageButton {...args} /></div> };

/** Узел 205:5918 в Figma — Selected/обычная/скрытая (…). */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-8)' }}>
      <PageButton page={1} selected />
      <PageButton page={2} />
      <PageButton page={5} hidden />
    </div>
  )
};
