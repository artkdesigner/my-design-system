import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Segment } from './Segment';

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const meta: Meta<typeof Segment> = {
  title: 'Components/SegmentedControl/Segment',
  component: Segment,
  args: { children: 'Label' }
};

export default meta;
type Story = StoryObj<typeof Segment>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

export const НеВыбран: Story = { name: 'Не выбран' };

export const Выбран: Story = { args: { selected: true } };

export const СИконками: Story = {
  name: 'Текст + иконки',
  args: { iconLeft: <PinIcon />, iconRight: <PinIcon /> }
};

export const ТолькоИконка: Story = {
  name: 'Только иконка',
  args: { children: null, iconLeft: <PinIcon />, 'aria-label': 'Метка' }
};

/** Узел 170:2952 в Figma — четыре варианта: selected × icon only. */
export const Матрица: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <div style={{ display: 'flex', gap: 'var(--margin-8)' }}>
        <Segment selected iconLeft={<PinIcon />}>
          Label
        </Segment>
        <Segment selected iconLeft={<PinIcon />} aria-label="Метка" />
      </div>
      <div style={{ display: 'flex', gap: 'var(--margin-8)' }}>
        <Segment iconLeft={<PinIcon />}>Label</Segment>
        <Segment iconLeft={<PinIcon />} aria-label="Метка" />
      </div>
    </div>
  )
};

/** Три размера рядом — проверка режимов ComponentSize. */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Segment size="l" selected>
        Large
      </Segment>
      <Segment size="m" selected>
        Medium
      </Segment>
      <Segment size="s" selected>
        Small
      </Segment>
    </div>
  )
};
