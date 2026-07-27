import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Addon.module.css';

type AddonOwnProps = {
  /** Размер. Соответствует режимам коллекции ComponentSize — тому же
   * --addon-size, что уже сидит в Icon и в Button/ActionButton/TextButton/Input. */
  size?: 'l' | 'm' | 's';
  children?: ReactNode;
};

export type AddonProps = AddonOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, keyof AddonOwnProps>;

/**
 * Слот дизайн-системы: квадрат --addon-size, в который подставляется один
 * из компонентов — Icon, Checkmark, IconButton, CheckboxItem, RadioItem,
 * StatusBadge, Spinner, Indicator, Text — так же, как instance swap в
 * Figma. Addon отвечает только за место (размер и растягивание вложенного
 * элемента на всю площадь), не за цвет: у Button, TextButton и Input свой
 * цвет по умолчанию для этого слота (element_icon_primary у одних,
 * element_icon_accent у TextButton), и он остаётся на стороне вызывающего
 * компонента через переданный className.
 *
 * aria-hidden не выставляется по умолчанию: слот может держать интерактивный
 * элемент (IconButton, CheckboxItem, RadioItem), которому нельзя прятаться
 * от скринридера. Вызывающий код помечает aria-hidden сам — там, где внутри
 * действительно декоративная иконка.
 */
export function Addon({ size = 'l', children, className, ...rest }: AddonProps) {
  return (
    <span {...rest} data-size={size} className={[styles.addon, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
