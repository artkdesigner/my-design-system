import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Addon } from '../Addon';
import styles from './Tab.module.css';

type TabOwnProps = {
  /** Активна ли вкладка. Соответствует свойству ActiveState в Figma. */
  active?: boolean;
  size?: 'l' | 'm' | 's';
  /** Декоративная иконка после подписи. Соответствует булеву Addon в Figma —
   * в коде это слот, а не флаг: наличие иконки и есть флаг, тот же приём,
   * что у iconLeft/iconRight в Button. */
  icon?: ReactNode;
  children: ReactNode;
};

export type TabProps = TabOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof TabOwnProps | 'role'>;

/**
 * Одна вкладка. Узел 205:848 в Figma, сверен через MCP-мост.
 *
 * role="tab" + aria-selected, а не role="radio" (как у Segment) — у ARIA
 * для вкладок есть отдельный, более точный паттерн tablist/tab, и здесь
 * нет причины эмулировать его через радиокнопки. aria-selected вместо
 * aria-checked — то же соответствие терминам ARIA. Связку с tabpanel
 * (aria-controls/id) настраивает вызывающий код: сам Tab не знает, что
 * именно он раскрывает.
 *
 * Нижняя рамка держит толщину 2px всегда, даже у неактивной вкладки
 * (прозрачным цветом) — иначе появление рамки при активации сдвигало бы
 * соседние вкладки по вертикали.
 *
 * Полностью управляемый: active приходит снаружи, сам себя не переключает.
 */
export function Tab({
  active = false,
  size = 'l',
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: TabProps) {
  return (
    <button
      {...rest}
      type={type}
      role="tab"
      aria-selected={active}
      data-size={size}
      data-active={active || undefined}
      className={[styles.tab, 'ds-interactive', className].filter(Boolean).join(' ')}
    >
      <span className={styles.label}>{children}</span>
      {icon && (
        <Addon size={size} className={styles.addon} aria-hidden="true">
          {icon}
        </Addon>
      )}
    </button>
  );
}
