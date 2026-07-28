import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Checkmark } from '../Checkmark';
import { Label } from '../Label';
import styles from './OptionListCell.module.css';

type OptionListCellOwnProps = {
  label: ReactNode;
  /** Отмечена ли опция. Соответствует свойству Selected у Checkmark внутри
   * (узел 120:666) — Checkmark сам гасит галочку до 10%, а не прячет,
   * место под неё остаётся при переключении. */
  selected?: boolean;
  size?: 'l' | 'm' | 's';
};

export type OptionListCellProps = OptionListCellOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof OptionListCellOwnProps | 'role'>;

/**
 * Строка списка опций. Узел 120:747 и соседние инстансы в Figma (сверены
 * через MCP-мост): Checkmark слева и подпись справа — подпись рисуется
 * готовым Label (тот же --label-label-size, что и в макете, без hint),
 * а не своим текстовым стилем.
 *
 * Кнопка с role="option" и aria-selected, не role="checkbox": это пункт
 * списка (одиночный или множественный выбор — решает вызывающий код через
 * то, сколько Cell разом получают selected), а не бинарный чекбокс.
 */
export function OptionListCell({
  label,
  selected = false,
  size = 'l',
  className,
  type = 'button',
  ...rest
}: OptionListCellProps) {
  return (
    <button
      {...rest}
      type={type}
      role="option"
      aria-selected={selected}
      data-size={size}
      className={[styles.cell, 'ds-interactive', className].filter(Boolean).join(' ')}
    >
      <Checkmark selected={selected} size={size} aria-hidden="true" />
      <Label label={label} size={size} className={styles.label} />
    </button>
  );
}
