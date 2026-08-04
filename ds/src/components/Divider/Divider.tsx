import type { HTMLAttributes } from 'react';
import styles from './Divider.module.css';

type DividerOwnProps = {
  /** Направление линии. Соответствует двум узлам в Figma: Divider/Horizontal
   * и Divider/Vertical — в коде это один компонент с пропом, а не два
   * разных, потому что разница только в оси. */
  orientation?: 'horizontal' | 'vertical';
};

export type DividerProps = DividerOwnProps & Omit<HTMLAttributes<HTMLHRElement>, keyof DividerOwnProps>;

/**
 * Разделительная линия. Узлы 256:597/256:598 в Figma, сверены через
 * MCP-мост: линия толщиной 1px цвета element_border_secondary, растянутая
 * на всю доступную длину — фиксированные 200×4/4×200 в макете это размер
 * демонстрационного кадра, не значение самого компонента.
 *
 * Тег <hr> (не div): это тематический разделитель контента, семантика
 * есть готовая, придумывать role не нужно. role="separator" ставится
 * только для vertical — у <hr> он по умолчанию horizontal, вертикальную
 * ориентацию для скринридера нужно объявить явно через aria-orientation,
 * а сам role в браузерах уже есть неявно.
 */
export function Divider({ orientation = 'horizontal', className, ...rest }: DividerProps) {
  return (
    <hr
      {...rest}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      data-orientation={orientation}
      className={[styles.divider, className].filter(Boolean).join(' ')}
    />
  );
}
