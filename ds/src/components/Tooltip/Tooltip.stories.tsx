import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { TooltipContent } from '../TooltipContent';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip/Tooltip',
  component: Tooltip
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

const page: CSSProperties = {
  padding: 'var(--padding-40)',
  background: 'var(--element-bg-lvl-2)',
  fontFamily: 'var(--font-family-main)'
};

const label: CSSProperties = {
  fontFamily: 'var(--font-family-code)',
  fontSize: 'var(--font-size-hint-m)',
  color: 'var(--element-text-secondary)',
  textAlign: 'center',
  fontWeight: 'var(--font-weight-regular)'
};

const text = 'Tooltip text. Tooltip text. Tooltip text.';

export const ВПокое: Story = {
  name: 'В покое',
  render: () => (
    <div style={page}>
      <Tooltip>
        <TooltipContent preset="text" text={text} />
      </Tooltip>
    </div>
  )
};

/** Узел 181:855 в Figma — все 4 направления хвостика рядом. */
export const Направления: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-40)' }}>
      {(
        [
          ['left', 'Хвостик влево'],
          ['right', 'Хвостик вправо'],
          ['up', 'Хвостик вверх'],
          ['down', 'Хвостик вниз']
        ] as const
      ).map(([direction, name]) => (
        <div key={direction} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--margin-16)' }}>
          <Tooltip tailDirection={direction}>
            <TooltipContent preset="text" text={text} />
          </Tooltip>
          <span style={label}>{name}</span>
        </div>
      ))}
    </div>
  )
};

export const СКастомнымСодержимым: Story = {
  name: 'С кастомным содержимым',
  render: () => (
    <div style={page}>
      <Tooltip>
        <TooltipContent preset="custom">
          <button type="button">Понятно</button>
        </TooltipContent>
      </Tooltip>
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'flex-start', gap: 'var(--margin-24)' }}>
      {(['l', 'm', 's'] as const).map((size) => (
        <Tooltip key={size} size={size}>
          <TooltipContent preset="text" text={text} />
        </Tooltip>
      ))}
    </div>
  )
};

/** Узел 268:22171 в Figma — тело тултипа берёт element-bg-lvl-1, поэтому
 * в тёмной теме (data-theme="dark") само становится тёмным. */
export const ТёмнаяТема: Story = {
  name: 'Тёмная тема',
  render: () => (
    <div data-theme="dark" style={{ ...page, background: 'var(--element-bg-lvl-1)' }}>
      <Tooltip>
        <TooltipContent preset="text" text={text} />
      </Tooltip>
    </div>
  )
};
