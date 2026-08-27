import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Addon } from '../Addon';
import styles from './TextButton.module.css';

type TextButtonOwnProps = {
  /** Вид. Соответствует свойству View в Figma (без Secondary — там его нет). */
  view?: 'accent' | 'primary';
  /** Размер. Соответствует режимам коллекции ComponentSize. */
  size?: 'l' | 'm' | 's';
  /** Тон уведомления — как у Button: одно значение вместо флага плюс режим. */
  alert?: 'info' | 'success' | 'warning' | 'error';
  addonLeft?: ReactNode;
  addonRight?: ReactNode;
  children: ReactNode;
};

export type TextButtonProps = TextButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof TextButtonOwnProps>;

/**
 * Текстовая кнопка-ссылка дизайн-системы: подпись без заливки и рамки,
 * цвет — от вида или тона сообщения.
 *
 * В отличие от Button, здесь нет заливки ни в одном состоянии — компонент
 * всегда «прозрачный». Поэтому режим onAccent (он у Button отвечает за то,
 * что подпись становится светлой на цветном фоне) включается только тогда,
 * когда есть тон уведомления: в макете (узел 179:2690, тон error) цвет
 * подписи element_text_alert равен #cc2929 — то же значение, что и без
 * onAccent, так что различие тут не в цвете, а в следовании общей формуле
 * Button (`data-on-accent = !ghost || alert`, где для TextButton ghost
 * всегда истинен, значит формула сводится к `alert`).
 */
export function TextButton({
  view = 'accent',
  size = 'l',
  alert,
  addonLeft,
  addonRight,
  children,
  className,
  type = 'button',
  ...rest
}: TextButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={[styles.button, 'ds-interactive', className].filter(Boolean).join(' ')}
      data-view={view}
      data-size={size}
      data-on-accent={alert ? 'true' : undefined}
      data-alert={alert}
    >
      {addonLeft && (
        <Addon size={size} className={styles.addon} aria-hidden="true">
          {addonLeft}
        </Addon>
      )}
      <span className={styles.label}>{children}</span>
      {addonRight && (
        <Addon size={size} className={styles.addon} aria-hidden="true">
          {addonRight}
        </Addon>
      )}
    </button>
  );
}
