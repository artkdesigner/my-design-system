import type { HTMLAttributes, ReactNode } from 'react';
import styles from './AccordionTitle.module.css';

type AccordionTitleOwnProps = {
  /** custom — произвольный children (свой заголовок целиком); title —
   * встроенное начертание Heading S через titleText. Соответствует
   * Preset=Custom/Title в Figma (узел 213:3769). */
  preset?: 'custom' | 'title';
  titleText?: ReactNode;
  children?: ReactNode;
};

export type AccordionTitleProps = AccordionTitleOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof AccordionTitleOwnProps>;

/**
 * Заголовок аккордеона. Узел 213:3769 в Figma, сверен через MCP-мост.
 */
export function AccordionTitle({ preset = 'custom', titleText, children, className, ...rest }: AccordionTitleProps) {
  return (
    <div {...rest} data-preset={preset} className={[styles.title, className].filter(Boolean).join(' ')}>
      {preset === 'title' ? <p className={styles.text}>{titleText}</p> : children}
    </div>
  );
}
