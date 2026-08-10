import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';
import { Icon } from '../Icon';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag/Tag',
  component: Tag,
  args: { label: 'Label' }
};

export default meta;
type Story = StoryObj<typeof Tag>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  fontFamily: 'var(--font-family-main)'
};

export const ВПокое: Story = { name: 'В покое' };

export const Выбран: Story = {
  name: 'Выбран',
  args: { selected: true }
};

/** Узел 134:4198 в Figma — четыре сочетания Selected × Corners. */
export const Варианты: Story = {
  name: 'Варианты',
  render: () => (
    <div style={{ ...page, display: 'flex', flexWrap: 'wrap', gap: 'var(--margin-16)' }}>
      <Tag label="Label" corners="rounded" />
      <Tag label="Label" corners="rounded" selected />
      <Tag label="Label" corners="square" />
      <Tag label="Label" corners="square" selected />
    </div>
  )
};

export const СAddon: Story = {
  name: 'С addon',
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-16)' }}>
      <Tag label="Label" leftAddon={<Icon name="check" />} />
      <Tag label="Label" leftAddon={<Icon name="check" />} rightAddon={<Icon name="check" />} selected />
    </div>
  )
};

/** Icon only — без label, только один leftAddon (в макете у icon-only нет
 * правого слота). Обязателен aria-label. */
export const ИконкаБезПодписи: Story = {
  name: 'Иконка без подписи',
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-16)' }}>
      <Tag aria-label="Закрыть" leftAddon={<Icon name="check" />} />
      <Tag aria-label="Закрыть" leftAddon={<Icon name="check" />} selected />
      <Tag aria-label="Закрыть" corners="square" leftAddon={<Icon name="check" />} selected />
    </div>
  )
};

/** Переключаемый тег — тот же приём, что у Checkbox: state снаружи. */
export const Переключение: Story = {
  name: 'Переключение',
  render: () => {
    const [selected, setSelected] = useState(false);
    return (
      <div style={page}>
        <Tag label="Нажми меня" selected={selected} onClick={() => setSelected((v) => !v)} />
      </div>
    );
  }
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <Tag label="Large" size="l" selected />
      <Tag label="Medium" size="m" selected />
      <Tag label="Small" size="s" selected />
    </div>
  )
};
