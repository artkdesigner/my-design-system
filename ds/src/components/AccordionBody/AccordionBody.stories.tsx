import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccordionBody } from './AccordionBody';

const meta: Meta<typeof AccordionBody> = {
  title: 'Components/AccordionBody',
  component: AccordionBody,
  args: { preset: 'text', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
};

export default meta;
type Story = StoryObj<typeof AccordionBody>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  width: 360
};

export const ВПокое: Story = { name: 'В покое', render: (args) => <div style={page}><AccordionBody {...args} /></div> };

/** Узел 213:3754 в Figma — Preset=Custom/Text. */
export const Пресеты: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <AccordionBody preset="text" text="Lorem Ipsum is simply dummy text of the printing and typesetting industry." />
      <AccordionBody preset="custom">Своя разметка: список, кнопки — что угодно.</AccordionBody>
    </div>
  )
};
