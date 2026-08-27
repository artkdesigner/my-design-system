import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './CheckboxGroup.module.css';

type CheckboxGroupOwnProps = {
  title?: ReactNode;
  hint?: ReactNode;
  /** Тон уведомления. Одно значение, как у Checkbox/Button (не булев флаг):
   * режим AlertType в Figma стоит на самом компоненте. undefined —
   * уведомления нет. Узел 133:537. */
  alert?: 'info' | 'success' | 'warning' | 'error';
  alertText?: ReactNode;
  /** Соответствует Direction в Figma. По умолчанию Horizontal — так же,
   * как в узле 133:537. */
  direction?: 'horizontal' | 'vertical';
  size?: 'l' | 'm' | 's';
};

export type CheckboxGroupProps = CheckboxGroupOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof CheckboxGroupOwnProps>;

/**
 * Группа чекбоксов. Узел 133:537 в Figma, сверен через MCP-мост.
 *
 * Ошибка — не рамка по контуру, а рамка только слева (border-left) во всю
 * высоту группы (заголовок + пункты + подсказка) плюс отступ слева на
 * ширину этой рамки — сверено скриншотом (сплошная красная черта сбоку,
 * не коробка).
 *
 * Группа не хранит состояние дочерних чекбоксов и не переключает их: как и
 * сам Checkbox, она только раскладывает и подписывает, каждый дочерний
 * Checkbox управляется вызывающим кодом независимо (форма состояния —
 * массив id, Set, объект-карта — выбор снаружи, не забота группы).
 */
export function CheckboxGroup({
  title,
  hint,
  alert,
  alertText,
  direction = 'horizontal',
  size = 'l',
  id,
  className,
  children,
  ...rest
}: CheckboxGroupProps) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const titleId = title ? `${groupId}-title` : undefined;
  const hintText = alert ? alertText : hint;

  return (
    <div
      {...rest}
      id={id}
      role="group"
      aria-labelledby={titleId}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-alert={alert}
    >
      {title && (
        <div id={titleId} className={styles.title}>
          {title}
        </div>
      )}
      <div className={styles.items} data-direction={direction}>
        {children}
      </div>
      {hintText && <div className={styles.hint}>{hintText}</div>}
    </div>
  );
}
