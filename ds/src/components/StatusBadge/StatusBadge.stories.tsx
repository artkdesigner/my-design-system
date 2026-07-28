import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  args: { icon: 'information-circle-contained', status: 'info' }
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

/** Четыре смысловых статуса — иконку под каждый выбирает вызывающий код,
 * единого «default icon на статус» набора в icons.generated.ts нет. */
export const Статусы: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
      {(
        [
          ['Info', 'information-circle-contained', 'info'],
          ['Success', 'check-contained', 'success'],
          ['Warning', 'alert-triangle', 'warning'],
          ['Error', 'x-circle-contained', 'error']
        ] as const
      ).map(([name, icon, status]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-8)' }}>
          <StatusBadge icon={icon} status={status} />
          <span style={label}>{name}</span>
        </div>
      ))}
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <StatusBadge icon="check-contained" status="success" size="l" />
      <StatusBadge icon="check-contained" status="success" size="m" />
      <StatusBadge icon="check-contained" status="success" size="s" />
    </div>
  )
};
