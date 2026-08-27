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

export const Обычная: Story = { name: 'В покое' };

export const СИконками: Story = {
  name: 'Текст + аддон',
  args: { iconLeft: <PlusIcon />, iconRight: <PlusIcon /> }
};

export const ТолькоИконка: Story = {
  name: 'Только аддон',
  args: { children: null, iconLeft: <PlusIcon />, 'aria-label': 'Добавить' }
};

/** Полная матрица для сверки с макетом: 3 вида × ghost × тон сообщения. */
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
              ['alert=error', { alert: 'error' }],
              ['ghost + alert', { ghost: true, alert: 'error' }]
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
 * Это же и проверка составных селекторов переизлучения: кнопка с тоном error
 * в столбце «наведение» обязана остаться красной, а не посинеть в info.
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
            {[
              ...VIEWS.map((view) => [view, { view }] as const),
              ['alert=error', { alert: 'error' }] as const
            ].map(
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

/**
 * Loading по всем трём видам — сверка с матрицей состояний из макета
 * (узлы 468:6501 accent, 478:12529 primary, 478:12621 secondary): заливка
 * та же, что в покое, меняется только содержимое на Spinner.
 */
export const Загрузка: Story = {
  name: 'Loading',
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-16)' }}>
      {VIEWS.map((view) => (
        <Button key={view} view={view} loading>
          Label
        </Button>
      ))}
    </div>
  )
};

/**
 * Четыре тона сообщения, залитые и прозрачные. Компонент про сами цвета не
 * знает: проп alert выбирает режим коллекции ColorsMessage, значения
 * приходят из токенов.
 *
 * Тон стоит на самой кнопке, а не на контейнере вокруг неё, и это не
 * косметика: с контейнера тон переживает покой, но под наведением
 * сбрасывается в info — переизлучение слоя сообщений в .ds-interactive:hover
 * объявляет его умолчательный режим.
 */
export const Тоны: Story = {
  name: 'Тип сообщения',
  render: () => {
    const tones = ['info', 'success', 'warning', 'error'] as const;

    return (
      <div style={page}>
        <table style={{ borderSpacing: 'var(--margin-12)' }}>
          <thead>
            <tr>
              <th />
              {tones.map((tone) => (
                <th key={tone} style={label}>
                  {tone}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              [
                ['залитая', {}],
                ['ghost', { ghost: true }]
              ] as const
            ).map(([name, props]) => (
              <tr key={name}>
                <td style={label}>{name}</td>
                {tones.map((tone) => (
                  <td key={tone}>
                    <Button {...props} alert={tone}>
                      Label
                    </Button>
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
      <Button size="l">Large</Button>
      <Button size="m">Medium</Button>
      <Button size="s">Small</Button>
    </div>
  )
};
