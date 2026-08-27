import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import styles from './Attach.module.css';

type AttachOwnProps = {
  size?: 'l' | 'm' | 's';
  label?: ReactNode;
  /** Содержимое AttachFileItem справа от кнопки — статус файла(ов). */
  children?: ReactNode;
  hint?: ReactNode;
  /** Соответствует Max limit=Yes в Figma (узел 212:22504): достигнут
   * лимит файлов — вместо кнопки и children рисуется только
   * предупреждение maxLimitText. */
  maxLimit?: boolean;
  maxLimitText?: ReactNode;
};

export type AttachProps = AttachOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof AttachOwnProps | 'children'>;

/**
 * Прикрепление файла. Узел 212:22504 в Figma (варианты Max limit=No/Yes),
 * сверен через MCP-мост: кнопка — готовый Button (view="primary" ghost,
 * обводка element_border_primary совпадает по значению), children — слот
 * под AttachFileItem, статус файла отдельным компонентом, не встроен
 * сюда напрямую, чтобы Attach не знал про все пять состояний файла.
 *
 * maxLimitText получает data-alert="warning" тем же приёмом, что и
 * тон alert у Button/Input: цвет берёт готовый element-text-alert,
 * а не захардкоженный жёлтый, как в сгенерированном по макету коде.
 */
export function Attach({
  size = 'l',
  label = 'Прикрепите файл',
  children,
  hint,
  maxLimit = false,
  maxLimitText,
  disabled,
  className,
  ...rest
}: AttachProps) {
  return (
    <div data-size={size} data-max-limit={maxLimit || undefined} className={[styles.attach, className].filter(Boolean).join(' ')}>
      {maxLimit ? (
        <p data-alert="warning" className={styles.maxLimitText}>
          {maxLimitText}
        </p>
      ) : (
        <>
          <div className={styles.top}>
            <Button {...rest} view="primary" ghost size={size} disabled={disabled} iconLeft={<Icon name="paperclip" />}>
              {label}
            </Button>
            {children}
          </div>
          {hint && <p className={styles.hint}>{hint}</p>}
        </>
      )}
    </div>
  );
}
