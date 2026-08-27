import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Addon } from '../Addon';
import styles from './IconButton.module.css';

type IconButtonOwnProps = {
  /** Вид. Соответствует свойству View в Figma (узел 124:2304). */
  view?: 'accent' | 'primary' | 'secondary' | 'alert';
  /** Размер. Соответствует режимам коллекции ComponentSize. */
  size?: 'l' | 'm' | 's';
  /**
   * Содержимое слота Addon. Только декоративное: Icon, Checkmark, Spinner,
   * Indicator, StatusBadge. IconButton и Text сюда не кладутся — тот же
   * запрет, что и у Button: слот всегда aria-hidden, значит Text пропадёт
   * для скринридера, а вложенный IconButton — интерактивная кнопка внутри
   * кнопки, невалидный HTML и вдобавок недоступный элемент под aria-hidden.
   */
  icon: ReactNode;
};

export type IconButtonProps = IconButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof IconButtonOwnProps>;

/**
 * Голая иконка-кнопка: ни заливки, ни рамки — только сама иконка своего
 * цвета по виду, кликабельная и фокусируемая (сверено скриншотом по узлу
 * 124:2304, у всех четырёх видов нет видимого фона). У кнопки нет подписи
 * вообще, поэтому доступное имя обязан задать вызывающий код через
 * aria-label или aria-labelledby — так же, как у Button в режиме
 * «только иконка».
 *
 * Значение view «alert» (в Figma называется «message», переименовано в коде
 * вслед за проп alert у Button/ActionButton для единообразия) — не то же
 * самое, что проп alert у Button: там это отдельный флаг с выбором тона
 * (info/success/warning/error), здесь — одно из четырёх значений view,
 * в Figma единственная опция, не выбор из четырёх тонов. Внутри оно всё
 * равно включает режим AlertType (data-alert ставится в error),
 * потому что element_icon_alert — производный токен: без data-alert он
 * тихо остаётся синим (info по умолчанию), а под наведением/нажатием/
 * недоступностью нужны именно составные селекторы вида
 * .ds-interactive:hover[data-alert="error"] — без атрибута на самом
 * элементе цвет на этих состояниях съезжает обратно в info, тот же эффект,
 * что разобран в Button.
 */
export function IconButton({
  view = 'accent',
  size = 'l',
  icon,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={[styles.button, 'ds-interactive', className].filter(Boolean).join(' ')}
      data-view={view}
      data-size={size}
      data-alert={view === 'alert' ? 'error' : undefined}
    >
      <Addon size={size} aria-hidden="true">
        {icon}
      </Addon>
    </button>
  );
}
