import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionButton } from './ActionButton';

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta: Meta<typeof ActionButton> = {
  title: 'Components/ActionButton',
  component: ActionButton,
  args: { icon: <PlusIcon />, children: 'Label' }
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

const VIEWS = ['accent', 'primary'] as const;

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
  textAlign: 'left',
  fontWeight: 'var(--font-weight-regular)',
  whiteSpace: 'nowrap'
};

export const Обычная: Story = {};

export const Ghost: Story = {
  args: { ghost: true }
};

/** Матрица для сверки с макетом: 2 вида × обычная/ghost/тон сообщения. */
export const Матрица: Story = {
  render: () => (
    <div style={page}>
      <table style={{ borderSpacing: 'var(--margin-12)' }}>
        <thead>
          <tr>
            <th />
            {VIEWS.map((view) => (
              <th key={view} style={label}>
                {view}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(
            [
              ['обычная', {}],
              ['ghost', { ghost: true }],
              ['message=error', { message: 'error' }],
              ['ghost + message', { ghost: true, message: 'error' }]
            ] as const
          ).map(([name, props]) => (
            <tr key={name}>
              <td style={label}>{name}</td>
              {VIEWS.map((view) => (
                <td key={view}>
                  <ActionButton view={view} icon={<PlusIcon />} {...props}>
                    Label
                  </ActionButton>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

/** Три размера рядом — проверка режимов ComponentSize. */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'flex-start', gap: 'var(--margin-16)' }}>
      <ActionButton size="l" icon={<PlusIcon />}>
        Large
      </ActionButton>
      <ActionButton size="m" icon={<PlusIcon />}>
        Medium
      </ActionButton>
      <ActionButton size="s" icon={<PlusIcon />}>
        Small
      </ActionButton>
    </div>
  )
};
