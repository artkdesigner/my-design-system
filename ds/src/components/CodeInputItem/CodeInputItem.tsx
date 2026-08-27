import type { HTMLAttributes } from 'react';
import styles from './CodeInputItem.module.css';

type CodeInputItemOwnProps = {
  /** Введённый символ. Показывается только при filled — сама ячейка
   * не решает, заполнена ли она: это разные пропы, как и в Figma
   * (Filled — отдельный булев вариант, а не производная от value). */
  value?: string;
  /** Курсор — вертикальная чёрточка. Узел 176:1255 и соседи в Figma:
   * рисуется вместе со значением, если оно уже есть (Active=Yes,
   * Filled=Yes) — это не взаимоисключающие состояния. */
  active?: boolean;
  filled?: boolean;
  error?: boolean;
  disabled?: boolean;
  size?: 'l' | 'm' | 's';
};

export type CodeInputItemProps = CodeInputItemOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof CodeInputItemOwnProps>;

/**
 * Одна ячейка кода. Узел 176:1256 в Figma (7 вариантов состояния),
 * сверен через MCP-мост: чистая презентационная ячейка — сам ввод и
 * управление фокусом живут в CodeInput, эта ячейка ничего не решает
 * и не слушает события, как и Segment/RadioItem у своих составных
 * контролов.
 *
 * Курсор не рисуется при error или disabled — сверено по извлечённому
 * коду: в обоих случаях набор в ячейке не идёт, поэтому подсказывать
 * место ввода незачем.
 *
 * data-alert="error" обязателен рядом с data-error: без него
 * --element-bg-message/--element-text-message берут дефолтный info-тон
 * (синий) — на красный их переключает только этот атрибут (см.
 * [data-alert="error"] в tokens/element.css), тот же приём, что и у
 * Input с его data-alert на обёртке.
 */
export function CodeInputItem({
  value,
  active = false,
  filled = false,
  error = false,
  disabled = false,
  size = 'l',
  className,
  ...rest
}: CodeInputItemProps) {
  const showCursor = active && !error && !disabled;

  return (
    <div
      {...rest}
      aria-hidden="true"
      className={[styles.cell, className].filter(Boolean).join(' ')}
      data-size={size}
      data-error={(error && !disabled) || undefined}
      data-alert={error && !disabled ? 'error' : undefined}
      data-state={disabled ? 'disabled' : undefined}
    >
      {filled && <span className={styles.value}>{value}</span>}
      {showCursor && <span className={styles.cursor} />}
    </div>
  );
}
