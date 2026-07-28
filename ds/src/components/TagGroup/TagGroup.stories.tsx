import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagGroup } from './TagGroup';
import { Tag } from '../Tag';

const meta: Meta<typeof TagGroup> = {
  title: 'Components/TagGroup',
  component: TagGroup,
  args: { title: 'Group title' }
};

export default meta;
type Story = StoryObj<typeof TagGroup>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

const OPTIONS = ['Первая', 'Вторая', 'Третья', 'Четвёртая', 'Пятая', 'Шестая', 'Седьмая'];

/**
 * Узел 134:4243 в Figma — множественный выбор: каждый Tag сам решает,
 * входит ли он в набор selected, TagGroup не хранит это состояние сама.
 */
export const ВПокое: Story = {
  name: 'В покое',
  render: () => {
    const [selected, setSelected] = useState<Set<string>>(new Set(['Первая']));
    const toggle = (option: string) =>
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(option)) next.delete(option);
        else next.add(option);
        return next;
      });

    return (
      <div style={page}>
        <TagGroup title="Group title" hint="Можно выбрать несколько">
          {OPTIONS.map((option) => (
            <Tag key={option} label={option} selected={selected.has(option)} onClick={() => toggle(option)} />
          ))}
        </TagGroup>
      </div>
    );
  }
};

export const БезЗаголовкаИПодсказки: Story = {
  name: 'Без заголовка и подсказки',
  render: () => (
    <div style={page}>
      <TagGroup>
        {OPTIONS.slice(0, 3).map((option, i) => (
          <Tag key={option} label={option} selected={i === 0} />
        ))}
      </TagGroup>
    </div>
  )
};

/** Узел 134:4254 в Figma — рамка только слева, не по контуру. */
export const Ошибка: Story = {
  name: 'Ошибка',
  args: { alert: true, alertText: 'Выберите хотя бы одну категорию' },
  render: (args) => (
    <div style={page}>
      <TagGroup {...args}>
        {OPTIONS.slice(0, 3).map((option) => (
          <Tag key={option} label={option} />
        ))}
      </TagGroup>
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      {(['l', 'm', 's'] as const).map((size) => (
        <TagGroup key={size} title={`Size ${size}`} size={size}>
          {OPTIONS.slice(0, 3).map((option, i) => (
            <Tag key={option} label={option} size={size} selected={i === 0} />
          ))}
        </TagGroup>
      ))}
    </div>
  )
};
