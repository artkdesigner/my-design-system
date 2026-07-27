import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Addon } from '../Addon';
import styles from './ActionButton.module.css';

type ActionButtonOwnProps = {
  /** Вид. Соответствует свойству View в Figma (только Accent и Primary). */
  view?: 'accent' | 'primary';
  /** Размер. Соответствует режимам коллекции ComponentSize. */
  size?: 'l' | 'm' | 's';
  /** Прозрачный круг с обводкой вместо заливки. */
  ghost?: boolean;
  /** Тон сообщения — как у Button. */
  message?: 'info' | 'success' | 'warning' | 'error';
  icon: ReactNode;
  children: ReactNode;
};

export type ActionButtonProps = ActionButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ActionButtonOwnProps>;

/**
 * Круглая кнопка действия с иконкой и подписью под ней.
 *
 * В отличие от Button, подпись здесь лежит не на заливке, а на фоне страницы
 * под кругом — сверено по макету на четырёх образцах (accent/primary,
 * залитая и ghost): во всех подпись берёт обычный, не-onAccent токен
 * (element_text_accent / element_text_primary). Поэтому режим onAccent
 * выставляется не на всю кнопку, а только на круг — там, где иконка
 * действительно лежит на заливке и primary-иконке нужен белый вместо
 * тёмного, чтобы не потеряться на своём же фоне.
 */
export function ActionButton({
  view = 'accent',
  size = 'l',
  ghost = false,
  message,
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: ActionButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={[styles.button, 'ds-interactive', className].filter(Boolean).join(' ')}
      data-view={view}
      data-size={size}
      data-ghost={ghost || undefined}
      data-message={message}
    >
      <span className={styles.circle} data-on-accent={!ghost || message ? 'true' : undefined}>
        <Addon size={size} aria-hidden="true">
          {icon}
        </Addon>
      </span>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
