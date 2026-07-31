import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUploadControls } from './FileUploadControls';

const meta: Meta<typeof FileUploadControls> = {
  title: 'Components/FileUploadControls',
  component: FileUploadControls
};

export default meta;
type Story = StoryObj<typeof FileUploadControls>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)'
};

export const ВПокое: Story = {
  name: 'В покое',
  render: () => (
    <div style={page}>
      <FileUploadControls onDownload={() => {}} onRemove={() => {}} />
    </div>
  )
};

/** Узел 197:1153 в Figma — три набора кнопок под Default/Error/Deleted у FileUploadItem. */
export const Наборы: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <FileUploadControls onDownload={() => {}} onRemove={() => {}} />
      <FileUploadControls onRetry={() => {}} onRemove={() => {}} />
      <FileUploadControls onRetry={() => {}} />
    </div>
  )
};
