import { useId, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { CodeInputItem } from '../CodeInputItem';
import styles from './CodeInput.module.css';

type CodeInputOwnProps = {
  /** Введённый код. Полностью управляемый компонент, как NumberInput/
   * Slider: строка цифр, а не массив — так проще передавать снаружи и
   * сверять с ответом сервера. */
  value: string;
  onChange?: (value: string) => void;
  /** Количество ячеек. В демо-варианте макета (176:1414) их 8, но это
   * не зашитое число — реальный код может быть короче. */
  length?: number;
  /** Тон уведомления под ячейками. Одно значение, как у Input/Button (не
   * булев флаг): режим AlertType в Figma стоит на самом компоненте.
   * undefined — уведомления нет. Сами ячейки при любом тоне рисуются
   * error-тоном (красным) — код бывает либо верным, либо нет; тон влияет
   * только на текст alertText под ними. */
  alert?: 'info' | 'success' | 'warning' | 'error';
  alertText?: ReactNode;
  disabled?: boolean;
  size?: 'l' | 'm' | 's';
  autoFocus?: boolean;
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

export type CodeInputProps = CodeInputOwnProps;

/**
 * Поле ввода кода. Узел 176:1414 в Figma, сверен через MCP-мост: ряд
 * ячеек CodeInputItem плюс текст ошибки под ним при alert — та же
 * пара alert/alertText, что у Input/TextArea/TagGroup.
 *
 * Один настоящий скрытый <input>, а не по input на ячейку и не
 * JS-переброс фокуса между несколькими input: это стандартный
 * доступный приём для одноразовых кодов (autoComplete="one-time-code",
 * работает с автоподстановкой SMS-кода на мобильных, вставка полного
 * кода из буфера — штатное поведение обычного текстового поля, а не
 * то, что пришлось бы реализовывать вручную по ячейкам). Ячейки —
 * чистая проекция value на экран, сами ничего не слушают.
 *
 * Курсор (Active) — это ячейка на позиции value.length, но только пока
 * поле в фокусе. Когда код набран полностью, эта позиция — последняя
 * ячейка, и она приходит с уже введённым значением — так естественно
 * получается состояние «Active=Yes, Filled=Yes» из Figma, без отдельной
 * ветки под него.
 *
 * Курсор и рамка фокуса пропадают при alert — сверено по CodeInputItem:
 * в состоянии ошибки поле показывает, что оно неверно, а не приглашает
 * продолжать печатать.
 */
export function CodeInput({
  value,
  onChange,
  length = 8,
  alert,
  alertText,
  disabled = false,
  size = 'l',
  autoFocus,
  id,
  className,
  ...aria
}: CodeInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const digits = value.slice(0, length).split('');
  const cursorIndex = focused && !alert && !disabled ? Math.min(value.length, length - 1) : -1;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value.replace(/\D/g, '').slice(0, length);
    onChange?.(next);
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-alert={alert}
      data-state={disabled ? 'disabled' : undefined}
    >
      <div className={styles.fields} data-focused={focused || undefined} onClick={focusInput}>
        {Array.from({ length }, (_, index) => (
          <CodeInputItem
            key={index}
            size={size}
            value={digits[index]}
            filled={index < digits.length}
            active={index === cursorIndex}
            error={alert != null}
            disabled={disabled}
          />
        ))}
        <input
          {...aria}
          ref={inputRef}
          id={inputId}
          className={styles.input}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d*"
          maxLength={length}
          value={value}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
        />
      </div>
      {alert && alertText && <div className={styles.hint}>{alertText}</div>}
    </div>
  );
}
