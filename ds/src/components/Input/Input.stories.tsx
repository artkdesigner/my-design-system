import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: { label: 'Label', hint: 'Hint text' }
};

export default meta;
type Story = StoryObj<typeof Input>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

const caption: CSSProperties = {
  fontFamily: 'var(--font-family-code)',
  fontSize: 'var(--font-size-hint-m)',
  color: 'var(--element-text-secondary)',
  textAlign: 'left',
  fontWeight: 'var(--font-weight-regular)',
  whiteSpace: 'nowrap'
};

export const Обычное: Story = { name: 'В покое' };

export const СЗначением: Story = {
  args: { defaultValue: 'Value' }
};

export const СПлейсхолдером: Story = {
  args: { placeholder: 'Placeholder' }
};

export const САддонами: Story = {
  args: { leftAddon: <PinIcon />, rightAddon: <PinIcon /> }
};

export const Ошибка: Story = {
  args: { alert: 'error', alertText: 'Alert text' }
};

export const Недоступно: Story = {
  args: { disabled: true, defaultValue: 'Value' }
};

/**
 * Матрица «пусто / заполнено» × «в покое / в фокусе / с ошибкой / недоступно» —
 * сверка со всеми восемью вариантами компонента в макете (узел 109:1720).
 * Фокус показан принудительно через autoFocus у одной ячейки на колонку —
 * реальный :focus-within сработает только на одном поле разом, поэтому
 * колонка «в фокусе» здесь только для пустого поля, как в макете.
 */
export const Матрица: Story = {
  render: () => (
    <div style={page}>
      <table style={{ borderSpacing: 'var(--margin-16)' }}>
        <thead>
          <tr>
            <th />
            <th style={caption}>пусто</th>
            <th style={caption}>заполнено</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={caption}>в покое</td>
            <td>
              <Input label="Label" hint="Hint text" />
            </td>
            <td>
              <Input label="Label" hint="Hint text" defaultValue="Value" />
            </td>
          </tr>
          <tr>
            <td style={caption}>в фокусе</td>
            <td>
              <Input label="Label" hint="Hint text" placeholder="Placeholder" autoFocus />
            </td>
            <td>
              <Input label="Label" hint="Hint text" defaultValue="Value" />
            </td>
          </tr>
          <tr>
            <td style={caption}>ошибка</td>
            <td>
              <Input label="Label" alert="error" alertText="Alert text" />
            </td>
            <td>
              <Input label="Label" alert="error" alertText="Alert text" defaultValue="Value" />
            </td>
          </tr>
          <tr>
            <td style={caption}>недоступно</td>
            <td>
              <Input label="Label" hint="Hint text" disabled />
            </td>
            <td>
              <Input label="Label" hint="Hint text" disabled defaultValue="Value" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
};

/** Три размера рядом — проверка режимов ComponentSize. */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)', maxWidth: 320 }}>
      <Input label="Label" hint="Hint text" size="l" defaultValue="Large" />
      <Input label="Label" hint="Hint text" size="m" defaultValue="Medium" />
      <Input label="Label" hint="Hint text" size="s" defaultValue="Small" />
    </div>
  )
};
