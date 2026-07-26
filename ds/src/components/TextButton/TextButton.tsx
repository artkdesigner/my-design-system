import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './TextButton.module.css';

type TextButtonOwnProps = {
  /** Вид. Соответствует свойству View в Figma (без Secondary — там его нет). */
  view?: 'accent' | 'primary';
  /** Размер. Соответствует режимам коллекции ComponentSize. */
  size?: 'l' | 'm' | 's';
  /** Тон сообщения — как у Button: одно значение вместо флага плюс режим. */
  message?: 'info' | 'success' | 'warning' | 'error';
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
 * когда есть тон сообщения: в макете (узел 179:2690, тон error) цвет подписи
 * element_text_message равен #cc2929 — то же значение, что и без onAccent,
 * так что различие тут не в цвете, а в следовании общей формуле Button
 * (`data-on-accent = !ghost || message`, где для TextButton ghost всегда
 * истинен, значит формула сводится к `message`).
 */
export function TextButton({
  view = 'accent',
  size = 'l',
  message,
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
      data-on-accent={message ? 'true' : undefined}
      data-message={message}
    >
      {addonLeft && (
        <span className={styles.addon} aria-hidden="true">
          {addonLeft}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {addonRight && (
        <span className={styles.addon} aria-hidden="true">
          {addonRight}
        </span>
      )}
    </button>
  );
}
