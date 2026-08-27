import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Status.module.css';

type StatusOwnProps = {
  label: ReactNode;
  /** Тон. Custom — произвольный акцентный цвет (фиолетовый в макете),
   * alert — обычный синий тон уведомления. */
  tone?: 'alert' | 'custom';
  /** Заливка. Соответствует свойству Accent в Figma: true — сплошной фон
   * своего тона и белый текст, false — светлый тинт и цветной текст. */
  accent?: boolean;
  /** Иконка слева. Свой размер (--status-addon-size), меньше общего
   * --addon-size у Addon — поэтому не через общий компонент Addon, а
   * локальным слотом того же вида. */
  addon?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type StatusProps = StatusOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof StatusOwnProps>;

/**
 * Статус-пилюля дизайн-системы. Узел 183:4991 и соседние варианты в Figma
 * (183:5031, 183:7192, 183:7202), сверены через MCP-мост — четыре сочетания
 * tone × accent, не восемь: addon и текст всегда одного цвета с фоном по
 * той же логике.
 *
 * В режиме accent фон и текст alert-тона берутся через тот же механизм
 * on-accent, что уже держит StatusBadge (--element-bg-message сам
 * переключается на сплошной цвет под data-on-accent, без отдельного
 * правила). У custom-тона своего on-accent слоя в токенах нет — Figma
 * отдал два отдельных цвета (custom-primary/custom-secondary), поэтому фон
 * custom переключается явным правилом по data-on-accent.
 */
export function Status({
  label,
  tone = 'alert',
  accent = false,
  addon,
  size = 'l',
  className,
  ...rest
}: StatusProps) {
  return (
    <span
      {...rest}
      data-size={size}
      data-tone={tone}
      data-on-accent={accent || undefined}
      className={[styles.pill, className].filter(Boolean).join(' ')}
    >
      {addon && (
        <span className={styles.addon} aria-hidden="true">
          {addon}
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </span>
  );
}
