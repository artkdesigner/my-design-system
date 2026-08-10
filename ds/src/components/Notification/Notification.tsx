import type { HTMLAttributes, ReactNode } from 'react';
import { StatusBadge, type StatusBadgeType } from '../StatusBadge';
import { TextButton } from '../TextButton';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import styles from './Notification.module.css';

type NotificationOwnProps = {
  showBadge?: boolean;
  badgeType?: StatusBadgeType;
  title: ReactNode;
  caption?: ReactNode;
  buttonLabel?: ReactNode;
  onButtonClick?: () => void;
  onClose?: () => void;
  closeLabel?: string;
};

export type NotificationProps = NotificationOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof NotificationOwnProps>;

/**
 * Уведомление-тост. Узел 207:6151 в Figma, сверен через MCP-мост: светлая
 * карточка (element_bg_lvl_2) с тенью, а не залитая акцентом плашка —
 * три необязательных слота (кнопка, разделитель+крестик закрытия) видны
 * только при переданном обработчике — так же, как onRemove у AttachFileItem,
 * а не отдельным булевым флагом, который надо синхронизировать с наличием
 * колбэка вручную.
 *
 * Никакого data-on-accent на корне: фон нейтральный, поэтому title/caption/
 * TextButton/IconButton/разделитель берут обычные (не on-accent) варианты
 * своих токенов через тот же каскад — title element_text_primary, caption
 * element_text_secondary, разделитель element_border_secondary, ровно как
 * в макете.
 *
 * role="status" — тост объявляется скринридером при появлении без
 * необходимости переводить на него фокус (в макете этого нет, но без
 * этого сам факт появления уведомления был бы недоступен незрячим
 * пользователям).
 */
export function Notification({
  showBadge = true,
  badgeType = 'positiveCheck',
  title,
  caption,
  buttonLabel,
  onButtonClick,
  onClose,
  closeLabel = 'Закрыть уведомление',
  className,
  ...rest
}: NotificationProps) {
  return (
    <div {...rest} role="status" className={[styles.notification, className].filter(Boolean).join(' ')}>
      {showBadge && (
        <div className={styles.badgeSlot}>
          <StatusBadge type={badgeType} />
        </div>
      )}

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
