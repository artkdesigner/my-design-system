import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccordionControl } from './AccordionControl';

const meta: Meta<typeof AccordionControl> = {
  title: 'Components/Accordion/AccordionControl',
  component: AccordionControl
};

export default meta;
type Story = StoryObj<typeof AccordionControl>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)'
};

export const ВПокое: Story = { name: 'В покое', render: () => <div style={page}><AccordionControl /></div> };

/** Узел 213:3925 в Figma — оба пресета, закрыт/открыт. */
export const Пресеты: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-24)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)', alignItems: 'center' }}>
        <AccordionControl preset="downChevron" open={false} />
        <AccordionControl preset="downChevron" open />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)', alignItems: 'center' }}>
        <AccordionControl preset="rightChevron" open={false} />
        <AccordionControl preset="rightChevron" open />
      </div>
    </div>
  )
};
