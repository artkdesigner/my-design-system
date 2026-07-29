import {
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
  type TextareaHTMLAttributes
} from 'react';
import styles from './TextArea.module.css';

type TextAreaOwnProps = {
  label?: string;
  hint?: ReactNode;
  /** Тон ошибки. Как у Input — отдельное булево, а не проп message
   * с выбором тона. */
  alert?: boolean;
  alertText?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type TextAreaProps = TextAreaOwnProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof TextAreaOwnProps>;

/**
 * Многострочное поле ввода. Узел 119:5404 в Figma, сверено через MCP-мост:
 * та же 8-состояний матрица label/hint/alert/disabled и то же поведение
 * подписи-плейсхолдера, что у Input (см. комментарий в Input.tsx). Реализован
 * отдельным компонентом, а не обёрткой над Input, потому что многострочный
 * ввод — другой DOM-элемент (textarea, не input с его addon/stepper-слотами,
 * которых у TextArea в макете нет), но токены поля те же.
 *
 * Высота поля — токен input_field_max-height (120/96/72px по размеру).
 * В Input он не был востребован (там однострочная строка держится на
 * input_field_min-height), здесь это единственная высота: в макете нет
 * варианта, где textarea растёт или тянется за ручку resize.
 */
export function TextArea({
  label,
  hint,
  alert = false,
  alertText,
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
}: TextAreaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  const [focused, setFocused] = useState(false);
  const [hasTypedValue, setHasTypedValue] = useState(() => Boolean(value ?? defaultValue));

  const isFilled = value !== undefined ? Boolean(value) : hasTypedValue;
  const labelFloated = focused || isFilled;

  const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
        {label && (
          <label className={styles.label} htmlFor={textareaId}>
            {label}
          </label>
        )}
        <textarea
          {...rest}
          id={textareaId}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          placeholder={focused ? placeholder : label}
          className={styles.textarea}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      {hintText && <div className={styles.hint}>{hintText}</div>}
    </div>
  );
}
