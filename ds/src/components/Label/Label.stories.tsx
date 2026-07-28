import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './Label';
import { Icon } from '../Icon';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  args: { label: 'Label' }
};

export default meta;
type Story = StoryObj<typeof Label>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

export const ВПокое: Story = { name: 'В покое' };

export const СПодсказкой: Story = {
  name: 'С подсказкой',
  args: { hint: 'Hint' }
};

export const СAddon: Story = {
  name: 'С addon',
  args: {
    hint: 'Hint',
    leftAddon: <Icon name="check" aria-hidden="true" />,
    rightAddon: <Icon name="check" aria-hidden="true" />
  }
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Label label="Large" hint="Hint" size="l" />
      <Label label="Medium" hint="Hint" size="m" />
      <Label label="Small" hint="Hint" size="s" />
    </div>
  )
};

/** Узел 78:3702 в Figma — подпись, связанная с полем через htmlFor. */
export const СПолем: Story = {
  name: 'С полем',
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-8)', alignItems: 'flex-start' }}>
      <Label label="Имя" hint="Как в паспорте" htmlFor="story-name" />
      <input id="story-name" style={{ font: 'inherit' }} />
    </div>
  )
};
