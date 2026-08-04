import { useId, type ReactNode } from 'react';
import { SwitchItem, type SwitchItemProps } from '../SwitchItem';
import styles from './Switch.module.css';

type SwitchOwnProps = {
  label?: ReactNode;
  hint?: ReactNode;
  /** Пилюля после подписи вместо перед ней. Соответствует свойству Reverse в Figma. */
  reverse?: boolean;
  size?: 'l' | 'm' | 's';
};

export type SwitchProps = SwitchOwnProps & Omit<SwitchItemProps, keyof SwitchOwnProps>;

/**
 * Обёртка над SwitchItem — добавляет подпись и подсказку рядом с пилюлей.
 * Узел 169:3099 в Figma, сверен через MCP-мост.
 *
 * Подпись — настоящий <label htmlFor>, связанный с id кнопки SwitchItem:
 * клик по тексту переключает свитч тем же нативным механизмом, что у
 * <label><input/></label>, тот же приём, что и в Checkbox.
 *
 * Полностью управляемый, как и SwitchItem: checked и disabled приходят
 * снаружи, сам себя не переключает.
 */
export function Switch({
  label,
  hint,
  reverse = false,
  size = 'l',
  id,
  disabled,
  className,
  ...rest
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  const item = <SwitchItem {...rest} id={switchId} size={size} disabled={disabled} className={styles.item} />;
  const content = (label || hint) && (
    <div className={styles.content}>
      {label && (
        <label className={styles.label} htmlFor={switchId}>
          {label}
        </label>
      )}
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-state={disabled ? 'disabled' : undefined}
    >
      {reverse ? (
        <>
          {content}
          {item}
        </>
      ) : (
        <>
          {item}
          {content}
        </>
      )}
    </div>
  );
}
