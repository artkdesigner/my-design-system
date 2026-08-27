import {
  useId,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import { Addon } from '../Addon';
import { Icon } from '../Icon';
import { OptionList } from '../OptionList';
import { OptionListCell } from '../OptionListCell';
import { ValueList } from '../ValueList';
import styles from './SelectWithTags.module.css';

export type SelectWithTagsOption = {
  value: string;
  label: string;
};

type SelectWithTagsOwnProps = {
  options: SelectWithTagsOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  /** Показывается вместо крупной подписи, когда поле в фокусе и ещё
   * ничего не выбрано (узел 146:1513, Placeholder). Без него в этом
   * состоянии остаётся только всплывшая мелкая подпись. */
  placeholder?: string;
  hint?: ReactNode;
  /** Тон уведомления под полем. Одно значение, как у Input/Button (не булев
   * флаг): режим AlertType в Figma стоит на самом компоненте. undefined —
   * уведомления нет. */
  alert?: 'info' | 'success' | 'warning' | 'error';
  alertText?: ReactNode;
  leftAddon?: ReactNode;
  disabled?: boolean;
  size?: 'l' | 'm' | 's';
  /** Порог сворачивания тегов — прокидывается в ValueList как есть, см. её
   * комментарий: без явного порога список не сворачивается. */
  maxVisibleTags?: number;
};

export type SelectWithTagsProps = SelectWithTagsOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof SelectWithTagsOwnProps>;

/**
 * Выпадающий список множественного выбора с тегами в поле. Узел 146:1443 в
 * Figma (SelectWithTags), сверен через MCP-мост вместе с соседними
 * SelectTag/TagControl/ValueList (144:10250, 144:10261, 147:8755) —
 * токены select_selectwithtags, select_selecttag, select_valuelist
 * общие для всей группы, не переиспользование input/field.
 *
 * Тот же принцип, что у Select — сверено тем же комментарием там: поле не
 * печатает текст, значение выбирается из списка, а не вводится, поэтому
 * поле не <input>. Но, в отличие от Select, поле здесь не может быть
 * <button>: внутри живут настоящие кнопки удаления тегов (SelectTag), а
 * кнопка в кнопке — невалидный HTML (тот же запрет, что уже объяснён в
 * Addon.tsx про IconButton). Поэтому поле — div с role="combobox" и
 * tabIndex, а не нативная кнопка; фокус и клавиатура собраны вручную по
 * образцу Select. Клик по тегу или по TagControl внутри ValueList гасит
 * всплытие (см. её комментарий и код) — иначе удаление тега заодно
 * открывало или закрывало бы список.
 *
 * Список — множественного выбора: клик по варианту переключает его в
 * currentValue (уже выбранный — снова превращается в невыбранный, тот же
 * тег просто исчезает из поля), список не закрывается после выбора — тегов
 * может быть несколько подряд. Закрывает список расфокус, Escape или
 * повторный клик по полю.
 *
 * Подпись, в отличие от Select, не остаётся мелкой над значением: пока
 * выбор пуст, она стоит крупно на месте значения (или мелко — в фокусе,
 * рядом с placeholder); как только появляется хоть один тег, подпись
 * пропадает вовсе и место занимает ValueList — сверено скриншотом узла
 * 146:1500, отдельной надписи над тегами в макете нет.
 *
 * Декоративный «курсор» рядом с placeholder (узел 147:6087) — просто
 * вертикальная черта из экспорта Figma, не настоящий текстовый ввод: поле
 * не печатает, курсор здесь только имитирует фокус визуально.
 */
export function SelectWithTags({
  options,
  value,
  defaultValue,
  onChange,
  label,
  placeholder,
  hint,
  alert,
  alertText,
  leftAddon,
  disabled = false,
  size = 'l',
  maxVisibleTags,
  id,
  onKeyDown,
  onBlur,
  className,
  ...rest
}: SelectWithTagsProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const listboxId = `${fieldId}-listbox`;

  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue ?? []);
  const currentValue = value ?? uncontrolledValue;
  const selectedItems = currentValue
    .map((v) => options.find((option) => option.value === v))
    .filter((option): option is SelectWithTagsOption => Boolean(option));
  const isFilled = selectedItems.length > 0;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const commit = (next: string[]) => {
    if (value === undefined) setUncontrolledValue(next);
    onChange?.(next);
  };

  const toggleOption = (optionValue: string) => {
    const next = currentValue.includes(optionValue)
      ? currentValue.filter((v) => v !== optionValue)
      : [...currentValue, optionValue];
    commit(next);
  };

  const removeValue = (optionValue: string) => {
    commit(currentValue.filter((v) => v !== optionValue));
  };

  const handleClick = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
    setActiveIndex(-1);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    // Фокус может уйти не наружу, а на вложенный SelectTag/TagControl
    // (это тоже настоящие кнопки внутри поля) — список закрывается только
    // когда фокус действительно покинул поле целиком.
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setOpen(false);
    setActiveIndex(-1);
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!disabled) {
      if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        setOpen(true);
        setActiveIndex(-1);
      } else if (open) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setActiveIndex((index) => (index + 1) % options.length);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          setActiveIndex((index) => (index - 1 + options.length) % options.length);
        } else if (event.key === 'Enter' && activeIndex >= 0 && options[activeIndex]) {
          event.preventDefault();
          toggleOption(options[activeIndex].value);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
        }
      }
    }
    onKeyDown?.(event);
  };

  const optionId = (index: number) => `${listboxId}-option-${index}`;
  const showDropdown = open && !disabled && options.length > 0;
  const hintText = alert ? alertText : hint;
  const labelFloated = open && !isFilled;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-alert={alert}
      data-state={disabled ? 'disabled' : undefined}
      data-active={open || undefined}
    >
      <div
        {...rest}
        id={fieldId}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-haspopup="listbox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
        className={styles.field}
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {leftAddon && (
          <Addon size={size} className={[styles.addon, styles.addonLeft].join(' ')} aria-hidden="true">
            {leftAddon}
          </Addon>
        )}
        <div className={[styles.content, isFilled ? styles.contentFilled : ''].filter(Boolean).join(' ')}>
          {isFilled ? (
            <ValueList
              items={selectedItems}
              size={size}
              disabled={disabled}
              maxVisible={maxVisibleTags}
              onRemove={removeValue}
            />
          ) : (
            <>
              {label && <span className={[styles.label, labelFloated ? styles.labelFloated : ''].join(' ')}>{label}</span>}
              {labelFloated && placeholder && (
                <span className={styles.placeholder}>
                  <span className={styles.cursor} aria-hidden="true" />
                  {placeholder}
                </span>
              )}
            </>
          )}
        </div>
        <Addon size={size} className={[styles.addon, styles.chevron].join(' ')} aria-hidden="true">
          <Icon name="chevron-down" size={size} />
        </Addon>
      </div>
      {showDropdown && (
        <div className={styles.dropdown} onMouseDown={(event) => event.preventDefault()}>
          <OptionList id={listboxId} role="listbox" aria-multiselectable="true" size={size}>
            {options.map((option, index) => (
              <OptionListCell
                key={option.value}
                id={optionId(index)}
                label={option.label}
                selected={currentValue.includes(option.value)}
                size={size}
                className={index === activeIndex ? styles.highlighted : undefined}
                onClick={() => toggleOption(option.value)}
              />
            ))}
          </OptionList>
        </div>
      )}
      {hintText && <div className={styles.hint}>{hintText}</div>}
    </div>
  );
}
