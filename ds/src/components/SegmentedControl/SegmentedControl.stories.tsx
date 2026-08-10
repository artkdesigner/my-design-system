import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from './SegmentedControl';
import { Segment } from '../Segment';

const OPTIONS = ['Label', 'Label', 'Label', 'Label', 'Label'];

const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/SegmentedControl/SegmentedControl',
  component: SegmentedControl
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

/** Узел 171:3015 в Figma — сегменты по контенту. Вызывающий код сам хранит выбор. */
export const ПоКонтенту: Story = {
  name: 'По контенту',
  render: () => {
    const [selected, setSelected] = useState(0);
    return (
      <div style={page}>
        <SegmentedControl>
          {OPTIONS.map((label, index) => (
            <Segment key={index} selected={index === selected} onClick={() => setSelected(index)}>
              {label}
            </Segment>
          ))}
        </SegmentedControl>
      </div>
    );
  }
};

export const Адаптивная: Story = {
  render: () => {
    const [selected, setSelected] = useState(0);
    return (
      <div style={{ ...page, maxWidth: 460 }}>
        <SegmentedControl adaptive>
          {OPTIONS.map((label, index) => (
            <Segment key={index} selected={index === selected} onClick={() => setSelected(index)}>
              {label}
            </Segment>
          ))}
        </SegmentedControl>
      </div>
    );
  }
};

export const Размеры: Story = {
  render: () => {
    const [selected, setSelected] = useState(0);
    return (
      <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)', alignItems: 'flex-start' }}>
        {(['l', 'm', 's'] as const).map((size) => (
          <SegmentedControl key={size} size={size}>
            {['Large', 'Medium', 'Small'].slice(0, 3).map((label, index) => (
              <Segment key={label} size={size} selected={index === selected} onClick={() => setSelected(index)}>
                {label}
              </Segment>
            ))}
          </SegmentedControl>
        ))}
      </div>
    );
  }
};
