import type { ButtonHTMLAttributes } from 'react';
import styles from './TagControl.module.css';

type TagControlOwnProps = {
  /** Соответствует свойству Type в Figma (узел 144:10261/147:5794): More
   * показывает счётчик скрытых тегов, Hide — сворачивает список обратно.
   * Названо mode, не type — type занят нативным атрибутом кнопки. */
  mode?: 'more' | 'hide';
  /** Сколько тегов скрыто — используется только в mode="more" для подписи
   * «Ещё N». В mode="hide" подпись фиксированная («Скрыть»), проп не читается. */
  count?: number;
  size?: 'l' | 'm' | 's';
};

export type TagControlProps = TagControlOwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof TagControlOwnProps>;

/**
 * Пилюля-переключатель списка тегов ValueList. Узлы 144:10262 (Type=More)
 * и 144:10265 (Type=Hide) в Figma, сверены через MCP-мост: та же коробка,
 * что у SelectTag (select_selecttag_* токены — общий размерный ряд), но
 * заливка element_bg_action_tetriary и обычный текст, без on-accent —
 * это не выбранное значение, а служебный контрол.
 */
export function TagControl({ mode = 'more', count, size = 'l', disabled, className, type = 'button', ...rest }: TagControlProps) {
  const label = mode === 'hide' ? 'Скрыть' : `Ещё ${count ?? 0}`;

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      data-mode={mode}
      data-size={size}
      className={[styles.control, 'ds-interactive', className].filter(Boolean).join(' ')}
    >
      {label}
    </button>
  );
}
