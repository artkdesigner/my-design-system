import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Addon } from '../Addon';
import styles from './Segment.module.css';

type SegmentOwnProps = {
  /** Выбран ли сегмент. Узел 170:2952 в Figma — свойство Selected.
   * Полностью управляемый компонент: сам себя не переключает, как
   * CheckboxItem/RadioItem — переключает вызывающий код (SegmentedControl). */
  selected?: boolean;
  size?: 'l' | 'm' | 's';
  /** Левый декоративный слот Addon. Те же ограничения, что у Button:
   * только Icon/Checkmark/Spinner — слот всегда aria-hidden. */
  iconLeft?: ReactNode;
  /** Правый декоративный слот Addon. Те же ограничения, что у iconLeft. */
  iconRight?: ReactNode;
  children?: ReactNode;
};

export type SegmentProps = SegmentOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SegmentOwnProps | 'role'>;

/**
 * Один сегмент составного переключателя. Узел 170:2952 в Figma, сверен
 * через MCP-мост: `Icon only` в макете — не проп, а следствие (та же
 * логика, что у Button): сегмент без подписи, но с иконкой считается
 * иконочным.
 *
 * Кнопка с role="radio" + aria-checked, а не role="button": сегменты
 * внутри SegmentedControl — взаимоисключающий выбор одного варианта, тот
 * же смысл, что у RadioItem, только в виде связанных кнопок, а не
 * кружков. Сгруппированы будут через role="radiogroup" на SegmentedControl.
 *
 * Заливка и цвет содержимого — как у залитых видов Button: выбранный
 * сегмент получает bg_action_accent и белую подпись/иконки через
 * data-on-accent (та же переизлучающая пометка, что у Button, сверено
 * по тем же токенам), невыбранный — bg_action_tetriary и обычный тёмный
 * текст, без on-accent.
 */
export function Segment({
  selected = false,
  size = 'l',
  iconLeft,
  iconRight,
  children,
  className,
  type = 'button',
  ...rest
}: SegmentProps) {
  const hasLabel = children !== undefined && children !== null && children !== false;
  const isIconOnly = !hasLabel && Boolean(iconLeft || iconRight);

  return (
    <button
      {...rest}
      type={type}
      role="radio"
      aria-checked={selected}
      data-size={size}
      data-selected={selected || undefined}
      data-icon-only={isIconOnly || undefined}
      data-on-accent={selected || undefined}
      className={[styles.segment, 'ds-interactive', className].filter(Boolean).join(' ')}
    >
      {iconLeft && (
        <Addon size={size} className={styles.addon} aria-hidden="true">
          {iconLeft}
        </Addon>
      )}
      {hasLabel && <span className={styles.label}>{children}</span>}
      {iconRight && (
        <Addon size={size} className={styles.addon} aria-hidden="true">
          {iconRight}
        </Addon>
      )}
    </button>
  );
}
