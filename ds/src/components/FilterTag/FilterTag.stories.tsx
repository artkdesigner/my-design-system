import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterTag } from './FilterTag';
import { OptionListCell } from '../OptionListCell';
import { Icon } from '../Icon';

const meta: Meta<typeof FilterTag> = {
  title: 'Components/FilterTag',
  component: FilterTag
};

export default meta;
type Story = StoryObj<typeof FilterTag>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)',
  minHeight: 260
};

/** Узел 162:5477 в Figma — все шесть реальных сочетаний Filled × Single ×
 * Opened рядом (Opened развёрнут в отдельную историю с настоящим кликом). */
export const ВПокое: Story = {
  name: 'В покое',
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <div style={{ display: 'flex', gap: 'var(--margin-16)' }}>
        <FilterTag single label="Value" />
        <FilterTag label="Label" />
      </div>
      <div style={{ display: 'flex', gap: 'var(--margin-16)' }}>
        <FilterTag single value="Value" onClear={() => {}} />
        <FilterTag label="Label" value="Value" onClear={() => {}} />
      </div>
    </div>
  )
};

export const Открыт: Story = {
  name: 'Открыт (со списком)',
  render: () => (
    <div style={page}>
      <FilterTag label="Статус" value="Активен" onClear={() => {}} defaultOpen>
        <OptionListCell label="Активен" selected />
        <OptionListCell label="Неактивен" />
        <OptionListCell label="Черновик" />
      </FilterTag>
    </div>
  )
};

export const СИконкой: Story = {
  name: 'С иконкой',
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-16)' }}>
      <FilterTag icon={<Icon name="information" />} label="Статус" />
      <FilterTag icon={<Icon name="information" />} label="Статус" value="Активен" onClear={() => {}} />
    </div>
  )
};

export const Одиночный: Story = {
  name: 'Одиночный (single)',
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-16)' }}>
      <FilterTag single label="Только с фото" onClick={() => {}} />
      <FilterTag single value="Только с фото" onClick={() => {}} onClear={() => {}} />
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <FilterTag label="Large" value="Value" onClear={() => {}} size="l" />
      <FilterTag label="Medium" value="Value" onClear={() => {}} size="m" />
      <FilterTag label="Small" value="Value" onClear={() => {}} size="s" />
    </div>
  )
};

export const Недоступен: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-16)' }}>
      <FilterTag label="Label" disabled />
      <FilterTag label="Label" value="Value" onClear={() => {}} disabled />
    </div>
  )
};
