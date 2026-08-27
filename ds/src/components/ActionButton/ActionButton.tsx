import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Addon } from '../Addon';
import { Spinner } from '../Spinner';
import styles from './ActionButton.module.css';

type ActionButtonOwnProps = {
  /** Вид. Соответствует свойству View в Figma (только Accent и Primary). */
  view?: 'accent' | 'primary';
  /** Размер. Соответствует режимам коллекции ComponentSize. */
  size?: 'l' | 'm' | 's';
  /** Прозрачный круг с обводкой вместо заливки. */
  ghost?: boolean;
  /** Тон уведомления — как у Button (там же проп называется alert). Имя
   * следует за Figma: у ActionButton это свойство Alert/AlertType, а не
   * Message, как у Button/TextButton. */
  alert?: 'info' | 'success' | 'warning' | 'error';
  /**
   * Состояние загрузки (узел спеки 446:1323, State=Loading): в круге
   * Spinner вместо иконки, заливка вида не меняется. В отличие от Button,
   * подпись под кругом не прячется — в макете на состоянии Loading подпись
   * осталась на месте, спрятана только иконка внутри круга.
   *
   * Не через HTML `disabled` по той же причине, что и у Button: `:disabled`
   * красит и круг, и подпись в серый через state.css (состояние Disabled),
   * а Loading в макете остаётся цветом вида. Клик блокируется без него —
   * `onClick` не передаётся дальше, `pointer-events: none` в CSS глушит
   * наведение и клик мышью.
   */
  loading?: boolean;
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
  alert,
  loading = false,
  icon,
  children,
  className,
  type = 'button',
  onClick,
  ...rest
}: ActionButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      onClick={loading ? undefined : onClick}
      className={[styles.button, 'ds-interactive', className].filter(Boolean).join(' ')}
      data-view={view}
      data-size={size}
      data-ghost={ghost || undefined}
      data-alert={alert}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
    >
      <span className={styles.circle} data-on-accent={!ghost || alert ? 'true' : undefined}>
        {loading ? (
          <Spinner size={size} />
        ) : (
          <Addon size={size} aria-hidden="true">
            {icon}
          </Addon>
        )}
      </span>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
