import type { HTMLAttributes, ReactNode } from 'react';
import { TooltipTail } from '../TooltipTail';
import styles from './Tooltip.module.css';

type TooltipOwnProps = {
  /** Тело тултипа. Соответствует слоту instance в Figma — что передали,
   * то и рисуется в теле, сам Tooltip тип содержимого не решает. Обычно
   * это готовый TooltipContent (preset="text" или "custom"), но слот не
   * завязан именно на него, как stepper у Input. */
  children: ReactNode;
  /** Куда смотрит остриё хвостика. Соответствует TailDirection в Figma
   * (узел 181:855, варианты ←/→/↑/↓): тултип стоит с противоположной
   * стороны от острия — left рисует хвостик слева и указывает на цель
   * слева от тултипа, и так далее. */
  tailDirection?: 'left' | 'right' | 'up' | 'down';
  size?: 'l' | 'm' | 's';
};

export type TooltipProps = TooltipOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof TooltipOwnProps>;

/**
 * Тултип. Узел 181:855 в Figma (все 4 направления хвостика), сверен через
 * MCP-мост.
 *
 * Тень — drop-shadow, а не box-shadow: в макете четыре наложенных эффекта
 * тени повторяют силуэт фигуры целиком, включая хвостик, а box-shadow
 * обвёл бы только прямоугольное тело, срезав тень с треугольника.
 * Смещения и радиусы четырёх слоёв — из самого эффекта в Figma
 * (Shadow/Tooltip), токена на весь стек нет, только на два входящих в
 * него цвета (element-bg-shadow-light/dark), поэтому оффсеты/радиусы
 * оставлены числами, как и инсет точки у RadioItem.
 *
 * Поворот хвостика под right/up/down — на обёртке снаружи TooltipTail
 * (сам компонент всегда рисует остриё влево, см. TooltipTail), тем же
 * приёмом, что и в извлечённом коде Figma: right — зеркалим по горизонтали,
 * up/down — поворот на 90°/-90°. transform не меняет раскладку, поэтому
 * повёрнутый хвостик остаётся отцентрован там же, где стоял до поворота.
 */
export function Tooltip({ children, tailDirection = 'left', size = 'l', className, ...rest }: TooltipProps) {
  const isVertical = tailDirection === 'up' || tailDirection === 'down';
  const tailFirst = tailDirection === 'left' || tailDirection === 'up';

  const tail = (
    <div className={styles.tailSlot} data-direction={tailDirection}>
      <TooltipTail size={size} />
    </div>
  );

  return (
    <div
      {...rest}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-axis={isVertical ? 'column' : 'row'}
    >
      {tailFirst && tail}
      <div className={styles.body}>{children}</div>
      {!tailFirst && tail}
    </div>
  );
}
