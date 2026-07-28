import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner
};

export default meta;
type Story = StoryObj<typeof Spinner>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

export const ВПокое: Story = { name: 'В покое' };

/** Три размера рядом — своих size-токенов в Figma нет (узел 183:4853 —
 * один статичный кадр 24×24), масштаб общий с Icon (--addon-size). */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Spinner size="l" />
      <Spinner size="m" />
      <Spinner size="s" />
    </div>
  )
};

/** Пример подписи для читалок экрана — Spinner сам по себе декоративный. */
export const СПодписью: Story = {
  name: 'С подписью для читалок',
  render: () => <Spinner role="status" aria-label="Загрузка" />
};
