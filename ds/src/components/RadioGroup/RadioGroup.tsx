import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './RadioGroup.module.css';

type RadioGroupOwnProps = {
  title?: ReactNode;
  hint?: ReactNode;
  alert?: boolean;
  alertText?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type RadioGroupProps = RadioGroupOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof RadioGroupOwnProps>;

/**
 * Группа радиокнопок — заголовок, ряд дочерних Radio с переносом строк и
 * общая подсказка/ошибка снизу. Той же структуры, что CheckboxGroup:
 * токены Radio/Group/* в tokens.map.json, items-gap_hor и items-gap_vert
 * существуют одновременно — раскладка flex-wrap. Узел в Figma этой сессией
 * не проверен (мост к MCP не поднялся — см. комментарий в Checkbox.tsx).
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
      data-alert={alert || undefined}
    >
      {title && (
        <div id={titleId} className={styles.title}>
          {title}
        </div>
      )}
      <div className={styles.items}>{children}</div>
      {hintText && <div className={styles.hint}>{hintText}</div>}
    </div>
  );
}
