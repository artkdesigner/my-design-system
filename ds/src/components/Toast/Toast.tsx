import type { HTMLAttributes, ReactNode } from 'react';
import { StatusBadge } from '../StatusBadge';
import { TextButton } from '../TextButton';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import styles from './Toast.module.css';

type ToastOwnProps = {
  /** Вид. Соответствует свойству Type в Figma: Neutral → 'neutral', Message → 'message'. */
  view?: 'neutral' | 'message';
  title: ReactNode;
  caption?: ReactNode;
  buttonLabel?: ReactNode;
  onButtonClick?: () => void;
  onClose?: () => void;
  closeLabel?: string;
};

export type ToastProps = ToastOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof ToastOwnProps>;

/**
 * Тост. Узел 209:670 в Figma, сверен через MCP-мост: светлый фон (в отличие
 * от Notification — тот же набор слотов, но на залитом акцентном фоне
 * с data-on-accent). Кнопка и разделитель+крестик закрытия — слоты по
 * наличию колбэка, а не отдельные булевы флаги, тем же приёмом, что
 * и в Notification.
 *
 * Бейдж всегда infoNeutral/infoAccent — в макете у Toast нет вариантов
 * с check/alert, в отличие от Notification, поэтому badgeType не вынесен
 * в проп, а следует за view напрямую.
 *
 * Крестик закрытия в виде message синий (element_icon_message), хотя
 * IconButton здесь стоит с view="secondary" — у самого IconButton нет вида
 * под тон info, только error. Цвет переопределён каскадом переменной
 * --element-icon-secondary внутри .closerSlot в CSS (см. Toast.module.css),
 * а не выбором другого view: так компонент не задаёт себе несуществующий
 * тон вручную, а переиспользует то же переключение слоем токенов, что
 * и везде в системе.
 */
export function Toast({
  view = 'neutral',
  title,
  caption,
  buttonLabel,
  onButtonClick,
  onClose,
  closeLabel = 'Закрыть уведомление',
  className,
  ...rest
}: ToastProps) {
  return (
    <div {...rest} data-view={view} role="status" className={[styles.toast, className].filter(Boolean).join(' ')}>
      <div className={styles.badgeSlot}>
        <StatusBadge type={view === 'message' ? 'infoAccent' : 'infoNeutral'} />
      </div>

      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>

      {onButtonClick && (
        <div className={styles.buttonSlot}>
          <TextButton view="primary" onClick={onButtonClick}>
            {buttonLabel}
          </TextButton>
        </div>
      )}

      {onClose && (
        <div className={styles.closerSlot}>
          <span className={styles.divider} aria-hidden="true" />
          <IconButton view="secondary" icon={<Icon name="x-03" />} aria-label={closeLabel} onClick={onClose} />
        </div>
      )}
    </div>
  );
}
