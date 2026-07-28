import type { ReactNode } from 'react';
import { Input, type InputProps } from '../Input';
import { Checkbox, type CheckboxProps } from '../Checkbox';
import { Icon } from '../Icon';
import styles from './OptionListHeader.module.css';

type OptionListHeaderSize = 'l' | 'm' | 's';

type OptionListHeaderSearchProps = { preset?: 'search'; size?: OptionListHeaderSize } & Omit<
  InputProps,
  'leftAddon' | 'size'
>;

type OptionListHeaderSelectAllProps = { preset: 'selectAll'; size?: OptionListHeaderSize; label?: ReactNode } & Omit<
  CheckboxProps,
  'size' | 'label'
>;

export type OptionListHeaderProps = OptionListHeaderSearchProps | OptionListHeaderSelectAllProps;

/**
 * Заголовок списка опций. Узел 120:4170 в Figma, сверен через MCP-мост:
 * два preset, а не один — Search (120:4173, было построено раньше) и
 * SelectAll (120:4175): чекбокс «Выбрать всё» поверх готового Checkbox,
 * не свой квадрат и текст. Проп size один на весь заголовок — и на отступы
 * обёртки (--optionlist-header-padding-*), и на вложенный Input/Checkbox,
 * в макете оба масштабируются одним режимом ComponentSize.
 *
 * SelectAll полностью управляемый, как и сам Checkbox: сюда приходят
 * state/onClick снаружи, заголовок не хранит и не решает, что значит
 * «выбрать всё» — это знает только код, у которого есть список ячеек
 * (см. историю OptionList, где чекбокс проставляет selected всем Cell).
 */
export function OptionListHeader(props: OptionListHeaderProps) {
  if (props.preset === 'selectAll') {
    const { preset, size = 'l', label = 'Выбрать всё', className, ...rest } = props;
    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')} data-size={size}>
        <Checkbox {...rest} label={label} size={size} />
      </div>
    );
  }

  const { preset, size = 'l', label = 'Поиск', className, ...rest } = props;
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} data-size={size}>
      <Input {...rest} label={label} size={size} leftAddon={<Icon name="search-01" aria-hidden="true" />} />
    </div>
  );
}
