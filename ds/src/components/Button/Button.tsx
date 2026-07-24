import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonOwnProps = {
  /** Вид кнопки. Соответствует свойству View в Figma. */
  view?: 'accent' | 'primary' | 'secondary';
  /** Размер. Соответствует режимам коллекции ComponentSize. */
  size?: 'l' | 'm' | 's';
  /** Прозрачная кнопка без заливки. */
  ghost?: boolean;
  /** Опасное действие: удаление, отмена, отключение. */
  danger?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
};

export type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

/**
 * Кнопка дизайн-системы.
 *
 * Свойства Figma переносятся не один в один: `Icon only` не проп, а следствие —
 * кнопка без текста, но с иконкой считается иконочной. Это убирает
 * противоречивое состояние «iconOnly включён, но текст передан».
 *
 * О темах, состояниях и размерах компонент не знает: значения приходят
 * из слоёв токенов. Один переключатель он выставляет сам на себе —
 * `data-message="error"` на опасном действии: отдельных «опасных» токенов
 * в дизайн-системе нет, опасность выражена режимом коллекции сообщений.
 *
 * Пометка режима на самом интерактивном элементе работает только потому, что
 * генератор выдаёт составные селекторы вида
 * .ds-interactive:hover[data-message="error"]. Без них переизлучение слоя
 * сообщений в .ds-interactive:hover перебивало [data-message="error"] по
 * специфичности, и опасная кнопка под наведением синела.
 */
export function Button({
  view = 'accent',
  size = 'l',
  ghost = false,
  danger = false,
  iconLeft,
  iconRight,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const hasLabel = children !== undefined && children !== null && children !== false;
  const isIconOnly = !hasLabel && Boolean(iconLeft || iconRight);

  return (
    <button
      {...rest}
      type={type}
      className={[styles.button, 'ds-interactive', className].filter(Boolean).join(' ')}
      data-view={view}
      data-size={size}
      data-ghost={ghost || undefined}
      data-danger={danger || undefined}
      data-icon-only={isIconOnly || undefined}
      data-message={danger ? 'error' : undefined}
    >
      {iconLeft && (
        <span className={styles.addon} aria-hidden="true">
          {iconLeft}
        </span>
      )}
      {hasLabel && <span className={styles.label}>{children}</span>}
      {iconRight && (
        <span className={styles.addon} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
}
