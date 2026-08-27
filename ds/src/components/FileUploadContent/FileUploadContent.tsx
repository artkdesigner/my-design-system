import type { HTMLAttributes, ReactNode } from 'react';
import styles from './FileUploadContent.module.css';

type FileUploadContentOwnProps = {
  size?: 'l' | 'm' | 's';
  name: ReactNode;
  format?: ReactNode;
  /** Соответствует State в Figma (узел 197:778). */
  state?: 'default' | 'error';
  /** default: до двух подписей под именем файла. */
  subtitle1?: ReactNode;
  subtitle2?: ReactNode;
  /** error: до двух строк ошибки вместо подписей. */
  errorText1?: ReactNode;
  errorText2?: ReactNode;
};

export type FileUploadContentProps = FileUploadContentOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof FileUploadContentOwnProps>;

/**
 * Текстовая часть строки загрузки файла. Узел 197:778 в Figma, сверен
 * через MCP-мост.
 */
export function FileUploadContent({
  size = 'l',
  name,
  format,
  state = 'default',
  subtitle1,
  subtitle2,
  errorText1,
  errorText2,
  className,
  ...rest
}: FileUploadContentProps) {
  return (
    <div
      {...rest}
      data-size={size}
      data-alert={state === 'error' ? 'error' : undefined}
      className={[styles.content, className].filter(Boolean).join(' ')}
    >
      <div className={styles.title}>
        <span className={styles.name}>{name}</span>
        {format && (
          <>
            <span>.</span>
            <span>{format}</span>
          </>
        )}
      </div>
      {state === 'default' && (subtitle1 || subtitle2) && (
        <div className={styles.subtitles}>
          {subtitle1 && <span className={styles.subtitle}>{subtitle1}</span>}
          {subtitle2 && <span className={styles.subtitle}>{subtitle2}</span>}
        </div>
      )}
      {state === 'error' && (errorText1 || errorText2) && (
        <div className={styles.errors}>
          {errorText1 && <p className={styles.error}>{errorText1}</p>}
          {errorText2 && <p className={styles.error}>{errorText2}</p>}
        </div>
      )}
    </div>
  );
}
