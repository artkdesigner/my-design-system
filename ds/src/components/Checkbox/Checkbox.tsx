import { useId, type ReactNode } from 'react';
import { CheckboxItem, type CheckboxItemProps } from '../CheckboxItem';
import styles from './Checkbox.module.css';

type CheckboxOwnProps = {
  label?: ReactNode;
  hint?: ReactNode;
  /** Тон уведомления. Как у Button/ActionButton — одно значение, а не булев
   * флаг: режим коллекции AlertType в Figma всё равно стоит на самом
   * компоненте (узел 125:2409 — вариант Alert плюс режим AlertType).
   * undefined — уведомления нет, показывается hint; значение — вместо hint
   * показывается alertText в этом тоне. */
  alert?: 'info' | 'success' | 'warning' | 'error';
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
  alert,
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
      data-alert={alert}
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
