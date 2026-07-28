import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Addon } from './Addon';
import { IconButton } from '../IconButton';

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
 * Восемь быстрых пропов — короткий путь для восьми вариантов instance
 * swap из Figma (узел 80:1181): не нужно самому подставлять компонент и
 * передавать ему size, Addon делает это сам. checkmark=false всё равно
 * рисует Checkmark, просто невыбранный. text и indicator — единственные
 * варианты, которые меняют форму слота (не квадрат) — у остальных
 * (checkboxItem/radioItem/statusBadge/spinner) собственная форма и так
 * совпадает с квадратом --addon-size.
 *
 * IconButton среди быстрых пропов нет — см. комментарий в Addon.tsx:
 * циклическая зависимость (IconButton сам использует Addon внутри) и
 * вложенная кнопка внутри чужого слота — по-прежнему через children.
 */
export const ВыборСодержимого: Story = {
  name: 'Быстрые пропы',
  render: () => (
    <div style={{ ...page, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--margin-24)' }}>
      {(
        [
          ['icon="activity"', <Addon key="icon" icon="activity" />],
          ['checkmark (выбран)', <Addon key="checkmark-true" checkmark />],
          ['checkmark={false}', <Addon key="checkmark-false" checkmark={false} />],
          [
            'checkboxItem={{...}}',
            <Addon key="checkbox-item" checkboxItem={{ 'aria-label': 'Согласие', state: 'checked' }} />
          ],
          ['radioItem={{...}}', <Addon key="radio-item" radioItem={{ 'aria-label': 'Вариант', selected: true }} />],
          ['statusBadge={{...}}', <Addon key="status-badge" statusBadge={{ type: 'positiveCheck' }} />],
          ['spinner={{}}', <Addon key="spinner" spinner={{}} />],
          ['indicator={{...}}', <Addon key="indicator" indicator={{ count: '1' }} />],
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
 * контенту, скругление radius-4, свой цвет и размер шрифта. Ширина растёт
 * вместе с текстом, а не остаётся фиксированной. */
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

/** Узел 205:965 в Figma — вариант Type=Indicator: точка (dot) остаётся
 * своих 8px, а не растягивается на весь --addon-size; число (count) не
 * обрезается, а растягивает слот по ширине, как «99+» ниже. */
export const IndicatorStory: Story = {
  name: 'Indicator — форма слота',
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Addon indicator={{ dot: true }} />
      <Addon indicator={{ count: '1' }} />
      <Addon indicator={{ count: '99+' }} />
    </div>
  )
};

/**
 * Addon — это только место: слот сам не решает, что внутри. В Figma это
 * instance swap на реальные компоненты дизайн-системы; в коде — либо
 * быстрые пропы (icon/checkmark/checkboxItem/radioItem/statusBadge/
 * spinner/indicator/text), либо любой ReactNode через children — так,
 * например, кладётся IconButton.
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
            'CheckboxItem (проп checkboxItem)',
            <Addon key="checkbox-item" checkboxItem={{ 'aria-label': 'Согласие', state: 'checked' }} />
          ],
          ['RadioItem (проп radioItem)', <Addon key="radio-item" radioItem={{ 'aria-label': 'Вариант', selected: true }} />],
          ['StatusBadge (проп statusBadge)', <Addon key="status-badge" statusBadge={{ type: 'positiveCheck' }} />],
          ['Spinner (проп spinner)', <Addon key="spinner" spinner={{}} />],
          ['Indicator (проп indicator)', <Addon key="indicator" indicator={{ dot: true }} />],
          ['Text (проп text)', <Addon key="text" text="kg" />],
          [
            'IconButton (children — не быстрый проп)',
            <Addon key="icon-button">
              <IconButton icon="activity" aria-label="Действие" />
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
