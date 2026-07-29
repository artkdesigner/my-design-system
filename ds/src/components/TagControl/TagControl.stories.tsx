import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagControl } from './TagControl';

const meta: Meta<typeof TagControl> = {
  title: 'Components/TagControl',
  component: TagControl
};

export default meta;
type Story = StoryObj<typeof TagControl>;

/** Узел 144:10262 в Figma — счётчик скрытых тегов. */
export const Ещё: Story = {
  name: 'Ещё N',
  args: { mode: 'more', count: 3 }
};

/** Узел 147:5794 — сворачивает раскрытый ValueList обратно. */
export const Скрыть: Story = {
  args: { mode: 'hide' }
};
