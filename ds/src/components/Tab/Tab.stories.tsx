import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab } from './Tab';
import { Icon } from '../Icon';

const meta: Meta<typeof Tab> = {
  title: 'Components/Tab',
  component: Tab,
  args: { children: 'Label' }
};

export default meta;
type Story = StoryObj<typeof Tab>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

export const ВПокое: Story = { name: 'В покое' };

/** Узел 205:848 в Figma — оба состояния рядом. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-24)' }}>
      <Tab active>Активна</Tab>
      <Tab>Неактивна</Tab>
    </div>
  )
};

export const СИконкой: Story = {
  name: 'С иконкой',
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-24)' }}>
      <Tab active icon={<Icon name="information" />}>
        С иконкой
      </Tab>
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
      <Tab active size="l">
        Large
      </Tab>
      <Tab active size="m">
        Medium
      </Tab>
      <Tab active size="s">
        Small
      </Tab>
    </div>
  )
};
