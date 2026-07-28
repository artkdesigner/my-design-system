import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge, type StatusBadgeType } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  args: { type: 'positiveCheck' }
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

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

export const ВПокое: Story = { name: 'В покое' };

/** Все девять вариантов узла 181:1850 — у каждого своя пара иконка+цвет,
 * не свободный выбор. */
export const Типы: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexWrap: 'wrap', gap: 'var(--margin-24)' }}>
      {(
        [
          'positiveCheck',
          'negativeCross',
          'neutralCross',
          'negativeAlert',
          'warningAlert',
          'infoNeutral',
          'infoAccent',
          'operation',
          'stop'
        ] as StatusBadgeType[]
      ).map((type) => (
        <div key={type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-8)' }}>
          <StatusBadge type={type} />
          <span style={label}>{type}</span>
        </div>
      ))}
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <StatusBadge type="positiveCheck" size="l" />
      <StatusBadge type="positiveCheck" size="m" />
      <StatusBadge type="positiveCheck" size="s" />
    </div>
  )
};
