import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import type { IconName } from './icons.generated';
import { ICON_CATEGORIES } from './icons.categories';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  args: { name: 'activity' }
};

export default meta;
type Story = StoryObj<typeof Icon>;

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

/**
 * Каталог: только Arrows и General из библиотеки Figma (78:3664) — пилот
 * на двух категориях из 19, остальные добавляются по потребности.
 */
export const ВсеИконки: Story = {
  name: 'Все иконки',
  render: () => (
    <div style={page}>
      {Object.entries(ICON_CATEGORIES).map(([category, names]) => (
        <section key={category} style={{ marginBottom: 'var(--margin-32)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-family-main)',
              fontSize: 'var(--font-size-heading-heading-m)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--margin-16)'
            }}
          >
            {category}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
              gap: 'var(--margin-16)'
            }}
          >
            {names.map((name) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--margin-8)'
                }}
              >
                <Icon name={name as IconName} />
                <span style={{ ...label, wordBreak: 'break-word' }}>{name}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
};

/** Три размера рядом — проверка режимов ComponentSize. */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Icon name="activity" size="l" />
      <Icon name="activity" size="m" />
      <Icon name="activity" size="s" />
    </div>
  )
};
