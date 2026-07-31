import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUploadContent } from './FileUploadContent';

const meta: Meta<typeof FileUploadContent> = {
  title: 'Components/FileUploadContent',
  component: FileUploadContent,
  args: { name: 'Name', format: 'format', subtitle1: 'Subtitle 1', subtitle2: 'Subtitle 2' }
};

export default meta;
type Story = StoryObj<typeof FileUploadContent>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-2)',
  width: 328
};

export const ВПокое: Story = { name: 'В покое', render: (args) => <div style={page}><FileUploadContent {...args} /></div> };

/** Узел 197:778 в Figma — State=Default/Error. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <FileUploadContent name="Name" format="format" subtitle1="Subtitle 1" subtitle2="Subtitle 2" />
      <FileUploadContent name="Name" format="format" state="error" errorText1="Error text 1" errorText2="Error text 2" />
    </div>
  )
};
