import type { HTMLAttributes } from 'react';
import styles from './SegmentedControl.module.css';

type SegmentedControlOwnProps = {
  /** Растягивать ли сегменты на всю ширину поровну. Соответствует свойству
   * Adaptive в Figma (узел 171:3015): выключено — сегменты по контенту,
   * включено — flex:1 на каждом. */
  adaptive?: boolean;
  size?: 'l' | 'm' | 's';
};

export type SegmentedControlProps = SegmentedControlOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof SegmentedControlOwnProps>;

/**
 * Группа сегментов. Узел 171:3015 в Figma, сверен через MCP-мост: как
 * RadioGroup — только раскладка и role="radiogroup", без хранения
 * выбранного значения. Вызывающий код сам рисует Segment с нужными
 * selected/onClick — группа их не клонирует и не оборачивает, та же
 * философия полностью управляемых компонентов, что у RadioGroup.
 *
 * adaptive растягивает сегменты через CSS-правило на прямых детях, а не
 * проп у самого Segment: тянуться должен любой прямой потомок группы
 * (тот же приём, что gap/direction у RadioGroup.items), а не только
 * компонент Segment, который про группу ничего не знает.
 */
export function SegmentedControl({
  adaptive = false,
  size = 'l',
  className,
  children,
  ...rest
}: SegmentedControlProps) {
  return (
    <div
      {...rest}
      role="radiogroup"
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-adaptive={adaptive || undefined}
    >
      {children}
    </div>
  );
}
