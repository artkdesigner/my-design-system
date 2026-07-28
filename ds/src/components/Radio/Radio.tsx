import { useId, type ReactNode } from 'react';
import { RadioItem, type RadioItemProps } from '../RadioItem';
import styles from './Radio.module.css';

type RadioOwnProps = {
  label?: ReactNode;
  hint?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type RadioProps = RadioOwnProps & Omit<RadioItemProps, keyof RadioOwnProps>;

/**
 * Обёртка над RadioItem — добавляет подпись и подсказку сбоку от кружка
 * (та самая обёртка, которую RadioItem называет ещё не построенной), той
 * же структуры, что Checkbox над CheckboxItem. Токены — Radio/Radio/* в
 * tokens.map.json, узел в Figma этой сессией не проверен (мост к MCP не
 * поднялся — см. комментарий в Checkbox.tsx).
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
  size = 'l',
  id,
  disabled,
  className,
  ...rest
}: RadioProps) {
  const generatedId = useId();
  const radioId = id ?? generatedId;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-state={disabled ? 'disabled' : undefined}
    >
      <RadioItem {...rest} id={radioId} size={size} disabled={disabled} className={styles.item} />
      {(label || hint) && (
        <div className={styles.content}>
          {label && (
            <label className={styles.label} htmlFor={radioId}>
              {label}
            </label>
          )}
          {hint && <div className={styles.hint}>{hint}</div>}
        </div>
      )}
    </div>
  );
}
