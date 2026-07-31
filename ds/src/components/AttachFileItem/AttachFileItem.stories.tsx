import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AttachFileItem } from './AttachFileItem';

const meta: Meta<typeof AttachFileItem> = {
  title: 'Components/AttachFileItem',
  component: AttachFileItem
};

export default meta;
type Story = StoryObj<typeof AttachFileItem>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)'
};

export const ВПокое: Story = {
  name: 'В покое',
  render: () => (
    <div style={page}>
      <AttachFileItem label="docx, xls, pdf" moreLabel="Ещё 3" />
    </div>
  )
};

/** Узел 188:4904 в Figma — все пять состояний. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)', alignItems: 'flex-start' }}>
      <AttachFileItem state="noFile" label="docx, xls, pdf" moreLabel="Ещё 3" />
      <AttachFileItem state="loading" name="Название файла" format="docx" progress={40} onRemove={() => {}} />
      <AttachFileItem state="done" name="Название файла" format="docx" onRemove={() => {}} />
      <AttachFileItem state="many" manyLabel="2 файла" onRemove={() => {}} />
      <AttachFileItem state="error" errorText="Не получилось загрузить" />
    </div>
  )
};
