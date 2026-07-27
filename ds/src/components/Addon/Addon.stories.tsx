import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Addon } from './Addon';

const meta: Meta<typeof Addon> = {
  title: 'Components/Addon',
  component: Addon,
  args: { icon: 'activity' }
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
      <Addon icon="activity" size="l" />
      <Addon icon="activity" size="m" />
      <Addon icon="activity" size="s" />
    </div>
  )
};

/**
 * Пропы icon и checkmark — короткий путь для двух самых частых начинок:
 * не нужно самому подставлять Icon/Checkmark и передавать им size, Addon
 * делает это сам. checkmark=false всё равно рисует Checkmark, просто
 * невыбранный — те же 10% непрозрачности, что у самого компонента.
 */
export const ВыборСодержимого: Story = {
  name: 'icon и checkmark',
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
      {(
        [
          ['icon="activity"', <Addon key="icon" icon="activity" />],
          ['checkmark (выбран)', <Addon key="checkmark-true" checkmark />],
          ['checkmark={false}', <Addon key="checkmark-false" checkmark={false} />]
        ] as const
      ).map(([name, node]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-8)' }}>
          {node}
          <span style={label}>{name}</span>
        </div>
      ))}
    </div>
  )
};

/**
 * Addon — это только место: слот сам не решает, что внутри. В Figma это
 * instance swap, в коде — либо готовые icon/checkmark, либо любой ReactNode
 * через children. Здесь показаны заглушки для содержимого, которое ещё не
 * оформлено отдельными компонентами (CheckboxItem, RadioItem, StatusBadge,
 * Spinner, Indicator, Text) — сам слот от их появления не изменится.
 */
export const Содержимое: Story = {
  name: 'Разное содержимое',
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
      {(
        [
          ['Icon (проп icon)', <Addon key="icon" icon="activity" />],
          ['Checkmark (проп checkmark)', <Addon key="checkmark" checkmark />],
          [
            'Text (children)',
            <Addon key="text">
              <span style={{ fontSize: 'var(--font-size-label-l)' }}>99+</span>
            </Addon>
          ],
          [
            'Spinner (заглушка, children)',
            <Addon key="spinner">
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid currentColor',
                  borderTopColor: 'transparent'
                }}
              />
            </Addon>
          ]
        ] as const
      ).map(([name, node]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-8)' }}>
          {node}
          <span style={label}>{name}</span>
        </div>
      ))}
    </div>
  )
};
