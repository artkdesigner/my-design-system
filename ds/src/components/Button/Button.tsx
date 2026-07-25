import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonOwnProps = {
  /** Вид кнопки. Соответствует свойству View в Figma. */
  view?: 'accent' | 'primary' | 'secondary';
  /** Размер. Соответствует режимам коллекции ComponentSize. */
  size?: 'l' | 'm' | 's';
  /** Прозрачная кнопка без заливки. */
  ghost?: boolean;
  /**
   * Тон сообщения. Соответствует свойству Message в Figma вместе с режимом
   * коллекции ColorsMessage: в Figma это флаг плюс режим, в коде — одно
   * значение, потому что режим всё равно обязан стоять на самой кнопке.
   */
  message?: 'info' | 'success' | 'warning' | 'error';
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
 * из слоёв токенов. Два режима он выставляет сам на себе:
 *
 *   — `data-on-accent` на залитых видах и на прозрачной кнопке с тоном.
 *     Сверено по двум образцам из макета (залитая кнопка и прозрачная
 *     опасная): значения токенов совпадают с макетом и по имени, и по
 *     значению только в режиме onAccent — element_text_primary там #ffffff,
 *     element_border_message_secondary #cc2929. На обычной прозрачной кнопке
 *     без тона режим не включается: у неё нет цветной заливки под подписью,
 *     поэтому нужны обычные (не onAccent) значения — иначе, скажем, обводка
 *     и подпись вида primary становятся белыми на белом фоне и пропадают.
 *     Сверено по узлам 80:2324 (primary) и 245:3773 (secondary): там
 *     element_text_primary и element_border_primary/secondary даны в
 *     умолчательном режиме, не в onAccent.
 *   — `data-message` с тоном, когда передан проп message. Тон обязан стоять
 *     на самой кнопке, а не на контейнере вокруг неё: с контейнера он
 *     переживает покой, но под наведением сбрасывается в info, потому что
 *     переизлучение слоя сообщений в .ds-interactive:hover объявляет его
 *     умолчательный режим. Составные селекторы выручают только когда режим
 *     на том же элементе — проверено на живом CSS.
 *
 * Пометка режима на самом интерактивном элементе работает только потому, что
 * генератор выдаёт составные селекторы вида
 * .ds-interactive:hover[data-message="error"]. Без них переизлучение слоя
 * в .ds-interactive:hover перебивало пометку по специфичности: опасная кнопка
 * под наведением синела, а подпись недоступной пропадала.
 */
export function Button({
  view = 'accent',
  size = 'l',
  ghost = false,
  message,
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
      data-icon-only={isIconOnly || undefined}
      data-on-accent={!ghost || message ? 'true' : undefined}
      data-message={message}
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
