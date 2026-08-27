import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  args: { icon: <PlusIcon />, 'aria-label': 'Добавить' }
};

export default meta;
type Story = StoryObj<typeof IconButton>;

const VIEWS = ['accent', 'primary', 'secondary', 'alert'] as const;

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

export const Обычная: Story = { name: 'В покое' };

/** Четыре вида — проверка со скриншотом узла 124:2304: ни у одного нет
 * заливки, различается только цвет самой иконки. */
export const Виды: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      {VIEWS.map((view) => (
        <div key={view} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-8)' }}>
          <IconButton view={view} icon={<PlusIcon />} aria-label={view} />
          <span style={label}>{view}</span>
        </div>
      ))}
    </div>
  )
};

/**
 * Состояния все сразу, без наведения мышью — тот же приём, что у Button:
 * атрибут data-state форсирует псевдокласс через переизлучение токенов.
 */
export const Состояния: Story = {
  render: () => {
    const states = [
      ['обычное', ''],
      ['наведение', 'hover'],
      ['нажатие', 'pressed'],
      ['недоступно', 'disabled']
    ] as const;

    return (
      <div style={page}>
        <table style={{ borderSpacing: 'var(--margin-12)' }}>
          <thead>
            <tr>
              <th />
              {states.map(([name]) => (
                <th key={name} style={label}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VIEWS.map((view) => (
              <tr key={view}>
                <td style={label}>{view}</td>
                {states.map(([stateName, state]) => (
                  <td key={stateName} data-state={state || undefined}>
                    <IconButton view={view} icon={<PlusIcon />} aria-label={view} disabled={state === 'disabled'} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

/** Три размера рядом — проверка режимов ComponentSize. */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <IconButton size="l" icon={<PlusIcon />} aria-label="Large" />
      <IconButton size="m" icon={<PlusIcon />} aria-label="Medium" />
      <IconButton size="s" icon={<PlusIcon />} aria-label="Small" />
    </div>
  )
};
