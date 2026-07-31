import { useState, type DragEvent, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './Dropzone.module.css';

type DropzoneOwnProps = {
  icon?: ReactNode;
  children?: ReactNode;
  /** Файлы, отпущенные над зоной. Без него drag-and-drop визуально работает
   * (data-active), но сами файлы никуда не попадают. */
  onFilesDrop?: (files: FileList) => void;
  disabled?: boolean;
};

export type DropzoneProps = DropzoneOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof DropzoneOwnProps>;

/**
 * Зона перетаскивания файлов. Узел 194:672 в Figma, сверен через
 * MCP-мост: в макете один статичный вариант (штрихпунктирная рамка,
 * иконка + текст по центру), состояние наведения файла при перетаскивании
 * в макете не показано — добавлено как необходимое поведение самого
 * дропзоны (data-active по dragenter/dragleave), а не как выдумка сверх
 * макета: без него компонент с таким именем не давал бы обратной связи,
 * ради которой существует.
 *
 * Реальный HTML5 drag-and-drop (onDragOver/onDrop), а не только визуал:
 * onFilesDrop получает нативный FileList из dataTransfer.
 */
export function Dropzone({
  icon = <Icon name="download-02" size="l" />,
  children = 'Перетащите файлы',
  onFilesDrop,
  disabled = false,
  className,
  onDragOver,
  onDragLeave,
  onDrop,
  ...rest
}: DropzoneProps) {
  const [isActive, setActive] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) setActive(true);
    onDragOver?.(event);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    setActive(false);
    onDragLeave?.(event);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setActive(false);
    if (!disabled) onFilesDrop?.(event.dataTransfer.files);
    onDrop?.(event);
  };

  return (
    <div
      {...rest}
      data-active={isActive || undefined}
      data-disabled={disabled || undefined}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[styles.dropzone, className].filter(Boolean).join(' ')}
    >
      <div className={styles.content}>
        {icon}
        <p className={styles.text}>{children}</p>
      </div>
    </div>
  );
}
