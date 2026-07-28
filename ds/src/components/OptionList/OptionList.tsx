import type { HTMLAttributes, ReactNode } from 'react';
import styles from './OptionList.module.css';

type OptionListOwnProps = {
  children?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type OptionListProps = OptionListOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof OptionListOwnProps>;

/**
 * Карточка списка опций. Узел 120:9328 в Figma, сверен через MCP-мост:
 * сама карточка — только рамка, скругление и обрезка краёв. Header, ряд
 * ячеек (OptionListCell) и Footer в макете идут внутри как фиксированный
 * пример, но реальный список динамический, поэтому здесь они не
 * зашиты — вызывающий код собирает карточку из OptionListHeader,
 * OptionListCell (сколько нужно) и OptionListFooter через children, как
 * CheckboxGroup собирается из CheckboxItem.
 *
 * У самого узла в Figma есть паддинг сверху (--optionlist-list-padding-top,
 * 60/44/36px по режиму) перед рамкой карточки — это отступ под якорь
 * (условное поле-триггер) на канвасе макета, не часть самого компонента:
 * в продукте карточка позиционируется относительно триггера через
 * поповер/флоатинг-слой вызывающего кода, а не через фиксированный
 * внутренний паддинг. Поэтому токен не используется.
 */
export function OptionList({ children, size = 'l', className, ...rest }: OptionListProps) {
  return (
    <div {...rest} data-size={size} className={[styles.card, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
