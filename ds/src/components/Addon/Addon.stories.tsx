import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Addon } from './Addon';
import { IconButton } from '../IconButton';
import { CheckboxItem } from '../CheckboxItem';
import { RadioItem } from '../RadioItem';
import { StatusBadge } from '../StatusBadge';
import { Spinner } from '../Spinner';
import { Indicator } from '../Indicator';

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
 * Пропы icon, checkmark и text — короткий путь для трёх самых частых
 * начинок: не нужно самому подставлять компонент/вёрстку и передавать им
 * size, Addon делает это сам. checkmark=false всё равно рисует Checkmark,
 * просто невыбранный — те же 10% непрозрачности, что у самого компонента.
 * text — единственный вариант, который меняет форму слота (не квадрат) и
 * красит содержимое сам, а не оставляет цвет вызывающему коду.
 */
export const ВыборСодержимого: Story = {
  name: 'icon, checkmark и text',
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
      {(
        [
          ['icon="activity"', <Addon key="icon" icon="activity" />],
          ['checkmark (выбран)', <Addon key="checkmark-true" checkmark />],
          ['checkmark={false}', <Addon key="checkmark-false" checkmark={false} />],
          ['text="kg"', <Addon key="text" text="kg" />]
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

/** Узел 241:484 в Figma — вариант Type=Text: не квадрат, ширина по
 * контенту, скругление radius-4, свой цвет и размер шрифта. Соседние
 * примеры показывают, что ширина растёт вместе с текстом, а не остаётся
 * фиксированной. */
export const Text: Story = {
  name: 'Text — форма слота',
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Addon text="$" />
      <Addon text="kg" />
      <Addon text="per month" />
    </div>
  )
};

/**
 * Addon — это только место: слот сам не решает, что внутри. В Figma это
 * instance swap на реальные компоненты дизайн-системы; в коде — либо
 * готовые icon/checkmark/text, либо любой ReactNode через children.
 */
export const Содержимое: Story = {
  name: 'Разное содержимое',
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-24)' }}>
      {(
        [
          ['Icon (проп icon)', <Addon key="icon" icon="activity" />],
          ['Checkmark (проп checkmark)', <Addon key="checkmark" checkmark />],
          ['Text (проп text)', <Addon key="text" text="kg" />],
          [
            'IconButton (children)',
            <Addon key="icon-button">
              <IconButton icon="activity" aria-label="Действие" />
            </Addon>
          ],
          [
            'CheckboxItem (children)',
            <Addon key="checkbox-item">
              <CheckboxItem aria-label="Согласие" state="checked" />
            </Addon>
          ],
          [
            'RadioItem (children)',
            <Addon key="radio-item">
              <RadioItem aria-label="Вариант" selected />
            </Addon>
          ],
          [
            'StatusBadge (children)',
            <Addon key="status-badge">
              <StatusBadge type="positiveCheck" />
            </Addon>
          ],
          [
            'Spinner (children)',
            <Addon key="spinner">
              <Spinner />
            </Addon>
          ],
          [
            'Indicator (children)',
            <Addon key="indicator">
              <Indicator dot />
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
