import type { HTMLAttributes, ReactNode } from 'react';
import styles from './OptionListEmptyState.module.css';

type OptionListEmptyStateOwnProps = {
  text?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type OptionListEmptyStateProps = OptionListEmptyStateOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof OptionListEmptyStateOwnProps>;

/**
 * Пустое состояние списка опций. Узел 120:9181 в Figma, сверен через
 * MCP-мост: показывается в OptionList вместо ряда OptionListCell, когда
 * поиск через OptionListHeader (preset="search") не дал совпадений —
 * фильтрация того, что показывать, остаётся на вызывающем коде, этот
 * компонент только рисует сам текст состояния.
 */
export function OptionListEmptyState({
  text = 'Ничего не нашлось',
  size = 'l',
  className,
  ...rest
}: OptionListEmptyStateProps) {
  return (
    <div {...rest} data-size={size} className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
