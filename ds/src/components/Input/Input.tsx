import {
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode
} from 'react';
import { Addon } from '../Addon';
import styles from './Input.module.css';

type InputOwnProps = {
  label?: string;
  hint?: ReactNode;
  /** Тон ошибки. В макете это отдельное булево «Alert», а не проп message
   * с выбором тона, как у Button — поле умеет быть только в порядке или
   * в ошибке. */
  alert?: boolean;
  alertText?: ReactNode;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type InputProps = InputOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof InputOwnProps>;

/**
 * Поле ввода дизайн-системы. Узел 109:1720 в Figma.
 *
 * В макете подпись выполняет двойную роль: пока поле пустое и не в фокусе,
 * она сама стоит крупным начертанием на месте значения — как плейсхолдер.
 * Как только появляется фокус или значение, подпись всплывает мелкой
 * надписью сверху, а на её месте — настоящий проп `placeholder` (если он
 * передан) или введённое значение. Поэтому браузерный placeholder — это
 * не проп `placeholder` напрямую, а вычисляемый текст: подпись в покое,
 * `placeholder` в фокусе. Цвет решается похожим образом в CSS через
 * `:focus::placeholder`, без лишнего состояния в JS.
 *
 * «Заполненность» отслеживается в состоянии, а не через CSS
 * `:placeholder-shown`, потому что пустая строка в `placeholder` ведёт себя
 * непредсказуемо в разных браузерах — со стейтом однозначно.
 */
export function Input({
  label,
  hint,
  alert = false,
  alertText,
  leftAddon,
  rightAddon,
  size = 'l',
  id,
  disabled,
  placeholder,
  value,
  defaultValue,
  onFocus,
  onBlur,
  onChange,
  className,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [focused, setFocused] = useState(false);
  const [hasTypedValue, setHasTypedValue] = useState(() => Boolean(value ?? defaultValue));

  const isFilled = value !== undefined ? Boolean(value) : hasTypedValue;
  const labelFloated = focused || isFilled;

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setHasTypedValue(event.target.value.length > 0);
    onChange?.(event);
  };

  const hintText = alert ? alertText : hint;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-alert={alert || undefined}
      data-message={alert ? 'error' : undefined}
      data-state={disabled ? 'disabled' : undefined}
      data-label-floated={labelFloated || undefined}
    >
      <div className={styles.field}>
        {leftAddon && (
          <Addon size={size} className={[styles.addon, styles.addonLeft].join(' ')} aria-hidden="true">
            {leftAddon}
          </Addon>
        )}
        <div className={styles.content}>
          {label && (
            <label className={styles.label} htmlFor={inputId}>
              {label}
            </label>
          )}
          <input
            {...rest}
            id={inputId}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            placeholder={focused ? placeholder : label}
            className={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </div>
        {rightAddon && (
          <Addon size={size} className={[styles.addon, styles.addonRight].join(' ')} aria-hidden="true">
            {rightAddon}
          </Addon>
        )}
      </div>
      {hintText && <div className={styles.hint}>{hintText}</div>}
    </div>
  );
}
