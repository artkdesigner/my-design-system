import type { HTMLAttributes, ReactNode } from 'react';
import styles from './AccordionHeader.module.css';

type AccordionHeaderOwnProps = {
  /** custom — произвольный children (свой заголовок целиком); title —
   * встроенное начертание Heading S через titleText. Соответствует
   * Preset=Custom/Title в Figma (узел 213:3769). */
  preset?: 'custom' | 'title';
  titleText?: ReactNode;
  children?: ReactNode;
};

export type AccordionHeaderProps = AccordionHeaderOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof AccordionHeaderOwnProps>;

/**
 * Заголовок аккордеона. Узел 213:3769 в Figma, сверен через MCP-мост.
 * Компонент назывался AccordionTitle, дизайнер переименовал его в
 * AccordionHeader в Figma — здесь подхвачено то же имя, preset-значения
 * (custom/title) в Figma не менялись.
 */
export function AccordionHeader({ preset = 'custom', titleText, children, className, ...rest }: AccordionHeaderProps) {
  return (
    <div {...rest} data-preset={preset} className={[styles.header, className].filter(Boolean).join(' ')}>
      {preset === 'title' ? <p className={styles.text}>{titleText}</p> : children}
    </div>
  );
}
