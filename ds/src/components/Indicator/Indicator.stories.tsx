import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Indicator } from './Indicator';

const meta: Meta<typeof Indicator> = {
  title: 'Components/Indicator',
  component: Indicator,
  args: { count: '1' }
};

export default meta;
type Story = StoryObj<typeof Indicator>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-2)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

export const ВПокое: Story = { name: 'В покое' };

/** Узел 183:7837 в Figma — три темы, с числом и точкой. */
export const Темы: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
        <Indicator view="accent" count="1" />
        <Indicator view="neutral" count="1" />
        <Indicator view="light" count="1" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
        <Indicator view="accent" dot />
        <Indicator view="neutral" dot />
        <Indicator view="light" dot />
      </div>
    </div>
  )
};

export const ДлинноеЧисло: Story = {
  name: 'Длинное число',
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Indicator count="1" />
      <Indicator count="12" />
      <Indicator count="99+" />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Indicator count="1" size="l" />
      <Indicator count="1" size="m" />
      <Indicator count="1" size="s" />
    </div>
  )
};
