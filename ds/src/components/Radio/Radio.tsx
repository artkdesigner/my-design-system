import { useId, type ReactNode } from 'react';
import { RadioItem, type RadioItemProps } from '../RadioItem';
import styles from './Radio.module.css';

type RadioOwnProps = {
  label?: ReactNode;
  hint?: ReactNode;
  /** Тон ошибки — как у Checkbox/Input: отдельное булево, а не выбор тона
   * у hint. Сверено узлом 134:556 (варианты Alert=False/Alert=True). */
  alert?: boolean;
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
  alert = false,
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
      data-alert={alert ? 'error' : undefined}
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
