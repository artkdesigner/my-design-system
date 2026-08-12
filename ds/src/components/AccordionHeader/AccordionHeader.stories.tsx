import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccordionHeader } from './AccordionHeader';

const meta: Meta<typeof AccordionHeader> = {
  title: 'Components/Accordion/AccordionHeader',
  component: AccordionHeader,
  args: { preset: 'title', titleText: 'Title' }
};

export default meta;
type Story = StoryObj<typeof AccordionHeader>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  width: 360
};

export const ВПокое: Story = { name: 'В покое', render: (args) => <div style={page}><AccordionHeader {...args} /></div> };

/** Узел 213:3769 в Figma — Preset=Custom/Title. */
export const Пресеты: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <AccordionHeader preset="title" titleText="Title" />
      <AccordionHeader preset="custom">Свой заголовок с иконкой</AccordionHeader>
    </div>
  )
};
