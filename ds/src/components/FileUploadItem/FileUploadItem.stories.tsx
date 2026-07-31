import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUploadItem } from './FileUploadItem';

const meta: Meta<typeof FileUploadItem> = {
  title: 'Components/FileUploadItem',
  component: FileUploadItem,
  args: { name: 'Name', format: 'format' }
};

export default meta;
type Story = StoryObj<typeof FileUploadItem>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  width: 420
};

export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => (
    <div style={page}>
      <FileUploadItem {...args} subtitle1="Subtitle 1" subtitle2="Subtitle 2" onDownload={() => {}} onRemove={() => {}} />
    </div>
  )
};

/** Узел 198:822 в Figma — State=Default/Error/Deleted. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <FileUploadItem
        name="Name"
        format="format"
        subtitle1="Subtitle 1"
        subtitle2="Subtitle 2"
        progress={100}
        onDownload={() => {}}
        onRemove={() => {}}
      />
      <FileUploadItem
        name="Name"
        format="format"
        state="error"
        errorText1="Error text 1"
        errorText2="Error text 2"
        onRetry={() => {}}
        onRemove={() => {}}
      />
      <FileUploadItem
        name="Name"
        format="format"
        state="deleted"
        subtitle1="Subtitle 1"
        subtitle2="Subtitle 2"
        onRetry={() => {}}
      />
    </div>
  )
};

export const Загрузка: Story = {
  name: 'Загрузка',
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <FileUploadItem name="Name" format="format" progress={25} subtitle1="25%" onRemove={() => {}} />
      <FileUploadItem name="Name" format="format" progress={65} subtitle1="65%" onRemove={() => {}} />
      <FileUploadItem name="Name" format="format" progress={100} subtitle1="Готово" onDownload={() => {}} onRemove={() => {}} />
    </div>
  )
};
