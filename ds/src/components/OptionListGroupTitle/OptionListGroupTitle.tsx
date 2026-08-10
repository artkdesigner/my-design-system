import type { HTMLAttributes, ReactNode } from 'react';
import styles from './OptionListGroupTitle.module.css';

type OptionListGroupTitleOwnProps = {
  title: ReactNode;
  size?: 'l' | 'm' | 's';
};

export type OptionListGroupTitleProps = OptionListGroupTitleOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof OptionListGroupTitleOwnProps>;

/**
 * Заголовок группы опций. Узел 120:9178 в Figma, сверен через MCP-мост:
 * необязательная подпись над частью OptionListCell, когда список опций
 * разбит на смысловые группы (подтверждено дизайнером). Компонент сам
 * ничего не знает про группировку — просто заголовок текстом, вызывающий
 * код ставит его перед нужными Cell внутри OptionList, как и остальные
 * части (Header/Cell/Footer) собираются через children.
 */
export function OptionListGroupTitle({ title, size = 'l', className, ...rest }: OptionListGroupTitleProps) {
  return (
    <div {...rest} data-size={size} className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <p className={styles.title}>{title}</p>
    </div>
  );
}
