import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  args: { min: 1, max: 10 }
};

export default meta;
type Story = StoryObj<typeof Slider>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  fontFamily: 'var(--font-family-main)',
  maxWidth: 320
};

/** Узел 154:1849 в Figma. Управляемый — сторис держит value сама, как реальный вызывающий код. */
export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => {
    const [value, setValue] = useState(4);
    return (
      <div style={page}>
        <Slider {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const БезДелений: Story = {
  name: 'Без делений',
  render: (args) => {
    const [value, setValue] = useState(4);
    return (
      <div style={page}>
        <Slider {...args} pips={false} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Недоступно: Story = {
  name: 'Недоступно',
  render: (args) => (
    <div style={page}>
      <Slider {...args} value={4} disabled />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-32)' }}>
      <Slider min={1} max={10} value={4} size="l" />
      <Slider min={1} max={10} value={4} size="m" />
      <Slider min={1} max={10} value={4} size="s" />
    </div>
  )
};
