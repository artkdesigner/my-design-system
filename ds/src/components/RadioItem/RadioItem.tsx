import type { ButtonHTMLAttributes } from 'react';
import styles from './RadioItem.module.css';

type RadioItemOwnProps = {
  /** Выбран ли пункт. Соответствует SelectedState в Figma (узел 134:548). */
  selected?: boolean;
  /** Размер. Соответствует режимам коллекции ComponentSize. */
  size?: 'l' | 'm' | 's';
};

export type RadioItemProps = RadioItemOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof RadioItemOwnProps | 'role'>;

/**
 * Кружок радиокнопки (узел 134:548) — сам индикатор, без подписи (та живёт
 * в обёртке Radio, которая ещё не построена). Кнопка с role="radio" +
 * aria-checked, не input: отрисовка полностью кастомная — тот же приём,
 * что у CheckboxItem, только с ролью radio вместо checkbox.
 *
 * В отличие от CheckboxItem, рамка не меняет цвет при выборе: сверено по
 * извлечённому коду обоих вариантов (134:549 выбран, 134:552 не выбран) —
 * в обоих border/element_border_secondary. Разница только в закрашенной
 * точке внутри (element_bg_action_primary), которая появляется и исчезает.
 *
 * Полностью управляемый компонент: selected приходит снаружи, сам себя не
 * переключает.
 */
export function RadioItem({
  selected = false,
  size = 'l',
  className,
  type = 'button',
  ...rest
}: RadioItemProps) {
  return (
    <button
      {...rest}
      type={type}
      role="radio"
      aria-checked={selected}
      className={[styles.button, 'ds-interactive', className].filter(Boolean).join(' ')}
      data-size={size}
    >
      {selected && <span className={styles.dot} aria-hidden="true" />}
    </button>
  );
}
