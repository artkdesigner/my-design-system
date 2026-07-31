import type { ButtonHTMLAttributes } from 'react';
import styles from './PageButton.module.css';

type PageButtonOwnProps = {
  page: number;
  selected?: boolean;
  /** Плашка «…» на месте пропущенного диапазона страниц — не кнопка,
   * некликабельна. Соответствует Hidden в Figma (узел 205:5918). */
  hidden?: boolean;
};

export type PageButtonProps = PageButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof PageButtonOwnProps>;

/**
 * Кнопка номера страницы. Узел 205:5918 в Figma, сверен через MCP-мост.
 */
export function PageButton({ page, selected = false, hidden = false, className, type = 'button', ...rest }: PageButtonProps) {
  if (hidden) {
    return (
      <span aria-hidden="true" className={[styles.button, styles.ellipsis, className].filter(Boolean).join(' ')}>
        …
      </span>
    );
  }

  return (
    <button
      {...rest}
      type={type}
      data-selected={selected || undefined}
      data-on-accent={selected ? 'true' : undefined}
      aria-current={selected ? 'page' : undefined}
      className={[styles.button, 'ds-interactive', className].filter(Boolean).join(' ')}
    >
      {page}
    </button>
  );
}
