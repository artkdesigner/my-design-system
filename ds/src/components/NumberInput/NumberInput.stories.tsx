import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  args: { label: 'Label', hint: 'Hint text', min: 0, max: 10 }
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)',
  maxWidth: 320
};

/**
 * Узел 144:2671 в Figma — Input с готовым Stepper во встроенном слоте.
 * Управляемый: сторис хранит value сама, как реальный вызывающий код.
 */
export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => {
    const [value, setValue] = useState(5);
    return (
      <div style={page}>
        <NumberInput {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Ошибка: Story = {
  args: { alert: 'error', alertText: 'Введите количество от 0 до 10' },
  render: (args) => {
    const [value, setValue] = useState(0);
    return (
      <div style={page}>
        <NumberInput {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const Недоступно: Story = {
  name: 'Недоступно',
  args: { disabled: true },
  render: (args) => (
    <div style={page}>
      <NumberInput {...args} value={5} />
    </div>
  )
};

/** Границы диапазона — кнопки степпера отключаются на Min/Max, как в макете. */
export const Границы: Story = {
  name: 'Границы диапазона',
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <NumberInput label="Min" value={0} min={0} max={10} />
      <NumberInput label="Middle" value={5} min={0} max={10} />
      <NumberInput label="Max" value={10} min={0} max={10} />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <NumberInput label="Large" value={5} min={0} max={10} size="l" />
      <NumberInput label="Medium" value={5} min={0} max={10} size="m" />
      <NumberInput label="Small" value={5} min={0} max={10} size="s" />
    </div>
  )
};
