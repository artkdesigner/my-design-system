import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUploadLeftSlot } from './FileUploadLeftSlot';

const meta: Meta<typeof FileUploadLeftSlot> = {
  title: 'Components/FileUploadItem/FileUploadLeftSlot',
  component: FileUploadLeftSlot
};

export default meta;
type Story = StoryObj<typeof FileUploadLeftSlot>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)'
};

export const ВПокое: Story = { name: 'В покое', render: () => <div style={page}><FileUploadLeftSlot /></div> };

/** Узел 195:475 в Figma — все пять состояний. Кольцо loading — настоящий
 * conic-gradient по progress, а не статичный кадр из макета. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', gap: 'var(--margin-16)' }}>
      <FileUploadLeftSlot state="empty" />
      <FileUploadLeftSlot state="loading" progress={65} />
      <FileUploadLeftSlot state="success" />
      <FileUploadLeftSlot state="error" />
      <FileUploadLeftSlot state="deleted" />
    </div>
  )
};
