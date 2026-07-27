import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextButton } from './TextButton';

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta: Meta<typeof TextButton> = {
  title: 'Components/TextButton',
  component: TextButton,
  args: { children: 'Label' }
};

export default meta;
type Story = StoryObj<typeof TextButton>;

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

export const Обычная: Story = { name: 'В покое' };

export const СИконками: Story = {
  name: 'Текст + аддон',
  args: { addonLeft: <PlusIcon />, addonRight: <PlusIcon /> }
};

/** Матрица для сверки с макетом: 2 вида × 4 тона сообщения (+ обычная строка). */
export const Матрица: Story = {
  render: () => {
    const tones = ['info', 'success', 'warning', 'error'] as const;
    return (
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
              <th style={label}>message</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={label}>обычная</td>
              {VIEWS.map((view) => (
                <td key={view}>
                  <TextButton view={view}>Label</TextButton>
                </td>
              ))}
              <td>
                <TextButton message="error">Label</TextButton>
              </td>
            </tr>
            {tones.map((tone) => (
              <tr key={tone}>
                <td style={label}>{tone}</td>
                <td colSpan={VIEWS.length} />
                <td>
                  <TextButton message={tone}>Label</TextButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

/**
 * Четыре тона сообщения. В отличие от Button здесь одна строка, а не две:
 * у TextButton нет заливки/ghost-варианта (см. комментарий над компонентом),
 * только сам тон.
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
            <tr>
              <td style={label}>message</td>
              {tones.map((tone) => (
                <td key={tone}>
                  <TextButton message={tone}>Label</TextButton>
                </td>
              ))}
            </tr>
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
      <TextButton size="l">Large</TextButton>
      <TextButton size="m">Medium</TextButton>
      <TextButton size="s">Small</TextButton>
    </div>
  )
};
