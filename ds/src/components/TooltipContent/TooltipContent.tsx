import type { HTMLAttributes, ReactNode } from 'react';
import styles from './TooltipContent.module.css';

type TooltipContentOwnProps = {
  /** Соответствует Preset в Figma (узел 181:981): Text — готовая типографика
   * под простую строку (проп text), Custom — пустой слот под произвольное
   * содержимое (проп children). Названо preset, а не type — тот же приём,
   * что mode у TagControl, type занят под смысл вида поля. */
  preset?: 'text' | 'custom';
  /** Текст при preset="text". */
  text?: ReactNode;
  /** Содержимое слота при preset="custom". */
  children?: ReactNode;
};

export type TooltipContentProps = TooltipContentOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof TooltipContentOwnProps>;

/**
 * Содержимое тела тултипа. Узел 181:981 в Figma, сверен через MCP-мост.
 *
 * В макете Custom представлен как фиксированная рамка 240×48 — но это
 * размер конкретного демо-инстанса на канвасе, не размерный токен (для
 * него в Figma нет переменной): реальный слот здесь без прибитых
 * width/height, тянется по содержимому, как stepper-слот у Input.
 */
export function TooltipContent({ preset = 'text', text, children, className, ...rest }: TooltipContentProps) {
  return (
    <div {...rest} className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {preset === 'text' ? <p className={styles.text}>{text}</p> : children}
    </div>
  );
}
