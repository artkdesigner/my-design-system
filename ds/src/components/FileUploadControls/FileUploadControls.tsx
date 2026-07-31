import type { HTMLAttributes } from 'react';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import styles from './FileUploadControls.module.css';

type FileUploadControlsOwnProps = {
  size?: 'l' | 'm' | 's';
  /** Каждая кнопка рисуется, только если передан её колбэк — так же, как
   * в Figma (узел 197:1153) каждая из трёх кнопок скрывается независимо. */
  onRetry?: () => void;
  onDownload?: () => void;
  onRemove?: () => void;
  retryLabel?: string;
  downloadLabel?: string;
  removeLabel?: string;
};

export type FileUploadControlsProps = FileUploadControlsOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof FileUploadControlsOwnProps>;

/**
 * Кнопки действий строки загрузки файла. Узел 197:1153 в Figma
 * («FileUpload_Controlls» — опечатка в макете, в коде название с одной
 * l), сверен через MCP-мост.
 */
export function FileUploadControls({
  size = 'l',
  onRetry,
  onDownload,
  onRemove,
  retryLabel = 'Повторить загрузку',
  downloadLabel = 'Скачать файл',
  removeLabel = 'Удалить файл',
  className,
  ...rest
}: FileUploadControlsProps) {
  return (
    <div {...rest} data-size={size} className={[styles.controls, className].filter(Boolean).join(' ')}>
      {onRetry && (
        <div className={styles.button}>
          <IconButton view="secondary" size={size} icon={<Icon name="arrow-refresh-01" />} aria-label={retryLabel} onClick={onRetry} />
        </div>
      )}
      {onDownload && (
        <div className={styles.button}>
          <IconButton view="secondary" size={size} icon={<Icon name="download-01" />} aria-label={downloadLabel} onClick={onDownload} />
        </div>
      )}
      {onRemove && (
        <div className={styles.button}>
          <IconButton view="secondary" size={size} icon={<Icon name="x-01" />} aria-label={removeLabel} onClick={onRemove} />
        </div>
      )}
    </div>
  );
}
