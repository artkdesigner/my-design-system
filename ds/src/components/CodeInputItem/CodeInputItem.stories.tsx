import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeInputItem } from './CodeInputItem';

const meta: Meta<typeof CodeInputItem> = {
  title: 'Components/CodeInputItem',
  component: CodeInputItem,
  args: { value: '0' }
};

export default meta;
type Story = StoryObj<typeof CodeInputItem>;

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

/**
 * Все 7 вариантов узла 176:1256 в Figma рядом, в том же порядке, что и
 * в макете: пусто → курсор → значение+курсор → значение → ошибка пусто →
 * ошибка+значение → недоступно+значение.
 */
export const Состояния: Story = {
  render: () => {
    const states = [
      ['Пусто', {}],
      ['Курсор', { active: true }],
      ['Значение + курсор', { active: true, filled: true }],
      ['Значение', { filled: true }],
      ['Ошибка', { error: true }],
      ['Ошибка + значение', { error: true, filled: true }],
      ['Недоступно + значение', { disabled: true, filled: true }]
    ] as const;

    return (
      <div style={{ ...page, display: 'flex', alignItems: 'flex-end', gap: 'var(--margin-12)' }}>
        {states.map(([name, props]) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-8)' }}>
            <CodeInputItem value="0" {...props} />
            <span style={label}>{name}</span>
          </div>
        ))}
      </div>
    );
  }
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <CodeInputItem value="0" filled size="l" />
      <CodeInputItem value="0" filled size="m" />
      <CodeInputItem value="0" filled size="s" />
    </div>
  )
};
