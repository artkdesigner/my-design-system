import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './SelectTag.module.css';

type SelectTagOwnProps = {
  label: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type SelectTagProps = SelectTagOwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SelectTagOwnProps>;

/**
 * Тег выбранного значения внутри ValueList. Узел 144:10250 в Figma, сверен
 * через MCP-мост: заливка всегда тёмная (element_bg_action_primary), в
 * отличие от переключаемого Tag тут нет состояния «не выбран» — сам факт
 * присутствия тега в списке и есть выбор, поэтому data-on-accent стоит
 * всегда, а не по условию, как в Tag[data-selected].
 *
 * Свои токены (select_selecttag_*), не переиспользование --tag-*: в Figma
 * это отдельная коллекция размеров, значения сейчас частично совпадают с
 * Tag, но могут разойтись.
 *
 * Крестик — не отдельный проп-обработчик, а сама кнопка: клик по всему тегу
 * убирает значение, тот же приём, что у переключаемого Tag. В disabled
 * варианте (147:5775) крестика нет вовсе — значение закреплено, убрать
 * нельзя, поэтому и кликать не по чему.
 */
export function SelectTag({ label, size = 'l', disabled, className, type = 'button', ...rest }: SelectTagProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      data-size={size}
      data-on-accent="true"
      className={[styles.tag, 'ds-interactive', className].filter(Boolean).join(' ')}
    >
      <span className={styles.label}>{label}</span>
      {!disabled && (
        <span className={styles.close} aria-hidden="true">
          <Icon name="x-circle-filled" size={size} />
        </span>
      )}
    </button>
  );
}
