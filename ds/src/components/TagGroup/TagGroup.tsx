import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './TagGroup.module.css';

type TagGroupOwnProps = {
  title?: ReactNode;
  hint?: ReactNode;
  /** Тон уведомления. Одно значение, как у Button (не булев флаг): режим
   * AlertType в Figma стоит на самом компоненте. undefined — уведомления
   * нет. Узел 134:4243. */
  alert?: 'info' | 'success' | 'warning' | 'error';
  alertText?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type TagGroupProps = TagGroupOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof TagGroupOwnProps>;

/**
 * Группа тегов. Узел 134:4243 в Figma, сверен через MCP-мост: тот же
 * состав, что у RadioGroup/CheckboxGroup — заголовок, ряд элементов
 * (Tag, через children, с переносом строк, а не зашитый список, как в
 * демо-варианте макета) и подсказка/ошибка под ним. Direction в Figma
 * сейчас только Horizontal — единственное значение в типе, поэтому
 * пропа под второй режим нет, пока в макете нет второго варианта.
 *
 * Ошибка — рамка только слева (border-left) во всю высоту группы плюс
 * отступ слева на её ширину, не рамка по контуру — тот же приём, что у
 * RadioGroup/CheckboxGroup.
 *
 * role="group" + aria-labelledby, как у CheckboxGroup, не role="radiogroup":
 * дочерние Tag — переключаемые кнопки (aria-pressed), не radio/checkbox.
 * Группа не хранит состояние дочерних тегов — как и сам Tag, каждый
 * управляется вызывающим кодом независимо.
 */
export function TagGroup({
  title,
  hint,
  alert,
  alertText,
  size = 'l',
  id,
  className,
  children,
  ...rest
}: TagGroupProps) {
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
      <div className={styles.items}>{children}</div>
      {hintText && <div className={styles.hint}>{hintText}</div>}
    </div>
  );
}
