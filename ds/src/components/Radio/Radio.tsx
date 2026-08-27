import { useId, type ReactNode } from 'react';
import { RadioItem, type RadioItemProps } from '../RadioItem';
import styles from './Radio.module.css';

type RadioOwnProps = {
  label?: ReactNode;
  hint?: ReactNode;
  /** Тон уведомления. Одно значение, как у Checkbox/Button (не булев флаг):
   * режим AlertType в Figma стоит на самом компоненте (узел 134:556 —
   * вариант Alert плюс режим AlertType). undefined — уведомления нет,
   * показывается hint; значение — вместо hint показывается alertText в этом
   * тоне. */
  alert?: 'info' | 'success' | 'warning' | 'error';
  alertText?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type RadioProps = RadioOwnProps & Omit<RadioItemProps, keyof RadioOwnProps>;

/**
 * Обёртка над RadioItem — добавляет подпись и подсказку сбоку от кружка
 * (та самая обёртка, которую RadioItem называет ещё не построенной), той
 * же структуры, что Checkbox над CheckboxItem. Узел 134:556 в Figma,
 * сверен через MCP-мост.
 *
 * Подпись — настоящий <label htmlFor>, связанный с id кнопки RadioItem:
 * клик по тексту переключает радио тем же нативным механизмом, что у
 * <label><input/></label>, потому что RadioItem рендерит <button> —
 * «подписываемый» элемент по спецификации HTML.
 *
 * Полностью управляемый компонент, как и RadioItem: selected и disabled
 * приходят снаружи, сам себя не переключает.
 */
export function Radio({
  label,
  hint,
  alert,
  alertText,
  size = 'l',
  id,
  disabled,
  className,
  ...rest
}: RadioProps) {
  const generatedId = useId();
  const radioId = id ?? generatedId;
  const hintText = alert ? alertText : hint;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-alert={alert}
      data-state={disabled ? 'disabled' : undefined}
    >
      <RadioItem {...rest} id={radioId} size={size} disabled={disabled} className={styles.item} />
      {(label || hintText) && (
        <div className={styles.content}>
          {label && (
            <label className={styles.label} htmlFor={radioId}>
              {label}
            </label>
          )}
          {hintText && <div className={styles.hint}>{hintText}</div>}
        </div>
      )}
    </div>
  );
}
