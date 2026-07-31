import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUploadForm, type FileUploadFormFile } from './FileUploadForm';

const meta: Meta<typeof FileUploadForm> = {
  title: 'Components/FileUploadForm',
  component: FileUploadForm,
  args: {
    title: 'Документы',
    description: 'Загрузите несколько документов, которые хотите отправить',
    attachLabel: 'Прикрепите файл',
    acceptHint: 'docx, xls, pdf',
    hint: 'До 20 МБ каждый, всего — не больше 5 файлов'
  }
};

export default meta;
type Story = StoryObj<typeof FileUploadForm>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-2)',
  width: 720
};

const demoFiles: FileUploadFormFile[] = [
  { id: 1, name: 'Название файла', format: 'txt', state: 'error', errorText1: 'Прикрепите файл подходящего формата не больше 20 МБ' },
  { id: 2, name: 'Название файла', format: 'pdf', subtitle1: '1.2 МБ' },
  { id: 3, name: 'Название файла', format: 'docx', subtitle1: '33 КБ' }
];

export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => (
    <div style={page}>
      <FileUploadForm {...args} />
    </div>
  )
};

/** Узел 212:20522 в Figma — Dragged=No/Yes: с файлами (No) и оверлей
 * перетаскивания (Yes, потрогать можно в истории «Интерактивно»). */
export const СФайлами: Story = {
  name: 'С файлами',
  render: (args) => (
    <div style={page}>
      <FileUploadForm {...args} files={demoFiles} onRemoveFile={() => {}} onRetryFile={() => {}} onDownloadFile={() => {}} />
    </div>
  )
};

export const Интерактивно: Story = {
  render: (args) => {
    function Demo() {
      const [files, setFiles] = useState<FileUploadFormFile[]>(demoFiles);
      return (
        <div style={page}>
          <FileUploadForm
            {...args}
            files={files}
            onRemoveFile={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
            onFilesDrop={(dropped) =>
              setFiles((prev) => [
                ...prev,
                ...Array.from(dropped).map((f, i) => ({ id: `${f.name}-${i}-${Date.now()}`, name: f.name, subtitle1: `${Math.round(f.size / 1024)} КБ` }))
              ])
            }
          />
        </div>
      );
    }
    return <Demo />;
  }
};
