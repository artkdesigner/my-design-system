import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Attach } from './Attach';
import { AttachFileItem } from '../AttachFileItem';

const meta: Meta<typeof Attach> = {
  title: 'Components/Attach',
  component: Attach,
  args: { hint: 'Hint text' }
};

export default meta;
type Story = StoryObj<typeof Attach>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  width: 400
};

export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => (
    <div style={page}>
      <Attach {...args}>
        <AttachFileItem label="docx, xls, pdf" moreLabel="Ещё 3" />
      </Attach>
    </div>
  )
};

/** Узел 212:22504 в Figma — Max limit=No/Yes. */
export const Состояния: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-32)' }}>
      <Attach hint="Hint text">
        <AttachFileItem label="docx, xls, pdf" moreLabel="Ещё 3" />
      </Attach>
      <Attach hint="Hint text">
        <AttachFileItem state="loading" name="Название файла" format="docx" progress={40} onRemove={() => {}} />
      </Attach>
      <Attach hint="Hint text">
        <AttachFileItem state="done" name="Название файла" format="docx" onRemove={() => {}} />
      </Attach>
      <Attach hint="Hint text">
        <AttachFileItem state="many" manyLabel="2 файла" onRemove={() => {}} />
      </Attach>
      <Attach hint="Hint text">
        <AttachFileItem state="error" errorText="Не получилось загрузить" />
      </Attach>
      <Attach maxLimit maxLimitText="Загружено 5 из 5 доступных файлов" />
    </div>
  )
};

export const Интерактивно: Story = {
  render: () => {
    function Demo() {
      const [uploaded, setUploaded] = useState(false);
      return (
        <div style={page}>
          <Attach hint="До 5 файлов" onClick={() => setUploaded(true)}>
            {uploaded ? (
              <AttachFileItem state="done" name="Название файла" format="docx" onRemove={() => setUploaded(false)} />
            ) : (
              <AttachFileItem label="docx, xls, pdf" />
            )}
          </Attach>
        </div>
      );
    }
    return <Demo />;
  }
};
