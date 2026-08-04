import type { ButtonHTMLAttributes } from 'react';
import styles from './SwitchItem.module.css';

type SwitchItemOwnProps = {
  checked?: boolean;
  /** Размер. Соответствует режимам коллекции ComponentSize. */
  size?: 'l' | 'm' | 's';
};

export type SwitchItemProps = SwitchItemOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SwitchItemOwnProps | 'role'>;

/**
 * Пилюля переключателя (узел 169:2319 в Figma) — сам индикатор, без подписи
 * и подсказки (те живут в обёртке Switch). role="switch" — у ARIA есть
 * готовая роль ровно под два состояния; в отличие от CheckboxItem (там
 * пришлось эмулировать role="checkbox" из-за третьего indeterminate
 * состояния), здесь третьего состояния в макете нет, поэтому используется
 * настоящая роль switch с булевым aria-checked без обходных путей.
 *
 * Полностью управляемый: checked приходит снаружи, сам себя не переключает.
 */
export function SwitchItem({
  checked = false,
  size = 'l',
  className,
  type = 'button',
  ...rest
}: SwitchItemProps) {
  return (
    <button
      {...rest}
      type={type}
      role="switch"
      aria-checked={checked}
      data-size={size}
      data-checked={checked || undefined}
      className={[styles.track, 'ds-interactive', className].filter(Boolean).join(' ')}
    >
      <span className={styles.thumb} aria-hidden="true" />
    </button>
  );
}
