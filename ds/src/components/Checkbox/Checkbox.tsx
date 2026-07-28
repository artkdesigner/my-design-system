import { useId, type ReactNode } from 'react';
import { CheckboxItem, type CheckboxItemProps } from '../CheckboxItem';
import styles from './Checkbox.module.css';

type CheckboxOwnProps = {
  label?: ReactNode;
  hint?: ReactNode;
  /** Тон ошибки — как у Input: отдельное булево, а не выбор тона у hint.
   * Сверено узлом 125:2409 (варианты Alert=False/Alert=True). */
  alert?: boolean;
  alertText?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type CheckboxProps = CheckboxOwnProps & Omit<CheckboxItemProps, keyof CheckboxOwnProps>;

/**
 * Обёртка над CheckboxItem — добавляет подпись и подсказку сбоку от
 * квадрата (та самая обёртка, которую CheckboxItem называет ещё не
 * построенной). Узел 125:2409 в Figma, сверен через MCP-мост.
 *
 * Подпись — настоящий <label htmlFor>, связанный с id кнопки CheckboxItem:
 * клик по тексту переключает чекбокс тем же нативным механизмом, что у
 * <label><input/></label>, потому что CheckboxItem рендерит <button> —
 * «подписываемый» элемент по спецификации HTML, и не требует своего
 * onClick-форвардинга в JS.
 *
 * Полностью управляемый компонент, как и CheckboxItem: state и disabled
 * приходят снаружи, сам себя не переключает.
 */
export function Checkbox({
  label,
  hint,
  alert = false,
  alertText,
  size = 'l',
  id,
  disabled,
  className,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const hintText = alert ? alertText : hint;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-alert={alert || undefined}
      data-state={disabled ? 'disabled' : undefined}
    >
      <CheckboxItem {...rest} id={checkboxId} size={size} disabled={disabled} className={styles.item} />
      {(label || hintText) && (
        <div className={styles.content}>
          {label && (
            <label className={styles.label} htmlFor={checkboxId}>
              {label}
            </label>
          )}
          {hintText && <div className={styles.hint}>{hintText}</div>}
        </div>
      )}
    </div>
  );
}
