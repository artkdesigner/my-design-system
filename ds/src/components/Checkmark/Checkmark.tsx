import type { HTMLAttributes } from 'react';
import { Icon } from '../Icon';
import styles from './Checkmark.module.css';

type CheckmarkOwnProps = {
  /**
   * Отмечена ли опция. Соответствует свойству Selected в Figma (узел
   * 120:666, используется в OptionsList). Невыбранное состояние не прячет
   * галочку совсем, а гасит её до 10% непрозрачности (сверено скриншотом) —
   * место под неё остаётся, чтобы список не менял высоту при переключении.
   */
  selected?: boolean;
  /** Размер. Соответствует режимам ComponentSize — своему --checkmark-size.
   * Сейчас те же значения, что у --addon-size, но в Figma это отдельная
   * переменная компонента, поэтому и в коде отдельный токен, не переиспользование
   * addon-size. */
  size?: 'l' | 'm' | 's';
};

export type CheckmarkProps = CheckmarkOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, keyof CheckmarkOwnProps>;

/**
 * Индикатор выбранной опции. Своего рисунка нет: Vector внутри узла 120:669
 * в точности совпадает с иконкой check из icons.generated.ts (тот же путь,
 * уже вписанный в сетку 24×24), поэтому Checkmark берёт готовую Icon, а сам
 * отвечает только за место (--checkmark-size) и переключение видимости.
 */
export function Checkmark({ selected = false, size = 'l', className, ...rest }: CheckmarkProps) {
  return (
    <span
      {...rest}
      data-size={size}
      data-selected={selected || undefined}
      className={[styles.checkmark, className].filter(Boolean).join(' ')}
    >
      <Icon name="check" size={size} />
    </span>
  );
}
