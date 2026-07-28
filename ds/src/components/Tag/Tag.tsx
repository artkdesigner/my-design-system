import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Addon } from '../Addon';
import styles from './Tag.module.css';

type TagOwnProps = {
  label?: ReactNode;
  /** Выбран ли тег. Полностью управляемый проп, как у Checkbox/Radio —
   * сам себя не переключает, решает вызывающий код. */
  selected?: boolean;
  corners?: 'rounded' | 'square';
  size?: 'l' | 'm' | 's';
  leftAddon?: ReactNode;
  /** Только в режиме с подписью — у icon-only в макете нет правого слота. */
  rightAddon?: ReactNode;
};

export type TagProps = TagOwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof TagOwnProps>;

/**
 * Тег-переключатель. Узел 134:4198 в Figma, сверен через MCP-мост: залитая
 * пилюля (corners=rounded) или скруглённый прямоугольник (corners=square),
 * переключается между «выбран» (element_bg_action_primary, белый текст и
 * иконки через on-accent — тот же механизм, что у залитой Button/
 * ActionButton) и «не выбран» (element_bg_action_tetriary, обычный тёмный
 * текст, без on-accent).
 *
 * `iconOnly` не проп, а следствие отсутствия label — тот же приём, что у
 * Button («иконка без текста = иконочная кнопка»): без подписи тег
 * превращается в квадрат/круг под один leftAddon, rightAddon в этом режиме
 * не рисуется вовсе (в макете у icon-only только один слот). Без label
 * обязателен aria-label — доступное имя иначе не появится.
 */
export function Tag({
  label,
  selected = false,
  corners = 'rounded',
  size = 'l',
  leftAddon,
  rightAddon,
  className,
  type = 'button',
  ...rest
}: TagProps) {
  const iconOnly = !label;

  return (
    <button
      {...rest}
      type={type}
      aria-pressed={selected}
      data-size={size}
      data-corners={corners}
      data-selected={selected || undefined}
      data-on-accent={selected || undefined}
      data-icon-only={iconOnly || undefined}
      className={[styles.tag, 'ds-interactive', className].filter(Boolean).join(' ')}
    >
      {leftAddon && (
        <Addon size={size} className={styles.addon} aria-hidden="true">
          {leftAddon}
        </Addon>
      )}
      {!iconOnly && label && <span className={styles.label}>{label}</span>}
      {!iconOnly && rightAddon && (
        <Addon size={size} className={styles.addon} aria-hidden="true">
          {rightAddon}
        </Addon>
      )}
    </button>
  );
}
