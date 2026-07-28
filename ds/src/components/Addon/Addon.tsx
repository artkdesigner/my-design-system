import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import { Checkmark } from '../Checkmark';
import { CheckboxItem, type CheckboxItemProps } from '../CheckboxItem';
import { RadioItem, type RadioItemProps } from '../RadioItem';
import { StatusBadge, type StatusBadgeProps } from '../StatusBadge';
import { Spinner, type SpinnerProps } from '../Spinner';
import { Indicator, type IndicatorProps } from '../Indicator';
import styles from './Addon.module.css';

type AddonOwnProps = {
  /** Размер. Соответствует режимам коллекции ComponentSize — тому же
   * --addon-size, что уже сидит в Icon и в Button/ActionButton/TextButton/Input. */
  size?: 'l' | 'm' | 's';
  /**
   * Быстрый выбор содержимого без импорта Icon самому: имя иконки из общего
   * набора. Приоритетнее остальных пропов и children.
   */
  icon?: IconName;
  /**
   * Быстрый выбор содержимого без импорта Checkmark самому: показывает
   * Checkmark нужного размера, значение — его проп selected.
   */
  checkmark?: boolean;
  /**
   * Пропы CheckboxItem без size (его задаёт сам Addon) — показывает
   * CheckboxItem нужного размера без ручной подстановки компонента.
   */
  checkboxItem?: Omit<CheckboxItemProps, 'size'>;
  /** Пропы RadioItem без size — тот же приём, что у checkboxItem. */
  radioItem?: Omit<RadioItemProps, 'size'>;
  /** Пропы StatusBadge без size — тот же приём, что у checkboxItem. */
  statusBadge?: Omit<StatusBadgeProps, 'size'>;
  /** Пропы Spinner без size — тот же приём, что у checkboxItem. У Spinner
   * кроме size настраивать почти нечего, но проп остаётся объектом
   * (не boolean, как checkmark), чтобы можно было передать role/aria-label
   * для читалок экрана. */
  spinner?: Omit<SpinnerProps, 'size'>;
  /** Пропы Indicator без size — тот же приём, что у checkboxItem. */
  indicator?: Omit<IndicatorProps, 'size'>;
  /**
   * Короткая текстовая подпись («kg», «$», «per month»). В отличие от
   * остальных быстрых пропов, вариант Type=Text в Figma (узел 241:484) —
   * не квадрат: ширина по контенту (а не --addon-size), скругление
   * radius-4, свой цвет (element-text-secondary) и размер шрифта
   * (field-input-label-font-size-small) — Addon сам красит текст, а не
   * оставляет цвет вызывающему коду, как у остальных вариантов.
   */
  text?: ReactNode;
  children?: ReactNode;
};

export type AddonProps = AddonOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, keyof AddonOwnProps>;

/**
 * Слот дизайн-системы: квадрат --addon-size (кроме варианта text — см.
 * ниже), в который подставляется один из компонентов — Icon, Checkmark,
 * IconButton, CheckboxItem, RadioItem, StatusBadge, Spinner, Indicator,
 * Text — так же, как instance swap в Figma (узел 80:1181). Addon отвечает
 * только за место (размер и растягивание вложенного элемента на всю
 * площадь), не за цвет: у Button, TextButton и Input свой цвет по
 * умолчанию для этого слота (element_icon_primary у одних,
 * element_icon_accent у TextButton), и он остаётся на стороне вызывающего
 * компонента через переданный className. Исключение — text: там цвет и
 * размер шрифта заданы самим Addon (см. проп text), потому что это не
 * icon-подобное содержимое с currentColor, а самостоятельный текстовый
 * лейбл со своей типографикой в макете.
 *
 * aria-hidden не выставляется по умолчанию: слот может держать интерактивный
 * элемент (CheckboxItem, RadioItem), которому нельзя прятаться от
 * скринридера. Вызывающий код помечает aria-hidden сам — там, где внутри
 * действительно декоративная иконка.
 *
 * Для восьми случаев — Icon, Checkmark, CheckboxItem, RadioItem,
 * StatusBadge, Spinner, Indicator и Text — есть одноимённые пропы:
 * не нужно самому импортировать компонент и передавать ему size, Addon
 * сделает это сам.
 *
 * IconButton среди них нет — не пропуск, а сознательное решение. В Figma
 * это тоже вариант instance swap, но в коде IconButton сам рендерит Addon
 * внутри себя (см. IconButton.tsx): импорт IconButton сюда создал бы
 * циклическую зависимость Addon → IconButton → Addon. И даже без цикла
 * это было бы неверно по смыслу — тот же запрет, что IconButton уже
 * держит для своего собственного слота: вложенная кнопка внутри чужого
 * декоративного слота — невалидный HTML (button в button), плюс IconButton
 * — интерактивный элемент, а не картинка, которую можно бездумно
 * подставлять как соседние Icon/Checkmark. Такой случай — по-прежнему
 * через children, как и любой произвольный ReactNode.
 */
export function Addon({
  size = 'l',
  icon,
  checkmark,
  checkboxItem,
  radioItem,
  statusBadge,
  spinner,
  indicator,
  text,
  children,
  className,
  ...rest
}: AddonProps) {
  let content: ReactNode;
  // 'text' и 'indicator' меняют форму слота (ширина по контенту, а не
  // квадрат --addon-size) — остальным data-content не нужен, они и так
  // квадрат по умолчанию.
  let shape: 'text' | 'indicator' | undefined;

  if (icon !== undefined) {
    content = <Icon name={icon} size={size} />;
  } else if (checkmark !== undefined) {
    content = <Checkmark selected={checkmark} size={size} />;
  } else if (checkboxItem !== undefined) {
    content = <CheckboxItem {...checkboxItem} size={size} />;
  } else if (radioItem !== undefined) {
    content = <RadioItem {...radioItem} size={size} />;
  } else if (statusBadge !== undefined) {
    content = <StatusBadge {...statusBadge} size={size} />;
  } else if (spinner !== undefined) {
    content = <Spinner {...spinner} size={size} />;
  } else if (indicator !== undefined) {
    content = <Indicator {...indicator} size={size} />;
    shape = 'indicator';
  } else if (text !== undefined) {
    content = <span className={styles.text}>{text}</span>;
    shape = 'text';
  } else {
    content = children;
  }

  return (
    <span
      {...rest}
      data-size={size}
      data-content={shape}
      className={[styles.addon, className].filter(Boolean).join(' ')}
    >
      {content}
    </span>
  );
}
