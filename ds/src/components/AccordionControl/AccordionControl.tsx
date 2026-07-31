import type { HTMLAttributes } from 'react';
import { Icon } from '../Icon';
import styles from './AccordionControl.module.css';

type AccordionControlOwnProps = {
  /** Стиль стрелки. Соответствует Presets в Figma (узел 213:3925) —
   * там же есть третий пресет SwapMe, служебная плашка «замени на свою
   * иконку» для дизайнеров, в код не переносится. */
  preset?: 'downChevron' | 'rightChevron';
  open?: boolean;
};

export type AccordionControlProps = AccordionControlOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof AccordionControlOwnProps>;

/**
 * Стрелка-индикатор аккордеона. Узел 213:3925 в Figma, сверен через
 * MCP-мост: downChevron крутится 0↔180° (вниз в закрытом, вверх в
 * открытом), rightChevron — 0↔90° (вправо в закрытом, вниз в открытом).
 * Только иконка, без своего role/onClick — кликабелен весь заголовок
 * аккордеона (см. Accordion), а не сама стрелка.
 */
export function AccordionControl({ preset = 'downChevron', open = false, className, ...rest }: AccordionControlProps) {
  return (
    <span
      {...rest}
      aria-hidden="true"
      data-preset={preset}
      data-open={open || undefined}
      className={[styles.control, className].filter(Boolean).join(' ')}
    >
      <Icon name={preset === 'rightChevron' ? 'chevron-right' : 'chevron-down'} size="l" className={styles.icon} />
    </span>
  );
}
