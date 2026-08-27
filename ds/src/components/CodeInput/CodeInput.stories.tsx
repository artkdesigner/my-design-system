import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeInput } from './CodeInput';

const meta: Meta<typeof CodeInput> = {
  title: 'Components/CodeInput',
  component: CodeInput,
  args: { 'aria-label': 'Код подтверждения' }
};

export default meta;
type Story = StoryObj<typeof CodeInput>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

/** Узел 176:1414 в Figma. Управляемый — сторис держит value сама, как реальный вызывающий код. */
export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={page}>
        <CodeInput {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

export const СЗначением: Story = {
  name: 'Со значением',
  render: (args) => {
    const [value, setValue] = useState('123');
    return (
      <div style={page}>
        <CodeInput {...args} value={value} onChange={setValue} />
      </div>
    );
  }
};

/** Узел 176:1415 в Figma — код набран полностью и не совпал. */
export const Ошибка: Story = {
  render: (args) => {
    const [value, setValue] = useState('00000000');
    return (
      <div style={page}>
        <CodeInput {...args} value={value} onChange={setValue} alert="error" alertText="Alert text" />
      </div>
    );
  }
};

export const Недоступно: Story = {
  render: (args) => (
    <div style={page}>
      <CodeInput {...args} value="123" disabled />
    </div>
  )
};

export const ДругаяДлина: Story = {
  name: 'Другая длина (4 символа)',
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={page}>
        <CodeInput {...args} value={value} onChange={setValue} length={4} />
      </div>
    );
  }
};

export const Размеры: Story = {
  render: (args) => {
    const [values, setValues] = useState({ l: '12', m: '12', s: '12' });
    return (
      <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
        {(['l', 'm', 's'] as const).map((size) => (
          <CodeInput
            key={size}
            {...args}
            size={size}
            value={values[size]}
            onChange={(next) => setValues((prev) => ({ ...prev, [size]: next }))}
          />
        ))}
      </div>
    );
  }
};
