import type { HTMLAttributes } from 'react';
import styles from './TabGroup.module.css';

type TabGroupOwnProps = {
  size?: 'l' | 'm' | 's';
};

export type TabGroupProps = TabGroupOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof TabGroupOwnProps>;

/**
 * Группа вкладок. Узел 205:5845 в Figma, сверен через MCP-мост: как
 * SegmentedControl — только раскладка, role="tablist" и сквозная нижняя
 * линия на всю ширину. Выбранную вкладку не хранит и не клонирует детей:
 * вызывающий код сам рисует Tab с нужными active/onClick, та же философия
 * полностью управляемых компонентов, что у RadioGroup/SegmentedControl.
 */
export function TabGroup({ size = 'l', className, children, ...rest }: TabGroupProps) {
  return (
    <div {...rest} role="tablist" data-size={size} className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
