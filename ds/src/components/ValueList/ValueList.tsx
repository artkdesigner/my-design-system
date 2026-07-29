import { useState, type HTMLAttributes } from 'react';
import { SelectTag } from '../SelectTag';
import { TagControl } from '../TagControl';
import styles from './ValueList.module.css';

export type ValueListItem = {
  value: string;
  label: string;
};

type ValueListOwnProps = {
  items: ValueListItem[];
  /** Убрать значение — щелчок по SelectTag. Без обработчика теги
   * по-прежнему рисуются, просто без крестика (тот же приём, что у
   * disabled — см. SelectTag). */
  onRemove?: (value: string) => void;
  disabled?: boolean;
  size?: 'l' | 'm' | 's';
  /**
   * Порог сворачивания — сколько тегов показывать, пока не нажат TagControl
   * «Ещё N». Без этого пропа список никогда не сворачивается: перенос строк
   * во флексе и так справляется с переполнением, сворачивание — не решение
   * компонента по умолчанию, а поведение по явному запросу вызывающего кода.
   * Своё состояние развёрнутости хранит внутри себя, тем же приёмом, что и
   * open у Select — снаружи это не требует контроля.
   */
  maxVisible?: number;
};

export type ValueListProps = ValueListOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof ValueListOwnProps>;

/**
 * Ряд выбранных значений внутри поля SelectWithTags. Узел 147:8755 в Figma
 * (Collapsed=Yes/No), сверен через MCP-мост: тег-заглушка «Value» с курсором
 * из макета не воспроизведён — SelectWithTags не печатает текст (поле-кнопка,
 * то же решение, что у Select, см. его комментарий), печатать в это место
 * нечего, а курсор без ввода вводил бы в заблуждение.
 *
 * Демо-состояния в макете (2 тега + «Ещё N» либо 8 тегов + «Скрыть») — не
 * жёсткая пороговая величина дизайн-системы, а конкретные примеры: сколько
 * тегов помещается до сворачивания, зависит от их длины и ширины поля,
 * поэтому порог явно задаётся снаружи через maxVisible, а не зашит внутрь.
 */
export function ValueList({ items, onRemove, disabled, size = 'l', maxVisible, className, ...rest }: ValueListProps) {
  const [expanded, setExpanded] = useState(false);

  const collapsible = maxVisible !== undefined && items.length > maxVisible;
  const visibleItems = collapsible && !expanded ? items.slice(0, maxVisible) : items;
  const hiddenCount = items.length - visibleItems.length;

  return (
    <div {...rest} data-size={size} className={[styles.list, className].filter(Boolean).join(' ')}>
      {visibleItems.map((item) => (
        <SelectTag
          key={item.value}
          label={item.label}
          size={size}
          disabled={disabled}
          onClick={(event) => {
            // Гасим всплытие: SelectWithTags вешает свой onClick на поле
            // целиком (открывает/закрывает список), клик по удалению тега —
            // не то же самое действие и не должен его дёргать.
            event.stopPropagation();
            onRemove?.(item.value);
          }}
        />
      ))}
      {collapsible && !expanded && (
        <TagControl
          mode="more"
          count={hiddenCount}
          size={size}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            setExpanded(true);
          }}
        />
      )}
      {collapsible && expanded && (
        <TagControl
          mode="hide"
          size={size}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            setExpanded(false);
          }}
        />
      )}
    </div>
  );
}
