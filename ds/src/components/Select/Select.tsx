import {
  useId,
  useState,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import { Addon } from '../Addon';
import { Icon } from '../Icon';
import { OptionList } from '../OptionList';
import { OptionListCell } from '../OptionListCell';
import styles from './Select.module.css';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectOwnProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  hint?: ReactNode;
  alert?: boolean;
  alertText?: ReactNode;
  leftAddon?: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type SelectProps = SelectOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SelectOwnProps | 'value' | 'onChange'>;

/**
 * Выпадающий список одиночного выбора. Узел 119:3032 в Figma, сверен через
 * MCP-мост: та же 8-состояний матрица label/hint/alert/disabled, что и у
 * Input, но не обёртка над ним — поле целиком кнопка (role="combobox"),
 * а не <input>: значение не печатается, а выбирается из списка, поэтому
 * в макете нет ни курсора, ни плейсхолдера (сверено — в отличие от Input,
 * ветки Placeholder/Cursor в Select отсутствуют даже в состоянии «в
 * фокусе, не заполнено»). Из-за этого подпись здесь не подменяется
 * нативным placeholder, как у Input, а один и тот же элемент label сам
 * плавно переключается между крупным видом (замещает значение, пока
 * ничего не выбрано) и мелким всплывшим (когда открыт список или выбор
 * уже есть) — состояние active из Figma называется здесь open.
 *
 * Выпадающая карточка — готовый OptionList из OptionListCell с Checkmark,
 * как и в OptionListHeader/Footer, собирается через children. Отступ
 * под неё — тот же приём, что у InputAutoComplete (см. её комментарий):
 * OptionList не занимается своим позиционированием, это делает обёртка.
 *
 * Шеврон разворачивается на 180° в открытом состоянии простым CSS-поворотом
 * по data-атрибуту — без повтора двойного transform из экспорта Figma
 * (там тот же итоговый эффект: закрыто — вниз, открыто — вверх).
 *
 * Клавиатура и mousedown-гашение — как у InputAutoComplete: стрелки
 * двигают подсветку, Enter выбирает, Escape закрывает, mousedown по
 * карточке не даёт клику по варианту оборвать фокус раньше выбора.
 * Список всегда полный — в отличие от InputAutoComplete, тут нечем
 * фильтровать: нет поля ввода текста.
 */
export function Select({
  options,
  value,
  defaultValue,
  onChange,
  label,
  hint,
  alert = false,
  alertText,
  leftAddon,
  size = 'l',
  id,
  disabled,
  onKeyDown,
  onBlur,
  className,
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = value ?? uncontrolledValue;
  const selectedOption = options.find((option) => option.value === currentValue);
  const isFilled = Boolean(selectedOption);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const commit = (next: string) => {
    if (value === undefined) setUncontrolledValue(next);
    onChange?.(next);
  };

  const selectOption = (option: SelectOption) => {
    commit(option.value);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleClick = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
    setActiveIndex(-1);
  };

  const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
    setOpen(false);
    setActiveIndex(-1);
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
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
          selectOption(options[activeIndex]);
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
  const labelFloated = open || isFilled;
  const showDropdown = open && !disabled && options.length > 0;
  const hintText = alert ? alertText : hint;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-size={size}
      data-alert={alert || undefined}
      data-message={alert ? 'error' : undefined}
      data-state={disabled ? 'disabled' : undefined}
      data-label-floated={labelFloated || undefined}
      data-active={open || undefined}
    >
      <button
        {...rest}
        type="button"
        id={triggerId}
        disabled={disabled}
        role="combobox"
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
        <span className={styles.content}>
          {label && <span className={styles.label}>{label}</span>}
          {isFilled && <span className={styles.value}>{selectedOption?.label}</span>}
        </span>
        <Addon size={size} className={[styles.addon, styles.chevron].join(' ')} aria-hidden="true">
          <Icon name="chevron-down" size={size} />
        </Addon>
      </button>
      {showDropdown && (
        <div className={styles.dropdown} onMouseDown={(event) => event.preventDefault()}>
          <OptionList id={listboxId} role="listbox" size={size}>
            {options.map((option, index) => (
              <OptionListCell
                key={option.value}
                id={optionId(index)}
                label={option.label}
                selected={option.value === currentValue}
                size={size}
                className={index === activeIndex ? styles.highlighted : undefined}
                onClick={() => selectOption(option)}
              />
            ))}
          </OptionList>
        </div>
      )}
      {hintText && <div className={styles.hint}>{hintText}</div>}
    </div>
  );
}
