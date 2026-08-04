import {
  useId,
  useState,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode
} from 'react';
import { Addon } from '../Addon';
import { Icon } from '../Icon';
import { OptionList } from '../OptionList';
import styles from './FilterTag.module.css';

type FilterTagOwnProps = {
  /** Декоративная иконка слева. Соответствует булеву leftAddon в Figma —
   * в коде слот, а не флаг, тот же приём, что у iconLeft в Button. */
  icon?: ReactNode;
  /** Имя фильтра. При single видно только до заполнения (заменяется на
   * value); при !single остаётся рядом со значением («Label: Value»). */
  label?: ReactNode;
  /** Выбранное значение. Наличие — и есть Filled в терминах Figma: явного
   * булева пропа нет, тот же приём вывода варианта из содержимого, что
   * у caption в Toast. */
  value?: ReactNode;
  /** Без выпадающего списка — просто кнопка-переключатель без шеврона
   * и carточки (узлы 165:6339/165:6349 в Figma). Открытием тогда
   * распоряжается вызывающий код через свой onClick, как у обычной
   * кнопки — сам компонент никакого попапа не показывает. */
  single?: boolean;
  /** Кнопка-крестик очистки значения. Показывается только при заполненном
   * value — как onClose у Toast, слот по наличию колбэка, а не флаг. */
  onClear?: () => void;
  clearLabel?: string;
  /** Содержимое выпадающей карточки — как у OptionList/PickerButton,
   * действует только когда !single. */
  children?: ReactNode;
  size?: 'l' | 'm' | 's';
  /** Открыта ли карточка изначально — не из Figma, тот же приём, что у
   * PickerButton: для историй Storybook и подобных случаев, открытие
   * всё равно неуправляемое. */
  defaultOpen?: boolean;
};

export type FilterTagProps = FilterTagOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof FilterTagOwnProps>;

/**
 * Тег-фильтр. Узел 162:4019 в Figma, сверен через MCP-мост: заливка и цвет
 * текста/иконок переключаются вместе через data-on-accent по наличию
 * value — тот же переключатель, что у Button/StatusBadge/Notification на
 * залитых видах, а не два отдельных набора цветов вручную.
 *
 * В режиме !single раскрытие карточки внутри компонента, как у
 * PickerButton (тот же приём гашения клика mousedown/preventDefault на
 * карточке) — есть единая точка входа в открытие/закрытие, наружу поднимать
 * нечего. В режиме single компонент вообще не занимается попапом: клик по
 * кнопке — обычный onClick вызывающего кода, потому что там и заголовка
 * дропдауна в макете нет, только переключатель с очисткой.
 */
export function FilterTag({
  icon,
  label,
  value,
  single = false,
  onClear,
  clearLabel = 'Очистить',
  children,
  size = 'l',
  defaultOpen = false,
  id,
  disabled,
  onClick,
  onBlur,
  onKeyDown,
  className,
  ...rest
}: FilterTagProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const dropdownId = `${triggerId}-dropdown`;
  const [open, setOpen] = useState(defaultOpen);

  const filled = value !== undefined && value !== null && value !== false;
  const hasClear = filled && Boolean(onClear);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !single) setOpen((prev) => !prev);
    onClick?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
    if (!single) setOpen(false);
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!single && !disabled && open && event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
    onKeyDown?.(event);
  };

  return (
    <div
      className={[styles.tag, className].filter(Boolean).join(' ')}
      data-size={size}
      data-on-accent={filled || undefined}
      data-has-clear={hasClear || undefined}
    >
      <button
        {...rest}
        id={triggerId}
        type="button"
        disabled={disabled}
        className={styles.trigger}
        aria-haspopup={single ? undefined : 'true'}
        aria-expanded={single ? undefined : open}
        aria-controls={single ? undefined : dropdownId}
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {icon && (
          <Addon size={size} className={styles.addon} aria-hidden="true">
            {icon}
          </Addon>
        )}
        <span className={styles.text}>
          {single ? (
            filled ? (
              <span className={styles.value}>{value}</span>
            ) : (
              <span>{label}</span>
            )
          ) : filled ? (
            <>
              <span>{label}:</span>
              <span className={styles.value}>{value}</span>
            </>
          ) : (
            <span>{label}</span>
          )}
        </span>
        {!single && (
          <Addon size={size} className={styles.addon} aria-hidden="true">
            <Icon name={open ? 'chevron-up' : 'chevron-down'} size={size} />
          </Addon>
        )}
      </button>

      {hasClear && (
        <span className={styles.clearSlot}>
          <span className={styles.divider} aria-hidden="true" />
          <button
            type="button"
            disabled={disabled}
            aria-label={clearLabel}
            className={styles.clear}
            onClick={onClear}
          >
            <Icon name="x-circle-filled" size={size} />
          </button>
        </span>
      )}

      {!single && open && (
        <div id={dropdownId} className={styles.dropdown} onMouseDown={(event) => event.preventDefault()}>
          <OptionList size={size}>{children}</OptionList>
        </div>
      )}
    </div>
  );
}
