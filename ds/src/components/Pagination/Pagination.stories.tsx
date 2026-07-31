import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)'
};

export const ВПокое: Story = {
  name: 'В покое',
  render: () => {
    function Demo() {
      const [current, setCurrent] = useState(1);
      return (
        <div style={page}>
          <Pagination view="default" page={current} totalPages={34} onPageChange={setCurrent} />
        </div>
      );
    }
    return <Demo />;
  }
};

/** Узел 205:6137 в Figma — View=Default/Per page. */
export const Виды: Story = {
  render: () => {
    function Demo() {
      const [current, setCurrent] = useState(1);
      return (
        <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-24)', alignItems: 'flex-start' }}>
          <Pagination view="default" page={current} totalPages={34} onPageChange={setCurrent} />
          <Pagination view="perPage" page={current} totalPages={34} onPageChange={setCurrent} />
        </div>
      );
    }
    return <Demo />;
  }
};

export const СерединаСписка: Story = {
  name: 'Середина списка',
  render: () => {
    function Demo() {
      const [current, setCurrent] = useState(17);
      return (
        <div style={page}>
          <Pagination view="default" page={current} totalPages={34} onPageChange={setCurrent} />
        </div>
      );
    }
    return <Demo />;
  }
};

export const МалоСтраниц: Story = {
  name: 'Мало страниц',
  render: () => {
    function Demo() {
      const [current, setCurrent] = useState(2);
      return (
        <div style={page}>
          <Pagination view="default" page={current} totalPages={4} onPageChange={setCurrent} />
        </div>
      );
    }
    return <Demo />;
  }
};
