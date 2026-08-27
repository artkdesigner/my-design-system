import type { ChangeEvent } from 'react';
import { Input, type InputProps } from '../Input';
import { Slider } from '../Slider';
import styles from './InputSlider.module.css';

type InputSliderOwnProps = {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  pips?: boolean;
};

export type InputSliderProps = InputSliderOwnProps &
  Omit<InputProps, keyof InputSliderOwnProps | 'stepper'>;

/**
 * Числовое поле со слайдером. Узел 154:2026 в Figma, сверен через
 * MCP-мост: та же 8-состояний матрица label/hint/alert/disabled, что и у
 * Input (готовый Input целиком, без дублирования полей — тот же приём,
 * что у NumberInput), плюс готовый Slider сразу под полем — не внутри
 * него во встроенном слоте, как Stepper у NumberInput, а отдельной
 * строкой между Field и Hint: в макете Slider впритык к нижнему краю
 * поля, без отступа, а Hint/Alert идут уже под ним. Поэтому свой Hint
 * рисуется здесь, а не через проп hint у самого Input — иначе подсказка
 * оказалась бы над слайдером, а не под ним.
 *
 * Значение — число, как у NumberInput: поле и слайдер управляют одним и
 * тем же value, текст в поле парсится и обрезается по min/max так же,
 * не на каждый символ, а только когда получилось валидное число.
 */
export function InputSlider({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  pips = true,
  size = 'l',
  disabled,
  alert,
  alertText,
  hint,
  className,
  ...rest
}: InputSliderProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    const parsed = Number(text);
    if (text !== '' && Number.isFinite(parsed)) {
      onChange?.(clamp(parsed));
    }
  };

  const hintText = alert ? alertText : hint;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-alert={alert}
      data-state={disabled ? 'disabled' : undefined}
    >
      <Input {...rest} size={size} disabled={disabled} alert={alert} value={String(value)} onChange={handleTextChange} />
      <div className={styles.slider}>
        <Slider value={value} onChange={onChange} min={min} max={max} step={step} pips={pips} disabled={disabled} size={size} />
      </div>
      {hintText && <div className={styles.hint}>{hintText}</div>}
    </div>
  );
}
