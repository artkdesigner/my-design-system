import type { HTMLAttributes, ReactNode } from 'react';
import { FileUploadLeftSlot } from '../FileUploadLeftSlot';
import { FileUploadContent } from '../FileUploadContent';
import { FileUploadControls } from '../FileUploadControls';
import styles from './FileUploadItem.module.css';

type FileUploadItemOwnProps = {
  size?: 'l' | 'm' | 's';
  /** Соответствует State в Figma (узел 198:822): default — кольцо
   * миниатюры отражает прогресс (progress), error — красное кольцо и
   * текст ошибки, deleted — приглушённая строка с крестиком на
   * миниатюре, файл можно только восстановить (onRetry). */
  state?: 'default' | 'error' | 'deleted';
  name: ReactNode;
  format?: ReactNode;
  /** Прогресс кольца миниатюры при state="default", 0–100. По умолчанию
   * 100 — файл уже загружен и готов, макет не даёт отдельного визуала
   * «ещё грузится» отдельно от «готов», кольцо в обоих случаях серое. */
  progress?: number;
  subtitle1?: ReactNode;
  subtitle2?: ReactNode;
  errorText1?: ReactNode;
  errorText2?: ReactNode;
  icon?: ReactNode;
  /** Показывается при state="error" или "deleted" — в Deleted это
   * единственное доступное действие (восстановить файл). */
  onRetry?: () => void;
  /** Показывается только при state="default". */
  onDownload?: () => void;
  /** Показывается при state="default" или "error", не в "deleted". */
  onRemove?: () => void;
  retryLabel?: string;
  downloadLabel?: string;
  removeLabel?: string;
};

export type FileUploadItemProps = FileUploadItemOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof FileUploadItemOwnProps>;

/**
 * Строка загружаемого файла. Узел 198:822 в Figma (варианты
 * State=Default/Error/Deleted), сверен через MCP-мост: собрана из
 * FileUploadLeftSlot + FileUploadContent + FileUploadControls — те же
 * части экспортируются отдельно для полностью кастомных списков файлов.
 *
 * Видимость кнопок в FileUploadControls жёстко привязана к state (а не
 * только к наличию колбэка), как в макете: retry не рисуется в default,
 * download — только в default, remove — везде, кроме deleted.
 *
 * Приглушённый вид Deleted (текст, иконки и кольцо серые) получается не
 * своим набором цветов, а тем же общим `data-state="disabled"`, что и у
 * Input/Checkbox/Slider: element_text_primary и соседние токены сами
 * переключаются на серый под этим атрибутом, тот же механизм на
 * FileUploadItem автоматически красит вложенные LeftSlot/Content без
 * своей CSS. Кнопка retry при этом остаётся настоящей рабочей кнопкой —
 * `data-state="disabled"` только красит, HTML-атрибут disabled на ней не
 * стоит.
 */
export function FileUploadItem({
  size = 'l',
  state = 'default',
  name,
  format,
  progress = 100,
  subtitle1,
  subtitle2,
  errorText1,
  errorText2,
  icon,
  onRetry,
  onDownload,
  onRemove,
  retryLabel,
  downloadLabel,
  removeLabel,
  className,
  ...rest
}: FileUploadItemProps) {
  return (
    <div
      {...rest}
      data-status={state}
      data-size={size}
      data-state={state === 'deleted' ? 'disabled' : undefined}
      className={[styles.item, className].filter(Boolean).join(' ')}
    >
      <FileUploadLeftSlot
        size={size}
        state={state === 'deleted' ? 'deleted' : state === 'error' ? 'error' : 'loading'}
        progress={progress}
        icon={icon}
      />
      <FileUploadContent
        size={size}
        name={name}
        format={format}
        state={state === 'error' ? 'error' : 'default'}
        subtitle1={subtitle1}
        subtitle2={subtitle2}
        errorText1={errorText1}
        errorText2={errorText2}
      />
      <FileUploadControls
        size={size}
        onRetry={state !== 'default' ? onRetry : undefined}
        onDownload={state === 'default' ? onDownload : undefined}
        onRemove={state !== 'deleted' ? onRemove : undefined}
        retryLabel={retryLabel}
        downloadLabel={downloadLabel}
        removeLabel={removeLabel}
      />
    </div>
  );
}
