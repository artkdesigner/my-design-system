import type { ChangeEvent } from 'react';
import { Input, type InputProps } from '../Input';
import { Stepper } from '../Stepper';

type NumberInputOwnProps = {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decrementLabel?: string;
  incrementLabel?: string;
};

export type NumberInputProps = NumberInputOwnProps & Omit<InputProps, keyof NumberInputOwnProps | 'stepper'>;

/**
 * Числовое поле. Узел 144:2671 в Figma, сверен через MCP-мост: это не
 * отдельная реализация поля, а готовый Input (та же 8-состояний матрица
 * label/hint/alert/disabled — токены совпадают буквально) с готовым
 * Stepper во встроенном слоте `stepper` (см. Input.tsx) — токен на этот
 * слот в Figma лежит в неймспейсе самого Input (input_stepper_padding_hor),
 * не NumberInput, поэтому слот и добавлен в Input, а не продублирован тут.
 *
 * В макете у Stepper внутри пустого/печатаемого поля более светлый
 * (element_bg_lvl_2) фон, чем у уже осевшего/ошибочного поля — этот нюанс
 * сознательно не переносим: он завязан на приватное состояние фокуса
 * внутри самого Input (focused/isFilled), которое наружу не отдаётся, а
 * дублировать его трекинг в NumberInput ради чисто косметической детали
 * не стоит усложнения. Stepper всегда работает и выглядит как отдельный
 * компонент — цвета/структура/disabled сверены и совпадают.
 *
 * Полностью управляемый: value — число, а не строка, как у обычного
 * Input — NumberInput сам парсит текст поля и зовёт onChange только когда
 * получилось валидное число (обрезанное по min/max), не на каждый символ.
 */
export function NumberInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  decrementLabel,
  incrementLabel,
  size = 'l',
  disabled,
  ...rest
}: NumberInputProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    const parsed = Number(text);
    if (text !== '' && Number.isFinite(parsed)) {
      onChange?.(clamp(parsed));
    }
  };

  return (
    <Input
      {...rest}
      size={size}
      disabled={disabled}
      value={String(value)}
      onChange={handleTextChange}
      stepper={
        <Stepper
          value={value}
          min={min}
          max={max}
          step={step}
          size={size}
          disabled={disabled}
          decrementLabel={decrementLabel}
          incrementLabel={incrementLabel}
          onChange={(next) => onChange?.(next)}
        />
      }
    />
  );
}
