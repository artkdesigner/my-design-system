import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Addon } from './Addon';
import { Icon } from '../Icon';

const meta: Meta<typeof Addon> = {
  title: 'Components/Addon',
  component: Addon,
  args: { children: <Icon name="activity" /> }
};

export default meta;
type Story = StoryObj<typeof Addon>;

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

export const Обычный: Story = { name: 'С иконкой' };

/** Три размера рядом — проверка режимов ComponentSize, тот же --addon-size,
 * что и у Icon. */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Addon size="l">
        <Icon name="activity" size="l" />
      </Addon>
      <Addon size="m">
        <Icon name="activity" size="m" />
      </Addon>
      <Addon size="s">
        <Icon name="activity" size="s" />
      </Addon>
    </div>
  )
};

/**
 * Addon — это только место: слот сам не решает, что внутри. В Figma это
 * instance swap, в коде — любой ReactNode. Здесь показаны заглушки для
 * содержимого, которое ещё не оформлено отдельными компонентами (Checkmark,
 * IconButton, CheckboxItem, RadioItem, StatusBadge, Spinner, Indicator,
 * Text) — сам слот от их появления не изменится.
 */
export const Содержимое: Story = {
  name: 'Разное содержимое',
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
      {(
        [
          ['Icon', <Icon key="icon" name="activity" />],
          ['Text', <span key="text" style={{ fontSize: 'var(--font-size-label-l)' }}>99+</span>],
          [
            'Spinner (заглушка)',
            <div
              key="spinner"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid currentColor',
                borderTopColor: 'transparent'
              }}
            />
          ]
        ] as const
      ).map(([name, content]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-8)' }}>
          <Addon>{content}</Addon>
          <span style={label}>{name}</span>
        </div>
      ))}
    </div>
  )
};
