import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  args: { label: 'Label', hint: 'Hint text' }
};

export default meta;
type Story = StoryObj<typeof TextArea>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)',
  maxWidth: 320
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

export const Ошибка: Story = {
  args: { alert: true, alertText: 'Alert text' }
};

export const Недоступно: Story = {
  args: { disabled: true, defaultValue: 'Value' }
};

/**
 * Матрица «пусто / заполнено» × «в покое / в фокусе / с ошибкой / недоступно» —
 * сверка со всеми восемью вариантами компонента в макете (узел 119:5404).
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
              <TextArea label="Label" hint="Hint text" />
            </td>
            <td>
              <TextArea label="Label" hint="Hint text" defaultValue="Value" />
            </td>
          </tr>
          <tr>
            <td style={caption}>в фокусе</td>
            <td>
              <TextArea label="Label" hint="Hint text" placeholder="Placeholder" autoFocus />
            </td>
            <td>
              <TextArea label="Label" hint="Hint text" defaultValue="Value" />
            </td>
          </tr>
          <tr>
            <td style={caption}>ошибка</td>
            <td>
              <TextArea label="Label" alert alertText="Alert text" />
            </td>
            <td>
              <TextArea label="Label" alert alertText="Alert text" defaultValue="Value" />
            </td>
          </tr>
          <tr>
            <td style={caption}>недоступно</td>
            <td>
              <TextArea label="Label" hint="Hint text" disabled />
            </td>
            <td>
              <TextArea label="Label" hint="Hint text" disabled defaultValue="Value" />
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
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <TextArea label="Label" hint="Hint text" size="l" defaultValue="Large" />
      <TextArea label="Label" hint="Hint text" size="m" defaultValue="Medium" />
      <TextArea label="Label" hint="Hint text" size="s" defaultValue="Small" />
    </div>
  )
};
