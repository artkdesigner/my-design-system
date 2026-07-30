import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Scrollbar.module.css';

type ScrollbarOwnProps = {
  children: ReactNode;
};

export type ScrollbarProps = ScrollbarOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof ScrollbarOwnProps>;

/**
 * Скроллируемый контейнер с тонким бегунком. Узел 179:6638 в Figma
 * (варианты Position=Start/Middle/End), сверен через MCP-мост: три
 * варианта в макете — это статичные иллюстрации «прокручено вверх /
 * посередине / вниз», не проп компонента. Ширина трека (12px) — это ровно
 * padding 4px с обеих сторон плюс сам бегунок 4px (bg_action_tetriary,
 * radius_max), без отдельных токенов на сам Scrollbar — переиспользованы
 * общие Scales/Radius/Padding примитивы, как и в самом макете.
 *
 * Бегунок не рисуется вручную поверх контента: настоящий overflow-y
 * плюс стилизация нативного скроллбара (::-webkit-scrollbar +
 * scrollbar-width/scrollbar-color для Firefox) — браузер сам считает
 * размер и позицию бегунка по соотношению видимой/полной высоты
 * контента, то есть именно то поведение, которое в макете показано
 * тремя статичными кадрами. Кастомная JS-физика скролла (перетаскивание,
 * инерция) не нужна и не была бы настоящим скроллом — набор скроллился
 * бы только там, где эта логика написана, а не везде.
 *
 * forwardRef — не из Figma, а необходимость реального скролла: вызывающий
 * код должен иметь доступ к самому скроллируемому узлу (scrollTo,
 * измерение scrollHeight и т.п.), как у обычного div с overflow.
 */
export const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(function Scrollbar({ children, className, ...rest }, ref) {
  return (
    <div {...rest} ref={ref} className={[styles.scrollbar, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
});
