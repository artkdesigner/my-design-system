import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccordionTitle } from './AccordionTitle';

const meta: Meta<typeof AccordionTitle> = {
  title: 'Components/AccordionTitle',
  component: AccordionTitle,
  args: { preset: 'title', titleText: 'Title' }
};

export default meta;
type Story = StoryObj<typeof AccordionTitle>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  width: 360
};

export const ВПокое: Story = { name: 'В покое', render: (args) => <div style={page}><AccordionTitle {...args} /></div> };

/** Узел 213:3769 в Figma — Preset=Custom/Title. */
export const Пресеты: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <AccordionTitle preset="title" titleText="Title" />
      <AccordionTitle preset="custom">Свой заголовок с иконкой</AccordionTitle>
    </div>
  )
};
