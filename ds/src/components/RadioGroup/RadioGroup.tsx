import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './RadioGroup.module.css';

type RadioGroupOwnProps = {
  title?: ReactNode;
  hint?: ReactNode;
  alert?: boolean;
  alertText?: ReactNode;
  /** Соответствует Direction в Figma. По умолчанию Horizontal — так же,
   * как в узле 134:567. */
  direction?: 'horizontal' | 'vertical';
  size?: 'l' | 'm' | 's';
};

export type RadioGroupProps = RadioGroupOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof RadioGroupOwnProps>;

/**
 * Группа радиокнопок. Узел 134:567 в Figma, сверен через MCP-мост — той
 * же структуры, что CheckboxGroup (134:567 симметричен 133:537).
 *
 * Ошибка — не рамка по контуру, а рамка только слева (border-left) во всю
 * высоту группы (заголовок + пункты + подсказка) плюс отступ слева на
 * ширину этой рамки.
 *
 * role="radiogroup" — правильная роль-контейнер для дочерних role="radio"
 * (в отличие от role="group" у CheckboxGroup). При этом переключение
 * стрелками между пунктами (roving tabindex, рекомендация APG для
 * нативного поведения radiogroup) сознательно не реализовано: группа, как
 * и Radio/RadioItem, не хранит состояние выбора и не переключает его сама
 * — реализовать стрелки означало бы забрать value/onChange у вызывающего
 * кода, а это ломает философию полностью управляемых компонентов, на
 * которой стоит вся остальная система.
 */
export function RadioGroup({
  title,
  hint,
  alert = false,
  alertText,
  direction = 'horizontal',
  size = 'l',
  id,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const titleId = title ? `${groupId}-title` : undefined;
  const hintText = alert ? alertText : hint;

  return (
    <div
      {...rest}
      id={id}
      role="radiogroup"
      aria-labelledby={titleId}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-alert={alert ? 'error' : undefined}
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
