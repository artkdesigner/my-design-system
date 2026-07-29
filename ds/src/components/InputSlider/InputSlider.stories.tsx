import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputSlider } from './InputSlider';

const meta: Meta<typeof InputSlider> = {
  title: 'Components/InputSlider',
  component: InputSlider,
  args: { label: 'Label', hint: 'Hint text', min: 1, max: 10 }
};

export default meta;
type Story = StoryObj<typeof InputSlider>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)',
  maxWidth: 320
};

/**
 * Узел 154:2026 в Figma — Input с готовым Slider сразу под полем.
 * Управляемый: сторис хранит value сама, как реальный вызывающий код.
 */
export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => {
    const [value, setValue] = useState(4);
    return (
      <div style={page}>
        <InputSlider {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Ошибка: Story = {
  args: { alert: true, alertText: 'Выберите значение от 1 до 10' },
  render: (args) => {
    const [value, setValue] = useState(1);
    return (
      <div style={page}>
        <InputSlider {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Недоступно: Story = {
  name: 'Недоступно',
  args: { disabled: true },
  render: (args) => (
    <div style={page}>
      <InputSlider {...args} value={4} />
    </div>
  )
};

export const БезДелений: Story = {
  name: 'Без делений',
  render: (args) => {
    const [value, setValue] = useState(4);
    return (
      <div style={page}>
        <InputSlider {...args} pips={false} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)' }}>
      <InputSlider label="Large" min={1} max={10} value={4} size="l" />
      <InputSlider label="Medium" min={1} max={10} value={4} size="m" />
      <InputSlider label="Small" min={1} max={10} value={4} size="s" />
    </div>
  )
};
