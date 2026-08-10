import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal
};

export default meta;
type Story = StoryObj<typeof Modal>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-2)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)',
  minHeight: 480
};

const body: CSSProperties = {
  margin: 0,
  color: 'var(--element-text-secondary)',
  fontSize: 'var(--font-size-body-m)',
  lineHeight: 1.4
};

/** Узел 179:6872 в Figma — заголовок, назад, тело и пара кнопок футера. */
export const ВПокое: Story = {
  name: 'В покое',
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={page}>
        <Button view="accent" onClick={() => setOpen(true)}>
          Открыть модалку
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          onBack={() => {}}
          title="Title"
          primaryAction={{ label: 'Label', onClick: () => setOpen(false) }}
          secondaryAction={{ label: 'Label', onClick: () => setOpen(false) }}
        >
          <p style={body}>Содержимое диалога — произвольный контент, который передаёт вызывающий код.</p>
        </Modal>
      </div>
    );
  }
};

export const БезНазадИЗаголовка: Story = {
  name: 'Без назад и заголовка',
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={page}>
        <Button view="accent" onClick={() => setOpen(true)}>
          Открыть модалку
        </Button>
        <Modal open={open} onClose={() => setOpen(false)} primaryAction={{ label: 'Label', onClick: () => setOpen(false) }}>
          <p style={body}>Заголовка нет — только крестик закрытия и одна кнопка в футере.</p>
        </Modal>
      </div>
    );
  }
};

/** Узел 179:5867 — все три реальные раскладки кнопок футера. */
export const РаскладкиКнопок: Story = {
  name: 'Раскладки кнопок',
  render: () => {
    const [layout, setLayout] = useState<'horizontal' | 'horizontalFull' | 'vertical' | null>('horizontal');
    return (
      <div style={{ ...page, display: 'flex', gap: 'var(--margin-12)' }}>
        <Button view="accent" onClick={() => setLayout('horizontal')}>
          horizontal
        </Button>
        <Button view="accent" onClick={() => setLayout('horizontalFull')}>
          horizontalFull
        </Button>
        <Button view="accent" onClick={() => setLayout('vertical')}>
          vertical
        </Button>
        <Modal
          open={layout !== null}
          onClose={() => setLayout(null)}
          title="Title"
          actionsLayout={layout ?? 'horizontal'}
          primaryAction={{ label: 'Label', onClick: () => setLayout(null) }}
          secondaryAction={{ label: 'Label', onClick: () => setLayout(null) }}
        >
          <p style={body}>Содержимое диалога.</p>
        </Modal>
      </div>
    );
  }
};

export const СвойФутер: Story = {
  name: 'Свой футер',
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={page}>
        <Button view="accent" onClick={() => setOpen(true)}>
          Открыть модалку
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Title"
          footer={<p style={{ ...body, textAlign: 'center' }}>Произвольный контент футера</p>}
        >
          <p style={body}>Содержимое диалога.</p>
        </Modal>
      </div>
    );
  }
};

export const ДлинноеСодержимое: Story = {
  name: 'Длинное содержимое',
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={page}>
        <Button view="accent" onClick={() => setOpen(true)}>
          Открыть модалку
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Title"
          primaryAction={{ label: 'Label', onClick: () => setOpen(false) }}
        >
          {Array.from({ length: 20 }, (_, index) => (
            <p key={index} style={{ ...body, marginBottom: 'var(--margin-12)' }}>
              Строка содержимого {index + 1} — тело скроллится через Scrollbar, шапка и футер остаются на месте.
            </p>
          ))}
        </Modal>
      </div>
    );
  }
};
