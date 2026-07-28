import type { LabelHTMLAttributes, ReactNode } from 'react';
import { Addon } from '../Addon';
import styles from './Label.module.css';

type LabelOwnProps = {
  label: ReactNode;
  hint?: ReactNode;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type LabelProps = LabelOwnProps &
  Omit<LabelHTMLAttributes<HTMLLabelElement>, keyof LabelOwnProps>;

/**
 * Подпись дизайн-системы. Узел 78:3702 в Figma, сверен через MCP-мост:
 * строка из необязательных addon-слотов слева/справа (реиспользуют Addon,
 * как это делает Input) и текстового блока — подпись сверху, подсказка
 * под ней. В макете два разных гэпа, не один общий отступ: --label-gap —
 * между addon-ами и текстовым блоком, --label-hint-gap — между подписью и
 * подсказкой внутри самого текстового блока.
 *
 * Корневой элемент — нативный <label>, а не <div>: компонент задуман для
 * подписи к внешнему полю через htmlFor, тот же приём, что у внутреннего
 * label в Input.
 */
export function Label({
  label,
  hint,
  leftAddon,
  rightAddon,
  size = 'l',
  className,
  ...rest
}: LabelProps) {
  return (
    <label
      {...rest}
      data-size={size}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
    >
      {leftAddon && (
        <Addon size={size} className={styles.addon} aria-hidden="true">
          {leftAddon}
        </Addon>
      )}
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
      {rightAddon && (
        <Addon size={size} className={styles.addon} aria-hidden="true">
          {rightAddon}
        </Addon>
      )}
    </label>
  );
}
