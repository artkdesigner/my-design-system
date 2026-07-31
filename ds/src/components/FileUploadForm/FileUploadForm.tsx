import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { FileUploadItem } from '../FileUploadItem';
import { Attach } from '../Attach';
import { AttachFileItem } from '../AttachFileItem';
import { Dropzone } from '../Dropzone';
import styles from './FileUploadForm.module.css';

export type FileUploadFormFile = {
  id: string | number;
  name: ReactNode;
  format?: ReactNode;
  state?: 'default' | 'error' | 'deleted';
  progress?: number;
  subtitle1?: ReactNode;
  subtitle2?: ReactNode;
  errorText1?: ReactNode;
  errorText2?: ReactNode;
  icon?: ReactNode;
};

type FileUploadFormOwnProps = {
  title?: ReactNode;
  description?: ReactNode;
  files?: FileUploadFormFile[];
  showCounter?: boolean;
  counterLabel?: ReactNode;
  attachLabel?: ReactNode;
  acceptHint?: ReactNode;
  hint?: ReactNode;
  dropzoneText?: ReactNode;
  onAttach?: () => void;
  onFilesDrop?: (files: FileList) => void;
  onRetryFile?: (id: FileUploadFormFile['id']) => void;
  onDownloadFile?: (id: FileUploadFormFile['id']) => void;
  onRemoveFile?: (id: FileUploadFormFile['id']) => void;
};

export type FileUploadFormProps = FileUploadFormOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof FileUploadFormOwnProps>;

/**
 * Форма загрузки файлов. Узел 212:20522 в Figma (варианты Dragged=No/Yes),
 * сверен через MCP-мост: карточка целиком собрана из уже готовых
 * FileUploadItem + Attach + Dropzone, здесь только Heading, счётчик и их
 * компоновка.
 *
 * Dragged — не React-условие «показать вместо», а CSS-видимость: Content
 * и Dropzone оба всегда в DOM (как и в макете, где Dropzone лежит слоем
 * z-1 под Content z-2), при активном перетаскивании Content получает
 * opacity:0 и pointer-events:none через data-dragged на корне. Так
 * элемент под курсором не подменяется на лету — размонтирование узла
 * прямо во время HTML5 drag-сессии в некоторых браузерах обрывает саму
 * операцию перетаскивания.
 *
 * Из-за pointer-events:none на Content, пока идёт перетаскивание, целью
 * dragover/dragleave/drop становится сам Dropzone (он теперь единственный
 * элемент под курсором) — поэтому вся логика сброса isDragActive и
 * реального приёма файлов идёт через готовые onDragLeave/onFilesDrop
 * самого Dropzone, а не через отдельный трекер на корне.
 */
export function FileUploadForm({
  title,
  description,
  files = [],
  showCounter = true,
  counterLabel = 'Всего файлов',
  attachLabel,
  acceptHint,
  hint,
  dropzoneText,
  onAttach,
  onFilesDrop,
  onRetryFile,
  onDownloadFile,
  onRemoveFile,
  className,
  onDragEnter,
  ...rest
}: FileUploadFormProps) {
  const [isDragActive, setDragActive] = useState(false);

  return (
    <div
      {...rest}
      data-dragged={isDragActive || undefined}
      className={[styles.form, className].filter(Boolean).join(' ')}
      onDragEnter={(event) => {
        if (event.dataTransfer.types.includes('Files')) {
          event.preventDefault();
          setDragActive(true);
        }
        onDragEnter?.(event);
      }}
    >
      <div className={styles.content}>
        {(title || description) && (
          <div className={styles.heading}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
        )}

        {files.length > 0 && (
          <div className={styles.files}>
            {showCounter && (
              <div className={styles.counter}>
                <span className={styles.counterLabel}>{counterLabel}</span>
                <span className={styles.counterValue}>{files.length}</span>
              </div>
            )}
            <div className={styles.filesGroup}>
              {files.map((file) => (
                <FileUploadItem
                  key={file.id}
                  name={file.name}
                  format={file.format}
                  state={file.state}
                  progress={file.progress}
                  subtitle1={file.subtitle1}
                  subtitle2={file.subtitle2}
                  errorText1={file.errorText1}
                  errorText2={file.errorText2}
                  icon={file.icon}
                  onRetry={onRetryFile && (() => onRetryFile(file.id))}
                  onDownload={onDownloadFile && (() => onDownloadFile(file.id))}
                  onRemove={onRemoveFile && (() => onRemoveFile(file.id))}
                />
              ))}
            </div>
          </div>
        )}

        <Attach label={attachLabel} hint={hint} onClick={onAttach}>
          {acceptHint && <AttachFileItem label={acceptHint} />}
        </Attach>
      </div>

      <Dropzone
        className={styles.dropzoneLayer}
        onDragLeave={() => setDragActive(false)}
        onFilesDrop={(dropped) => {
          onFilesDrop?.(dropped);
          setDragActive(false);
        }}
      >
        {dropzoneText}
      </Dropzone>
    </div>
  );
}
