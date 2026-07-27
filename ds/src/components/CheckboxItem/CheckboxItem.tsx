import type { ButtonHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import styles from './CheckboxItem.module.css';

type CheckboxItemOwnProps = {
  /**
   * Состояние. В Figma (узел 125:2384) это пара SelectedState/
   * IndeterminateState: unchecked = false/false, checked = true/false,
   * indeterminate = true/true — четвёртой комбинации (false/true) в
   * макете нет. Поэтому в коде один проп с тремя значениями, а не два
   * независимых булевых, которые позволили бы собрать несуществующую
   * в дизайне комбинацию.
   */
  state?: 'unchecked' | 'checked' | 'indeterminate';
  /** Размер. Соответствует режимам коллекции ComponentSize. */
  size?: 'l' | 'm' | 's';
};

export type CheckboxItemProps = CheckboxItemOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CheckboxItemOwnProps | 'role'>;

/**
 * Маленький квадрат чекбокса (узел 125:2384) — сам индикатор, без подписи
 * и подсказки (те живут в обёртке Checkbox, которая ещё не построена).
 * Кнопка, а не input: отрисовка полностью кастомная, не браузерный
 * чекбокс, поэтому доступность даёт role="checkbox" + aria-checked, а не
 * нативный тип поля — тот же приём, что у остальных интерактивных
 * элементов дизайн-системы, только с ролью чекбокса вместо кнопки.
 * aria-checked="mixed" — ровно то, что нужно для indeterminate без
 * нативного input.indeterminate (которое и так нельзя задать HTML-атрибутом,
 * только через ref).
 *
 * Полностью управляемый компонент: state приходит снаружи, сам себя не
 * переключает — вызывающий код меняет его по клику.
 */
export function CheckboxItem({
  state = 'unchecked',
  size = 'l',
  className,
  type = 'button',
  ...rest
}: CheckboxItemProps) {
  return (
    <button
      {...rest}
      type={type}
      role="checkbox"
      aria-checked={state === 'indeterminate' ? 'mixed' : state === 'checked'}
      className={[styles.button, 'ds-interactive', className].filter(Boolean).join(' ')}
      data-size={size}
    >
      {state === 'checked' && <Icon name="check" size={size} className={styles.icon} aria-hidden="true" />}
      {state === 'indeterminate' && <Icon name="dash" size={size} className={styles.icon} aria-hidden="true" />}
    </button>
  );
}
