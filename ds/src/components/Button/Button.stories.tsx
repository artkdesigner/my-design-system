import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Label' }
};

export default meta;
type Story = StoryObj<typeof Button>;

const VIEWS = ['accent', 'primary', 'secondary'] as const;

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

export const СИконками: Story = {
  args: { iconLeft: <PlusIcon />, iconRight: <PlusIcon /> }
};

export const ТолькоИконка: Story = {
  args: { children: null, iconLeft: <PlusIcon />, 'aria-label': 'Добавить' }
};

/** Полная матрица для сверки с макетом: 3 вида × ghost × danger. */
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
              ['danger', { danger: true }],
              ['ghost + danger', { ghost: true, danger: true }]
            ] as const
          ).map(([name, props]) => (
            <tr key={name}>
              <td style={label}>{name}</td>
              {VIEWS.map((view) => (
                <td key={view}>
                  <Button view={view} {...props}>
                    Label
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

/**
 * Состояния все сразу, без наведения мышью. Работает потому, что каждое
 * состояние объявлено парой селекторов: псевдокласс для настоящего
 * взаимодействия и атрибут для принудительного показа. Атрибут ставится
 * на обёртку — кнопка внутри получает значения по наследованию.
 *
 * Это же и проверка составных селекторов переизлучения: опасная кнопка
 * в столбце «наведение» обязана остаться красной, а не посинеть.
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
            {[...VIEWS.map((view) => [view, { view }] as const), ['danger', { danger: true }] as const].map(
              ([name, props]) => (
                <tr key={name}>
                  <td style={label}>{name}</td>
                  {states.map(([stateName, state]) => (
                    <td key={stateName} data-state={state || undefined}>
                      <Button {...props} disabled={state === 'disabled'}>
                        Label
                      </Button>
                    </td>
                  ))}
                </tr>
              )
            )}
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
      <Button size="l">Large</Button>
      <Button size="m">Medium</Button>
      <Button size="s">Small</Button>
    </div>
  )
};
