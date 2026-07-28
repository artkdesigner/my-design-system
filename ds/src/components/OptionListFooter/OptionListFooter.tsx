import type { HTMLAttributes, ReactNode } from 'react';
import styles from './OptionListFooter.module.css';

type OptionListFooterOwnProps = {
  children?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type OptionListFooterProps = OptionListFooterOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof OptionListFooterOwnProps>;

/**
 * Подвал списка опций. Узел 120:13568 в Figma, сверен через MCP-мост: в
 * макете внутри две кнопки (заливка + прозрачная), но текст на них — просто
 * плейсхолдер «Button», не осмысленная надпись, поэтому подвал не рисует
 * кнопки сам, а остаётся слотом — вызывающий код передаёт свои Button
 * через children, как в сторис.
 */
export function OptionListFooter({ children, size = 'l', className, ...rest }: OptionListFooterProps) {
  return (
    <div {...rest} data-size={size} className={[styles.footer, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
