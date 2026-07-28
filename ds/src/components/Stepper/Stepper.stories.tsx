import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  args: { value: 5, min: 0, max: 10 }
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-2)',
  fontFamily: 'var(--font-family-main)'
};

/** Управляемый компонент — сторис держит value сама, как реальный вызывающий код. */
export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div style={page}>
        <Stepper {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

/** Узел 144:2936 в Figma — три состояния: Min, Middle, Max. */
export const Состояния: Story = {
  name: 'Состояния',
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Stepper value={0} min={0} max={10} />
      <Stepper value={5} min={0} max={10} />
      <Stepper value={10} min={0} max={10} />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Stepper value={5} min={0} max={10} size="l" />
      <Stepper value={5} min={0} max={10} size="m" />
      <Stepper value={5} min={0} max={10} size="s" />
    </div>
  )
};
