import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import { Checkmark } from '../Checkmark';
import styles from './Addon.module.css';

type AddonOwnProps = {
  /** Размер. Соответствует режимам коллекции ComponentSize — тому же
   * --addon-size, что уже сидит в Icon и в Button/ActionButton/TextButton/Input. */
  size?: 'l' | 'm' | 's';
  /**
   * Быстрый выбор содержимого без импорта Icon самому: имя иконки из общего
   * набора. Приоритетнее checkmark, text и children — если задан icon, они
   * игнорируются.
   */
  icon?: IconName;
  /**
   * Быстрый выбор содержимого без импорта Checkmark самому: показывает
   * Checkmark нужного размера, значение — его проп selected. Приоритетнее
   * text и children, но не icon.
   */
  checkmark?: boolean;
  /**
   * Короткая текстовая подпись («kg», «$», «per month»). В отличие от
   * icon/checkmark, вариант Type=Text в Figma (узел 241:484) — не квадрат:
   * ширина по контенту (а не --addon-size), скругление radius-4, свой цвет
   * (element-text-secondary) и размер шрифта
   * (field-input-label-font-size-small) — Addon сам красит текст, а не
   * оставляет цвет вызывающему коду, как у Icon/Checkmark. Приоритетнее
   * children, но не icon/checkmark.
   */
  text?: ReactNode;
  children?: ReactNode;
};

export type AddonProps = AddonOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, keyof AddonOwnProps>;

/**
 * Слот дизайн-системы: квадрат --addon-size (кроме варианта text — см.
 * ниже), в который подставляется один из компонентов — Icon, Checkmark,
 * IconButton, CheckboxItem, RadioItem, StatusBadge, Spinner, Indicator,
 * Text — так же, как instance swap в Figma. Addon отвечает только за место
 * (размер и растягивание вложенного элемента на всю площадь), не за цвет:
 * у Button, TextButton и Input свой цвет по умолчанию для этого слота
 * (element_icon_primary у одних, element_icon_accent у TextButton), и он
 * остаётся на стороне вызывающего компонента через переданный className.
 * Исключение — text: там цвет и размер шрифта заданы самим Addon (см.
 * проп text), потому что это не icon-подобное содержимое с currentColor,
 * а самостоятельный текстовый лейбл со своей типографикой в макете.
 *
 * aria-hidden не выставляется по умолчанию: слот может держать интерактивный
 * элемент (IconButton, CheckboxItem, RadioItem), которому нельзя прятаться
 * от скринридера. Вызывающий код помечает aria-hidden сам — там, где внутри
 * действительно декоративная иконка.
 *
 * Для трёх самых частых случаев — Icon, Checkmark и Text — есть пропы icon,
 * checkmark и text: не нужно самому подставлять компонент/вёрстку и
 * передавать ему size, Addon сделает это сам. Для остального (IconButton,
 * CheckboxItem, RadioItem, StatusBadge, Spinner, Indicator и любой
 * произвольный ReactNode) по-прежнему передаётся children.
 */
export function Addon({ size = 'l', icon, checkmark, text, children, className, ...rest }: AddonProps) {
  const isText = icon === undefined && checkmark === undefined && text !== undefined;

  const content =
    icon !== undefined ? (
      <Icon name={icon} size={size} />
    ) : checkmark !== undefined ? (
      <Checkmark selected={checkmark} size={size} />
    ) : isText ? (
      <span className={styles.text}>{text}</span>
    ) : (
      children
    );

  return (
    <span
      {...rest}
      data-size={size}
      data-content={isText ? 'text' : undefined}
      className={[styles.addon, className].filter(Boolean).join(' ')}
    >
      {content}
    </span>
  );
}
