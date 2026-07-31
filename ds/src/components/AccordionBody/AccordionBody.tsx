import type { HTMLAttributes, ReactNode } from 'react';
import styles from './AccordionBody.module.css';

type AccordionBodyOwnProps = {
  /** custom — произвольный children (своё содержимое целиком); text —
   * встроенное начертание Body M через text. Соответствует
   * Preset=Custom/Text в Figma (узел 213:3754). */
  preset?: 'custom' | 'text';
  text?: ReactNode;
  children?: ReactNode;
};

export type AccordionBodyProps = AccordionBodyOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof AccordionBodyOwnProps>;

/**
 * Содержимое аккордеона. Узел 213:3754 в Figma, сверен через MCP-мост.
 */
export function AccordionBody({ preset = 'custom', text, children, className, ...rest }: AccordionBodyProps) {
  return (
    <div {...rest} data-preset={preset} className={[styles.body, className].filter(Boolean).join(' ')}>
      {preset === 'text' ? <p className={styles.text}>{text}</p> : children}
    </div>
  );
}
