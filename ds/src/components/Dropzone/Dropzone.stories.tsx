import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropzone } from './Dropzone';

const meta: Meta<typeof Dropzone> = {
  title: 'Components/Dropzone',
  component: Dropzone
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  width: 400
};

export const ВПокое: Story = { name: 'В покое', render: () => <div style={page}><Dropzone /></div> };

/** Узел 194:672 в Figma — disabled добавлен как необходимое поведение
 * дропзоны, в самом макете не показан. Наведение файла (data-active)
 * переключается самим компонентом по dragenter/dragleave, его нельзя
 * задать снаружи — потрогать можно в истории «Интерактивно», перетащив
 * файл прямо на зону. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)' }}>
      <Dropzone />
      <Dropzone disabled />
    </div>
  )
};

export const Интерактивно: Story = {
  render: () => {
    function Demo() {
      const [fileName, setFileName] = useState<string | null>(null);
      return (
        <div style={page}>
          <Dropzone onFilesDrop={(files) => setFileName(files[0]?.name ?? null)}>
            {fileName ? `Загружен: ${fileName}` : 'Перетащите файлы'}
          </Dropzone>
        </div>
      );
    }
    return <Demo />;
  }
};
