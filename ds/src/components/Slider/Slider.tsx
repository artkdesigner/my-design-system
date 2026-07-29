import { useRef, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import styles from './Slider.module.css';

type SliderOwnProps = {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Ряд подписей-делений под линией. Узел 154:1849 в Figma — проп pips
   * там ровно такой же, по умолчанию включён. */
  pips?: boolean;
  disabled?: boolean;
  size?: 'l' | 'm' | 's';
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

export type SliderProps = SliderOwnProps;

/**
 * Ползунок. Узел 154:1849 в Figma, сверен через MCP-мост: полоса из двух
 * сегментов (закрашенный token bg_action_accent до указателя, серый
 * bg_action_tetriary после) и указатель на границе между ними — не
 * нативный input[type=range], а кастомная кнопка с role="slider", как и
 * у прочих интерактивных элементов дизайн-системы (CheckboxItem,
 * RadioItem): отрисовка полностью кастомная, доступность — через
 * aria-valuenow/min/max, а не браузерный виджет.
 *
 * Перетаскивание слушает pointerdown/move на всей линии, а не только на
 * самом указателе — клик в любой точке линии сразу переставляет значение
 * туда (обычное поведение слайдера), а не только тянет уже схваченный
 * указатель.
 *
 * Подписи-деления — не декоративная тонкая чёрточка, а просто числа от
 * min до max с шагом step: в макете frame-обёртка вокруг каждой цифры
 * нужна была лишь для выравнивания текста по краям (первая цифра — по
 * левому, последняя — по правому, чтобы не вылезать за границы линии);
 * тот же результат здесь даёт обычный flex-ряд с justify-content:
 * space-between без этой обёртки.
 *
 * Полностью управляемый компонент, как NumberInput: value и step —
 * числа, onChange вызывается уже с готовым, округлённым до step
 * значением.
 */
export function Slider({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  pips = true,
  disabled = false,
  size = 'l',
  className,
  ...aria
}: SliderProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  const clamp = (next: number) => Math.min(max, Math.max(min, next));
  const roundToStep = (next: number) => clamp(min + Math.round((next - min) / step) * step);

  const setFromClientX = (clientX: number) => {
    const line = lineRef.current;
    if (!line) return;
    const rect = line.getBoundingClientRect();
    const ratio = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width;
    const next = roundToStep(min + ratio * (max - min));
    if (next !== value) onChange?.(next);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setFromClientX(event.clientX);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || event.buttons === 0) return;
    setFromClientX(event.clientX);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      onChange?.(clamp(value + step));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      onChange?.(clamp(value - step));
    } else if (event.key === 'Home') {
      event.preventDefault();
      onChange?.(min);
    } else if (event.key === 'End') {
      event.preventDefault();
      onChange?.(max);
    }
  };

  const percent = max === min ? 0 : ((clamp(value) - min) / (max - min)) * 100;

  const pipValues: number[] = [];
  if (pips) {
    for (let pip = min; pip <= max; pip += step) pipValues.push(pip);
  }

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-state={disabled ? 'disabled' : undefined}
    >
      <div className={styles.fixer}>
        <div
          ref={lineRef}
          className={styles.line}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <div className={styles.fill} style={{ width: `${percent}%` }}>
            <div
              {...aria}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={value}
              aria-disabled={disabled || undefined}
              className={[styles.pointer, 'ds-interactive'].filter(Boolean).join(' ')}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className={styles.remainder} />
        </div>
      </div>
      {pips && (
        <div className={styles.pips}>
          {pipValues.map((pip) => (
            <span key={pip} className={styles.pip}>
              {pip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
