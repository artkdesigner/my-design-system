import type { SVGAttributes } from 'react';
import styles from './Icon.module.css';
import { ICONS, type IconName } from './icons.generated';

type IconOwnProps = {
  name: IconName;
  /** Размер. Соответствует режимам коллекции ComponentSize — тому же
   * `--addon-size`, что уже сидит в Button/ActionButton/TextButton/Input. */
  size?: 'l' | 'm' | 's';
};

export type IconProps = IconOwnProps & Omit<SVGAttributes<SVGSVGElement>, keyof IconOwnProps | 'viewBox'>;

/**
 * Иконка дизайн-системы. Цвет не задаёт сам — берёт currentColor и наследует
 * его от обёртки (как .addon у Button задаёт color, а PlusIcon в сторис живёт
 * на stroke="currentColor"). Так одна и та же иконка красится в любой из
 * element_icon_* токенов через родителя, без пропа color.
 */
export function Icon({ name, size = 'l', className, ...rest }: IconProps) {
  const icon = ICONS[name];

  return (
    <svg
      {...rest}
      data-size={size}
      className={[styles.icon, className].filter(Boolean).join(' ')}
      viewBox={icon.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d={icon.d} fillRule={icon.fillRule} clipRule={icon.fillRule} fill="currentColor" />
    </svg>
  );
}
