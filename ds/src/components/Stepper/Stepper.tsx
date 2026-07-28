import type { HTMLAttributes } from 'react';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import styles from './Stepper.module.css';

type StepperOwnProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  size?: 'l' | 'm' | 's';
  /** Отключает обе кнопки независимо от границ диапазона — например, когда
   * недоступно всё поле, в которое встроен Stepper (см. NumberInput). */
  disabled?: boolean;
  decrementLabel?: string;
  incrementLabel?: string;
};

export type StepperProps = StepperOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof StepperOwnProps>;

/**
 * Счётчик количества. Узел 144:2936 в Figma, сверен через MCP-мост: две
 * IconButton вида secondary (тот же element_icon_secondary, что в макете)
 * вокруг разделителя. Приглушённый цвет кнопки на границе диапазона
 * (состояния Min/Max в макете) — не своя раскраска, а обычный нативный
 * disabled на IconButton: серый оттенок приходит из уже готового
 * .ds-interactive:disabled, отдельной логики цвета в Stepper нет.
 *
 * Полностью управляемый, как Input: value приходит снаружи, Stepper сам
 * не хранит состояние — на клик зовёт onChange с уже обрезанным по
 * min/max значением.
 */
export function Stepper({
  value,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onChange,
  size = 'l',
  disabled = false,
  decrementLabel = 'Уменьшить',
  incrementLabel = 'Увеличить',
  className,
  ...rest
}: StepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  return (
    <div {...rest} data-size={size} className={[styles.stepper, className].filter(Boolean).join(' ')}>
      <IconButton
        view="secondary"
        size={size}
        icon={<Icon name="dash" />}
        aria-label={decrementLabel}
        disabled={disabled || value <= min}
        onClick={() => onChange?.(clamp(value - step))}
      />
      <span className={styles.separator} aria-hidden="true" />
      <IconButton
        view="secondary"
        size={size}
        icon={<Icon name="plus-01" />}
        aria-label={incrementLabel}
        disabled={disabled || value >= max}
        onClick={() => onChange?.(clamp(value + step))}
      />
    </div>
  );
}
