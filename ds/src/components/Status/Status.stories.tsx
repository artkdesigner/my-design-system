import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Status } from './Status';
import { Icon } from '../Icon';

const meta: Meta<typeof Status> = {
  title: 'Components/Status',
  component: Status,
  args: { label: 'Label' }
};

export default meta;
type Story = StoryObj<typeof Status>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

export const ВПокое: Story = { name: 'В покое' };

/** Узел 183:4991 и соседние в Figma — четыре сочетания tone × accent. */
export const Тоны: Story = {
  name: 'Тоны',
  render: () => (
    <div style={{ ...page, display: 'flex', flexWrap: 'wrap', gap: 'var(--margin-16)' }}>
      <Status label="Message" tone="message" />
      <Status label="Custom" tone="custom" />
      <Status label="Message" tone="message" accent />
      <Status label="Custom" tone="custom" accent />
    </div>
  )
};

export const СAddon: Story = {
  name: 'С addon',
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-16)' }}>
      <Status label="Message" addon={<Icon name="check" />} />
      <Status label="Custom" tone="custom" accent addon={<Icon name="check" />} />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Status label="Large" size="l" />
      <Status label="Medium" size="m" />
      <Status label="Small" size="s" />
    </div>
  )
};
