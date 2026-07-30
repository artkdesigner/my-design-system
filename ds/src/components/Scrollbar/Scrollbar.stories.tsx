import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Scrollbar } from './Scrollbar';

const meta: Meta<typeof Scrollbar> = {
  title: 'Components/Scrollbar',
  component: Scrollbar
};

export default meta;
type Story = StoryObj<typeof Scrollbar>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  fontFamily: 'var(--font-family-main)'
};

const track: CSSProperties = {
  width: 40,
  height: 200,
  background: 'var(--element-bg-lvl-2)',
  borderRadius: 'var(--radius-16)'
};

const item: CSSProperties = {
  height: 24,
  margin: 8,
  borderRadius: 'var(--radius-8)',
  background: 'var(--element-bg-action-tetriary)'
};

const Content = () => (
  <>
    {Array.from({ length: 20 }, (_, i) => (
      <div key={i} style={item} />
    ))}
  </>
);

export const ВПокое: Story = {
  name: 'В покое',
  render: () => (
    <div style={page}>
      <div style={track}>
        <Scrollbar style={{ height: '100%' }}>
          <Content />
        </Scrollbar>
      </div>
    </div>
  )
};

/** Узел 179:6638 в Figma — три статичных кадра «прокручено вверх / по
 * центру / вниз». Здесь то же самое, но настоящим скроллом: браузер сам
 * считает размер и позицию бегунка, кадры получены реальной прокруткой
 * контейнера при монтировании, а не проп-переключателем. */
export const Положения: Story = {
  render: () => {
    const scrollTo = (ratio: number) => (node: HTMLDivElement | null) => {
      if (node) node.scrollTop = ratio * (node.scrollHeight - node.clientHeight);
    };

    return (
      <div style={{ ...page, display: 'flex', gap: 'var(--margin-24)' }}>
        <div style={track}>
          <Scrollbar ref={scrollTo(0)} style={{ height: '100%' }}>
            <Content />
          </Scrollbar>
        </div>
        <div style={track}>
          <Scrollbar ref={scrollTo(0.5)} style={{ height: '100%' }}>
            <Content />
          </Scrollbar>
        </div>
        <div style={track}>
          <Scrollbar ref={scrollTo(1)} style={{ height: '100%' }}>
            <Content />
          </Scrollbar>
        </div>
      </div>
    );
  }
};

export const МалоКонтента: Story = {
  name: 'Мало контента (скроллбар не нужен)',
  render: () => (
    <div style={track}>
      <Scrollbar style={{ height: '100%' }}>
        <div style={item} />
        <div style={item} />
      </Scrollbar>
    </div>
  )
};
