import {
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent
} from 'react';
import { Input, type InputProps } from '../Input';
import { OptionList } from '../OptionList';
import { OptionListCell } from '../OptionListCell';
import styles from './InputAutoComplete.module.css';

export type InputAutoCompleteOption = {
  value: string;
  label: string;
};

type InputAutoCompleteOwnProps = {
  options: InputAutoCompleteOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export type InputAutoCompleteProps = InputAutoCompleteOwnProps &
  Omit<InputProps, keyof InputAutoCompleteOwnProps | 'value' | 'defaultValue' | 'onChange'>;

/**
 * Поле автодополнения. Узел 153:9902 в Figma, сверено через MCP-мост: та же
 * 8-состояний матрица label/hint/alert/disabled, что и у обычного Input —
 * используется он целиком, без дублирования полей, а не переписан заново.
 *
 * Выпадающая карточка — готовый OptionList из OptionListCell, как и в
 * OptionListHeader/Footer, собирается вызывающим кодом через children.
 * Отступ под неё (токен optionlist_list_padding_top, 60/44/36px по размеру)
 * в самом OptionList сознательно не задействован (см. комментарий в
 * OptionList.tsx) — это забота позиционирующего кода. Здесь этот код —
 * обёртка с position: relative и карточка с position: absolute, отступ
 * сверху отодвигает её под поле, как в макете.
 *
 * Список фильтруется по введённому тексту (подстрокой, без учёта регистра).
 * В макете все строки — одинаковые заглушки «Label», фильтрация там не
 * показана, но без неё компонент ничем не отличался бы от статичного
 * Select, а называется он именно «автодополнение».
 *
 * Значение свободное: выбор из списка подставляет его в поле, но текст
 * можно допечатать поверх без соответствия ни одному варианту — это не
 * строгий выбор из списка, а подсказки.
 *
 * Открыта карточка, пока поле в фокусе и есть хотя бы один подходящий
 * вариант. Клавиатура: стрелки перемещают подсвеченный вариант, Enter его
 * выбирает, Escape закрывает список. mousedown по карточке гасится, чтобы
 * клик по варианту не обрывал фокус поля раньше, чем сработает выбор.
 */
export function InputAutoComplete({
  options,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  size = 'l',
  disabled,
  ...rest
}: InputAutoCompleteProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const text = value ?? uncontrolledValue;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();

  const filtered = options.filter((option) => option.label.toLowerCase().includes(text.toLowerCase()));
  const showDropdown = open && !disabled && filtered.length > 0;

  const commit = (next: string) => {
    if (value === undefined) setUncontrolledValue(next);
    onChange?.(next);
  };

  const selectOption = (option: InputAutoCompleteOption) => {
    commit(option.label);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    commit(event.target.value);
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setOpen(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setOpen(false);
    setActiveIndex(-1);
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % filtered.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + filtered.length) % filtered.length);
      } else if (event.key === 'Enter' && activeIndex >= 0 && filtered[activeIndex]) {
        event.preventDefault();
        selectOption(filtered[activeIndex]);
      } else if (event.key === 'Escape') {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    onKeyDown?.(event);
  };

  const optionId = (index: number) => `${listboxId}-option-${index}`;

  return (
    <div className={styles.wrapper} data-size={size}>
      <Input
        {...rest}
        size={size}
        disabled={disabled}
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
        value={text}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {showDropdown && (
        <div className={styles.dropdown} onMouseDown={(event) => event.preventDefault()}>
          <OptionList id={listboxId} role="listbox" size={size}>
            {filtered.map((option, index) => (
              <OptionListCell
                key={option.value}
                id={optionId(index)}
                label={option.label}
                selected={option.label === text}
                size={size}
                className={index === activeIndex ? styles.highlighted : undefined}
                onClick={() => selectOption(option)}
              />
            ))}
          </OptionList>
        </div>
      )}
    </div>
  );
}
