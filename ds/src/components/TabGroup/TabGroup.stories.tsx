import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabGroup } from './TabGroup';
import { Tab } from '../Tab';

const meta: Meta<typeof TabGroup> = {
  title: 'Components/TabGroup',
  component: TabGroup
};

export default meta;
type Story = StoryObj<typeof TabGroup>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

const labels = ['Label', 'Label', 'Label', 'Label', 'Label', 'Label', 'Label', 'Label'];

/** Узел 205:5845 в Figma — статичный набор вкладок. */
export const ВПокое: Story = {
  name: 'В покое',
  render: () => (
    <div style={page}>
      <TabGroup>
        {labels.map((label, index) => (
          <Tab key={index} active={index === 0}>
            {label}
          </Tab>
        ))}
      </TabGroup>
    </div>
  )
};

/** Управляемый пример: вызывающий код хранит активный индекс и сам решает,
 * какой Tab получает active. */
export const Управляемая: Story = {
  name: 'Управляемая',
  render: () => {
    const [active, setActive] = useState(0);
    return (
      <div style={page}>
        <TabGroup>
          {['Обзор', 'История', 'Настройки'].map((label, index) => (
            <Tab key={label} active={active === index} onClick={() => setActive(index)}>
              {label}
            </Tab>
          ))}
        </TabGroup>
      </div>
    );
  }
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)' }}>
      <TabGroup size="l">
        <Tab active size="l">
          Large
        </Tab>
        <Tab size="l">Label</Tab>
      </TabGroup>
      <TabGroup size="m">
        <Tab active size="m">
          Medium
        </Tab>
        <Tab size="m">Label</Tab>
      </TabGroup>
      <TabGroup size="s">
        <Tab active size="s">
          Small
        </Tab>
        <Tab size="s">Label</Tab>
      </TabGroup>
    </div>
  )
};
