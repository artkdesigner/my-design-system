import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Indicator.module.css';

type IndicatorOwnProps = {
  /** Цветовая тема. Соответствует View в Figma. */
  view?: 'accent' | 'neutral' | 'light';
  /** Точка без содержимого вместо пилюли с числом. Соответствует Dot. */
  dot?: boolean;
  /** Что показать в пилюле. Не рисуется вовсе при dot=true — как в
   * макете, где условие «!dot» решает, рисовать ли текст, а не пустая
   * строка внутри пилюли. */
  count?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type IndicatorProps = IndicatorOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof IndicatorOwnProps>;

/**
 * Бейдж-счётчик. Узел 183:7837 в Figma, сверен через MCP-мост.
 *
 * accent/neutral — залитые (element-bg-action-accent/-secondary) с
 * белым текстом; light — белая (element-bg-lvl-1) с обычным тёмным
 * текстом. Переключение цвета текста — тот же приём data-on-accent, что
 * у Button на залитых вариантах и у StatusBadge: он даёт
 * element-text-primary светлым только там, где фон залит цветом.
 *
 * empty_size (8px, точка) не меняется по size в токенах ни на одном из
 * l/m/s — в отличие от with-content_height/min-width, которые скейлятся
 * 24/20/16.
 */
export function Indicator({
  view = 'accent',
  dot = false,
  count,
  size = 'l',
  className,
  ...rest
}: IndicatorProps) {
  return (
    <span
      {...rest}
      data-size={size}
      data-view={view}
      data-dot={dot || undefined}
      data-on-accent={view !== 'light' ? 'true' : undefined}
      className={[styles.indicator, className].filter(Boolean).join(' ')}
    >
      {!dot && <span className={styles.count}>{count}</span>}
    </span>
  );
}
