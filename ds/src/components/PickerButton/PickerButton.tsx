import { useId, useState, type ButtonHTMLAttributes, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { OptionList } from '../OptionList';
import styles from './PickerButton.module.css';

type PickerButtonOwnProps = {
  /** Подпись кнопки. Есть — раскладка Label + шеврон (узел 155:3185/3571);
   * нет — компактный квадрат с фиксированной иконкой dot-vertical
   * (узел 155:2989/3568). Тот же приём вывода варианта из наличия
   * содержимого, что у iconOnly в Button, только здесь единственная
   * доступная иконка для компактного вида зашита в макете, а не
   * произвольный iconLeft. */
  label?: ReactNode;
  /** Доступное имя для компактного вида без подписи — там нет текста,
   * который мог бы стать именем кнопки для скринридера. */
  triggerLabel?: string;
  size?: 'l' | 'm' | 's';
  /** Открыта ли карточка изначально — не из Figma, чисто для истории
   * Storybook и подобных сценариев, где нужно показать открытое состояние
   * без клика; открытие всё равно неуправляемое, как и у Select. */
  defaultOpen?: boolean;
  /** Содержимое выпадающей карточки — как у OptionList, обычно
   * OptionListHeader/OptionListCell/OptionListFooter через children. */
  children?: ReactNode;
};

export type PickerButtonProps = PickerButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof PickerButtonOwnProps>;

/**
 * Кнопка-триггер выпадающей карточки. Узел 155:3184 в Figma, сверен через
 * MCP-мост: Button вида accent (в макете это единственный вид) плюс
 * OptionList, раскрывающийся под ним, — тот же композиционный приём, что
 * уже есть в Select, только контент карточки произвольный (children), а
 * не список value/label — PickerButton не про выбор одного значения,
 * а про раскрытие любого меню (в отличие от Select там и нет отдельной
 * подписи поля/подсказки/ошибки).
 *
 * Открытие полностью внутри компонента (как у Select), не наружу: с
 * произвольным содержимым карточки нет единой точки вроде onChange,
 * которую можно было бы поднять вызывающему коду, а сам факт открытия —
 * внутренняя деталь дисклоужера, не значение, которым управляют снаружи.
 *
 * Тот же приём гашения клика, что у Select: onMouseDown с preventDefault
 * на карточке не даёт клику по её содержимому увести фокус с кнопки
 * раньше, чем сработает clic — при условии, что children ведёт себя как
 * OptionListCell (не является полноценно фокусируемым элементом). Если
 * внутрь кладут реально фокусируемые элементы (ссылки, кнопки), это
 * предположение нарушается — тот же контракт, что уже неявно есть у
 * OptionList/Select.
 */
export function PickerButton({
  label,
  triggerLabel = 'Открыть меню',
  size = 'l',
  defaultOpen = false,
  children,
  id,
  disabled,
  onBlur,
  onKeyDown,
  className,
  ...rest
}: PickerButtonProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const dropdownId = `${triggerId}-dropdown`;
  const [open, setOpen] = useState(defaultOpen);

  const handleClick = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
    setOpen(false);
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!disabled && open && event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
    onKeyDown?.(event);
  };

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} data-size={size}>
      <Button
        {...rest}
        id={triggerId}
        view="accent"
        size={size}
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={dropdownId}
        aria-label={label ? undefined : triggerLabel}
        iconLeft={!label ? <Icon name="dot-vertical" /> : undefined}
        iconRight={label ? <Icon name={open ? 'chevron-up' : 'chevron-down'} /> : undefined}
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {label}
      </Button>
      {open && (
        <div id={dropdownId} className={styles.dropdown} onMouseDown={(event) => event.preventDefault()}>
          <OptionList size={size}>{children}</OptionList>
        </div>
      )}
    </div>
  );
}
