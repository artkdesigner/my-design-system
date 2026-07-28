import { useId, type ReactNode } from 'react';
import { CheckboxItem, type CheckboxItemProps } from '../CheckboxItem';
import styles from './Checkbox.module.css';

type CheckboxOwnProps = {
  label?: ReactNode;
  hint?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type CheckboxProps = CheckboxOwnProps & Omit<CheckboxItemProps, keyof CheckboxOwnProps>;

/**
 * Обёртка над CheckboxItem — добавляет подпись и подсказку сбоку от
 * квадрата (та самая обёртка, которую CheckboxItem называет ещё не
 * построенной). Токены — Checkbox/Checkbox/* в tokens.map.json, узел
 * в Figma этой сессией не проверен: мост к MCP поднимался с этого же
 * сервера, а не с локальной машины с Figma Desktop, и не установился.
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
  size = 'l',
  id,
  disabled,
  className,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-state={disabled ? 'disabled' : undefined}
    >
      <CheckboxItem {...rest} id={checkboxId} size={size} disabled={disabled} className={styles.item} />
      {(label || hint) && (
        <div className={styles.content}>
          {label && (
            <label className={styles.label} htmlFor={checkboxId}>
              {label}
            </label>
          )}
          {hint && <div className={styles.hint}>{hint}</div>}
        </div>
      )}
    </div>
  );
}
