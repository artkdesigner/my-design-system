import type { HTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon';
import styles from './StatusBadge.module.css';

type StatusBadgeOwnProps = {
  /** Какую иконку показать. Обязателен: единого набора «своя иконка на
   * каждый статус» в наборе icons.generated.ts нет — например, у info/error
   * есть парные *-circle-contained/*-circle-filled, а у success подходящего
   * check-circle-* варианта не существует вовсе (только check-contained,
   * квадратный). Поэтому вместо угадывания смешанного набора форм —
   * выбор иконки оставлен вызывающему коду. */
  icon: IconName;
  /** Цвет через семантический слой message (см. Input alert/CheckboxGroup/
   * RadioGroup) — data-message переключает element-icon-message. */
  status?: 'info' | 'success' | 'warning' | 'error';
  size?: 'l' | 'm' | 's';
};

export type StatusBadgeProps = StatusBadgeOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof StatusBadgeOwnProps>;

/**
 * Маленький цветной значок статуса (StatusBadge/StatusBadge_size и
 * _padding в tokens.map.json) — не пилюля с подписью (это отдельный,
 * ещё не построенный компонент Status с addon/gap/label), а просто
 * иконка в отступе, покрашенная под статус. Своего фона/рамки нет:
 * токенов под них в StatusBadge не заведено, а значит цвет несёт сама
 * иконка (обычно один из *-contained/*-filled вариантов, где кружок или
 * квадрат уже нарисован внутри пути). Узел в Figma этой сессией не
 * проверен (мост к MCP не поднялся — см. комментарий в Checkbox.tsx).
 *
 * Иконка растягивается на всю внутреннюю область через override 100%×100%
 * (тот же приём, что у Checkmark), а не через свой size у Icon — иначе
 * пришлось бы гадать, какой из l/m/s size Icon даёт нужный пиксельный
 * размер после вычета statusbadge-padding.
 */
export function StatusBadge({ icon, status = 'info', size = 'l', className, ...rest }: StatusBadgeProps) {
  return (
    <span
      {...rest}
      data-size={size}
      data-message={status}
      className={[styles.badge, className].filter(Boolean).join(' ')}
    >
      <Icon name={icon} className={styles.icon} aria-hidden="true" />
    </span>
  );
}
