import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkmark } from './Checkmark';

const meta: Meta<typeof Checkmark> = {
  title: 'Components/Checkmark',
  component: Checkmark
};

export default meta;
type Story = StoryObj<typeof Checkmark>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

const label: CSSProperties = {
  fontFamily: 'var(--font-family-code)',
  fontSize: 'var(--font-size-hint-m)',
  color: 'var(--element-text-secondary)',
  textAlign: 'center',
  fontWeight: 'var(--font-weight-regular)'
};

export const НеОтмечена: Story = { name: 'В покое' };

export const Отмечена: Story = { name: 'Выбрана', args: { selected: true } };

/** Узел 120:666 в Figma — Selected=True/False рядом. Невыбранная не
 * исчезает, а гаснет до 10%, чтобы список не менял высоту при выборе. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
      {(
        [
          ['Выбрана', true],
          ['Не выбрана', false]
        ] as const
      ).map(([name, selected]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-8)' }}>
          <Checkmark selected={selected} />
          <span style={label}>{name}</span>
        </div>
      ))}
    </div>
  )
};

/** Три размера рядом — проверка режимов ComponentSize. */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Checkmark selected size="l" />
      <Checkmark selected size="m" />
      <Checkmark selected size="s" />
    </div>
  )
};
