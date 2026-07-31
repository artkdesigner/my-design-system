import type { HTMLAttributes } from 'react';
import styles from './ProgressBar.module.css';

type ProgressBarOwnProps = {
  /** Прогресс в процентах, 0–100. */
  value: number;
  /** Соответствует Size=Big/Small в Figma. */
  size?: 'l' | 's';
};

export type ProgressBarProps = ProgressBarOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof ProgressBarOwnProps>;

/**
 * Полоса прогресса. Узел 188:4631 в Figma (варианты Size=Big/Small),
 * сверен через MCP-мост: трек bg_element_bg_lvl_2 и заливка
 * bg_element_bg_action_primary, оба со скруглением radius_max — своих
 * алиасов у узла нет, поэтому размеры и цвета берутся из общих
 * примитивов Scales/Radius, как и в самом макете (см. Scrollbar).
 *
 * В макете внутри заливки есть служебный узел «fixer» — это обход
 * бага рендера Figma, из-за которого узкая заливка со скруглением
 * radius_max выглядит некорректно; в CSS border-radius на любой ширине
 * рисуется правильно сам по себе, так что отдельный элемент не нужен.
 */
export function ProgressBar({ value, size = 'l', className, ...rest }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      {...rest}
      data-size={size}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={[styles.track, className].filter(Boolean).join(' ')}
    >
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  );
}
