import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './CheckboxGroup.module.css';

type CheckboxGroupOwnProps = {
  title?: ReactNode;
  hint?: ReactNode;
  alert?: boolean;
  alertText?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type CheckboxGroupProps = CheckboxGroupOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof CheckboxGroupOwnProps>;

/**
 * Группа чекбоксов — заголовок, ряд дочерних Checkbox с переносом строк и
 * общая подсказка/ошибка снизу. Токены — Checkbox/Group/* в
 * tokens.map.json: items-gap_hor и items-gap_vert существуют одновременно,
 * поэтому раскладка — flex-wrap (row-gap/column-gap), а не одна колонка;
 * узел в Figma этой сессией не проверен (мост к MCP не поднялся, см.
 * комментарий в Checkbox.tsx) — при появлении моста стоит сверить.
 *
 * Группа не хранит состояние дочерних чекбоксов и не переключает их: как и
 * сам Checkbox, она только раскладывает и подписывает, каждый дочерний
 * Checkbox управляется вызывающим кодом независимо (форма состояния —
 * массив id, Set, объект-карта — выбор снаружи, не забота группы).
 */
export function CheckboxGroup({
  title,
  hint,
  alert = false,
  alertText,
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
