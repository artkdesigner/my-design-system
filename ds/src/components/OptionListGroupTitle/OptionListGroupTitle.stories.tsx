import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OptionListGroupTitle } from './OptionListGroupTitle';

const meta: Meta<typeof OptionListGroupTitle> = {
  title: 'Components/OptionList/OptionListGroupTitle',
  component: OptionListGroupTitle
};

export default meta;
type Story = StoryObj<typeof OptionListGroupTitle>;

const page: CSSProperties = {
  background: 'var(--element-bg-lvl-1)',
  fontFamily: 'var(--font-family-main)',
  width: '320px',
  border: 'var(--stroke-1) solid var(--element-border-secondary)',
  borderRadius: 'var(--radius-16)'
};

/** Узел 120:9178 в Figma — заголовок группы опций внутри OptionList. */
export const ВПокое: Story = {
  name: 'В покое',
  render: () => (
    <div style={page}>
      <OptionListGroupTitle title="Категория" />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--margin-16)', alignItems: 'flex-start' }}>
      {(['l', 'm', 's'] as const).map((size) => (
        <div key={size} style={{ ...page, width: '260px' }}>
          <OptionListGroupTitle title="Категория" size={size} />
        </div>
      ))}
    </div>
  )
};
