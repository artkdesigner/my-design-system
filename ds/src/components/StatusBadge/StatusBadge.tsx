import type { HTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon';
import styles from './StatusBadge.module.css';

export type StatusBadgeType =
  | 'positiveCheck'
  | 'negativeCross'
  | 'neutralCross'
  | 'negativeAlert'
  | 'warningAlert'
  | 'infoNeutral'
  | 'infoAccent'
  | 'operation'
  | 'stop';

type StatusBadgeOwnProps = {
  type?: StatusBadgeType;
  size?: 'l' | 'm' | 's';
};

export type StatusBadgeProps = StatusBadgeOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof StatusBadgeOwnProps>;

/**
 * Узел 181:1850 в Figma, сверен через MCP-мост: девять готовых вариантов
 * type, у каждого зашита СВОЯ пара иконка+цвет — это не свободная
 * комбинация icon+status, как предполагалось до сверки. Три варианта
 * (neutralCross/infoNeutral/operation) серые (element_bg_action_secondary,
 * не зависит от статуса), остальные шесть красятся через семантический
 * message (info/success/warning/error) с сплошной заливкой — bg берёт
 * message-bg-primary, а не тинт message-bg-secondary, потому что везде
 * стоит data-on-accent (тот же переключатель, что у Button на залитых
 * вариантах): он же красит иконку в белый через element-icon-primary.
 */
const CONFIG: Record<StatusBadgeType, { icon: IconName; message?: 'info' | 'success' | 'warning' | 'error' }> = {
  positiveCheck: { icon: 'check', message: 'success' },
  negativeCross: { icon: 'x-03', message: 'error' },
  neutralCross: { icon: 'x-03' },
  negativeAlert: { icon: 'exclamation-mark', message: 'error' },
  warningAlert: { icon: 'exclamation-mark', message: 'warning' },
  infoNeutral: { icon: 'information' },
  infoAccent: { icon: 'information', message: 'info' },
  operation: { icon: 'clock-02' },
  stop: { icon: 'stop', message: 'error' }
};

export function StatusBadge({ type = 'positiveCheck', size = 'l', className, ...rest }: StatusBadgeProps) {
  const { icon, message } = CONFIG[type];

  return (
    <span
      {...rest}
      data-size={size}
      data-on-accent="true"
      data-tone={message ? 'message' : 'neutral'}
      data-message={message}
      className={[styles.badge, className].filter(Boolean).join(' ')}
    >
      <Icon name={icon} size={size} className={styles.icon} aria-hidden="true" />
    </span>
  );
}
