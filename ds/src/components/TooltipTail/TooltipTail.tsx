import type { HTMLAttributes } from 'react';
import styles from './TooltipTail.module.css';

type TooltipTailOwnProps = {
  /** Смещение вдоль края тултипа. Соответствует Position в Figma (узел
   * 181:987): Middle — по центру, Start/End — прижат к краю с отступом
   * tail-margin. Работает, только когда родитель растягивает хвостик на
   * всю высоту (align-self: stretch) — сам по себе, без растяжения,
   * хвостик занимает только свой размер и позиция не видна. */
  position?: 'start' | 'middle' | 'end';
  size?: 'l' | 'm' | 's';
};

export type TooltipTailProps = TooltipTailOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof TooltipTailOwnProps>;

/**
 * Хвостик тултипа — треугольник со скруглённым остриём. Узел 181:987 в
 * Figma, сверен через MCP-мост: в макете это картинка (Vector), но форма —
 * простой путь с одной скруглённой вершиной, поэтому здесь это inline SVG
 * с тем же path, а не img/иконка из общей библиотеки Icon — форма
 * специфична только для Tooltip, в общий набор иконок (страница Icons в
 * Figma) не входит.
 *
 * Направление (стрелка смотрит влево) в самом компоненте не варьируется —
 * в Figma у TooltipTail нет такого свойства, поворот под остальные три
 * направления делает снаружи составной Tooltip (как и в извлечённом коде
 * Figma, где поворот/отражение навешаны на обёртку, а не на сам хвостик).
 */
export function TooltipTail({ position = 'middle', size = 'l', className, ...rest }: TooltipTailProps) {
  return (
    <div
      {...rest}
      aria-hidden="true"
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-position={position}
    >
      <svg className={styles.shape} viewBox="0 0 9.58579 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.58579 0V20L0.292192 10.6879C-0.0979452 10.297 -0.0973163 9.66386 0.293597 9.27372L9.58579 0Z" fill="currentColor" />
      </svg>
    </div>
  );
}
