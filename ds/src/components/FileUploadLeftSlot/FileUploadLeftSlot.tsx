import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './FileUploadLeftSlot.module.css';

type FileUploadLeftSlotOwnProps = {
  /** Соответствует State в Figma (узел 195:475). */
  state?: 'empty' | 'loading' | 'success' | 'error' | 'deleted';
  size?: 'l' | 'm' | 's';
  /** Прогресс кольца, 0–100. Имеет смысл только при state="loading". */
  progress?: number;
  /** Своя миниатюра вместо иконки-заглушки. Не действует при state="empty" —
   * там, как и в макете, всегда фиксированная иконка attach. */
  icon?: ReactNode;
};

export type FileUploadLeftSlotProps = FileUploadLeftSlotOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof FileUploadLeftSlotOwnProps>;

/**
 * Миниатюра файла с кольцом статуса. Узел 195:475 в Figma, сверен через
 * MCP-мост: там кольцо для loading/deleted нарисовано четырьмя
 * четвертинками (грубый шаг 25%, статичная иллюстрация значения ~75%).
 * Здесь вместо этого conic-gradient по проценту — то же кольцо, но с
 * настоящим числовым progress, а не фиксированным кадром.
 *
 * Кольцо и подложка — два наложенных слоя, как в макете: нижний рисует
 * цвет (сплошной border у empty/success/error/deleted, conic-gradient у
 * loading), верхний — квадрат фона поверх центра, оставляющий видимым
 * только ободок нужной толщины. Однослойный border без этой подложки
 * работал бы для сплошных состояний, но не для conic-gradient — здесь
 * один и тот же DOM для всех state, а не два разных пути отрисовки.
 */
export function FileUploadLeftSlot({
  state = 'empty',
  size = 'l',
  progress = 0,
  icon,
  className,
  ...rest
}: FileUploadLeftSlotProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div
      {...rest}
      data-status={state}
      data-size={size}
      data-alert={state === 'success' ? 'success' : state === 'error' ? 'error' : undefined}
      className={[styles.slot, className].filter(Boolean).join(' ')}
    >
      <div
        className={styles.ring}
        style={state === 'loading' ? { background: `conic-gradient(var(--element-border-primary) ${clampedProgress}%, transparent 0)` } : undefined}
      />
      <div className={styles.bg} />
      {state === 'empty' ? (
        <Icon name="paperclip" size={size} className={styles.icon} />
      ) : state === 'deleted' ? (
        <>
          {icon ?? <Icon name="image" size={size} className={styles.icon} />}
          <span className={styles.cross} />
        </>
      ) : (
        (icon ?? <Icon name="image" size={size} className={styles.icon} />)
      )}
    </div>
  );
}
