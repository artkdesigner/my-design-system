import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  args: { title: 'Title', caption: 'Caption', buttonLabel: 'Button' }
};

export default meta;
type Story = StoryObj<typeof Toast>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  width: 420
};

export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => (
    <div style={page}>
      <Toast {...args} onButtonClick={() => {}} onClose={() => {}} />
    </div>
  )
};

/** Узел 209:670 в Figma — оба вида, полный набор слотов и без них. */
export const Виды: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Toast view="neutral" title="Title" caption="Caption" buttonLabel="Button" onButtonClick={() => {}} onClose={() => {}} />
      <Toast view="alert" title="Title" caption="Caption" buttonLabel="Button" onButtonClick={() => {}} onClose={() => {}} />
      <Toast view="neutral" title="Без кнопки и без крестика" />
      <Toast view="alert" title="Без caption" onClose={() => {}} />
    </div>
  )
};
