import type { HTMLAttributes, ReactNode } from 'react';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import { TextButton } from '../TextButton';
import { ProgressBar } from '../ProgressBar';
import styles from './AttachFileItem.module.css';

type AttachFileItemOwnProps = {
  /** Соответствует State в Figma (узел 188:4904). */
  state?: 'noFile' | 'loading' | 'done' | 'many' | 'error';
  size?: 'l' | 'm' | 's';
  /** noFile: подсказка о допустимых форматах. */
  label?: ReactNode;
  /** noFile: подпись кнопки-ссылки «Ещё N», не рисуется без неё. */
  moreLabel?: ReactNode;
  onMoreClick?: () => void;
  /** loading/done: имя и расширение файла. */
  name?: ReactNode;
  format?: ReactNode;
  /** loading: прогресс 0–100. */
  progress?: number;
  /** many: готовая подпись вида «2 файла» — множественное число разное
   * у разных языков, поэтому строка целиком, а не число + текст-обёртка. */
  manyLabel?: ReactNode;
  errorText?: ReactNode;
  /** loading/done/many: крестик удаления. Без onRemove не рисуется. */
  onRemove?: () => void;
  removeLabel?: string;
};

export type AttachFileItemProps = AttachFileItemOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof AttachFileItemOwnProps>;

/**
 * Статус прикреплённого файла (узел 188:4904 в Figma, сверен через
 * MCP-мост): содержимое поля справа от кнопки «Прикрепите файл» в
 * Attach — либо подсказка о форматах (noFile), либо статус одного
 * файла (loading/done), нескольких файлов (many), либо ошибка.
 *
 * Прогресс — готовый ProgressBar size="s": в макете он всегда 4px вне
 * зависимости от size самого AttachFileItem (Radius/max и
 * BG/element_bg_lvl_3 общие, отдельного attach-progress-height токена
 * нет).
 *
 * Имя.расширение — один укороченный текстовый узел, а не три (имя, точка,
 * расширение раздельно, как в макете): раздельные слои там нужны были
 * лишь на случай усечения только имени с сохранением расширения видимым,
 * но ellipsis у нас режет строку целиком — тот же видимый результат при
 * обычной длине имени, без лишней разметки.
 */
export function AttachFileItem({
  state = 'noFile',
  size = 'l',
  label,
  moreLabel,
  onMoreClick,
  name,
  format,
  progress = 0,
  manyLabel,
  errorText,
  onRemove,
  removeLabel = 'Удалить файл',
  className,
  ...rest
}: AttachFileItemProps) {
  const removeButton = onRemove && (
    <IconButton
      view="secondary"
      size="s"
      icon={<Icon name="x-03" />}
      aria-label={removeLabel}
      onClick={onRemove}
      className={styles.remove}
    />
  );

  return (
    <div
      {...rest}
      data-state={state}
      data-size={size}
      data-alert={state === 'error' ? 'error' : undefined}
      className={[styles.item, className].filter(Boolean).join(' ')}
    >
      {state === 'noFile' && (
        <div className={styles.row}>
          {label && <span className={styles.hint}>{label}</span>}
          {moreLabel && (
            <TextButton view="accent" size="s" onClick={onMoreClick}>
              {moreLabel}
            </TextButton>
          )}
        </div>
      )}

      {(state === 'loading' || state === 'done') && (
        <>
          <div className={styles.row}>
            <span className={styles.filename}>
              {name}.{format}
            </span>
            {removeButton}
          </div>
          {state === 'loading' && <ProgressBar size="s" value={progress} className={styles.progress} />}
        </>
      )}

      {state === 'many' && (
        <div className={styles.row}>
          <span className={styles.hint}>{manyLabel}</span>
          {removeButton}
        </div>
      )}

      {state === 'error' && <span className={styles.error}>{errorText}</span>}
    </div>
  );
}
