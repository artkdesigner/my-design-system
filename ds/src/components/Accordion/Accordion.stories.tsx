import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  width: 360
};

const lorem =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.";

export const ВПокое: Story = {
  name: 'В покое',
  render: () => {
    function Demo() {
      const [opened, setOpened] = useState(false);
      return (
        <div style={page}>
          <Accordion title="Title" opened={opened} onOpenedChange={setOpened}>
            {lorem}
          </Accordion>
        </div>
      );
    }
    return <Demo />;
  }
};

/** Узел 213:753 в Figma — Control side=Left/Right. */
export const СторонаКонтрола: Story = {
  name: 'Сторона контрола',
  render: () => {
    function Demo() {
      const [leftOpened, setLeftOpened] = useState(true);
      const [rightOpened, setRightOpened] = useState(true);
      return (
        <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)' }}>
          <Accordion title="Control side=Left" opened={leftOpened} onOpenedChange={setLeftOpened} controlSide="left">
            {lorem}
          </Accordion>
          <Accordion title="Control side=Right" opened={rightOpened} onOpenedChange={setRightOpened} controlSide="right">
            {lorem}
          </Accordion>
        </div>
      );
    }
    return <Demo />;
  }
};

export const Список: Story = {
  name: 'Список',
  render: () => {
    function Demo() {
      const [openIndex, setOpenIndex] = useState<number | null>(0);
      const items = ['Первый вопрос', 'Второй вопрос', 'Третий вопрос'];
      return (
        <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)' }}>
          {items.map((title, index) => (
            <Accordion
              key={title}
              title={title}
              opened={openIndex === index}
              onOpenedChange={(next) => setOpenIndex(next ? index : null)}
            >
              {lorem}
            </Accordion>
          ))}
        </div>
      );
    }
    return <Demo />;
  }
};
