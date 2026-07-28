import type { HTMLAttributes } from 'react';
import styles from './Spinner.module.css';

type SpinnerOwnProps = {
  /** Размер. Своего токена размера у Spinner в Figma не заведено (узел
   * 183:4853 — один статичный кадр 24×24), поэтому используется тот же
   * --addon-size, что у Icon/Addon — она уже задаёт масштаб 24/20/16. */
  size?: 'l' | 'm' | 's';
};

export type SpinnerProps = SpinnerOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, keyof SpinnerOwnProps>;

/**
 * Индикатор загрузки. Узел 183:4853 в Figma, сверен через MCP-мост.
 *
 * В макете это кольцо (Ellipse, толщина ~12.5% диаметра), закрашенное
 * угловым (conic) градиентом от прозрачного к element-bg-action-primary —
 * эффект «кометы», плюс маленькая головная точка element-icon-primary на
 * переднем крае дуги. Sам макет — статичный кадр (Figma не анимирует
 * компонент-ноды), вращение — это ::after с CSS-анимацией rotate.
 * Проценты вместо px везде, чтобы кольцо и точка масштабировались вместе
 * с size без отдельных токенов на каждый размер.
 *
 * Декоративный по умолчанию (aria-hidden), как и Icon: подписывать
 * состояние загрузки (role="status", aria-label) — забота вызывающего
 * кода, у самого Spinner для этого нет универсального текста по умолчанию.
 */
export function Spinner({ size = 'l', className, ...rest }: SpinnerProps) {
  return (
    <span
      {...rest}
      aria-hidden="true"
      data-size={size}
      className={[styles.spinner, className].filter(Boolean).join(' ')}
    />
  );
}
