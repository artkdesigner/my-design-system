import type { HTMLAttributes, ReactNode } from 'react';
import { AccordionControl } from '../AccordionControl';
import { AccordionTitle } from '../AccordionTitle';
import { AccordionBody } from '../AccordionBody';
import styles from './Accordion.module.css';

type AccordionOwnProps = {
  title: ReactNode;
  children: ReactNode;
  /** Полностью управляемый компонент, как Slider/NumberInput: opened
   * приходит снаружи, сам себя не переключает. */
  opened: boolean;
  onOpenedChange?: (opened: boolean) => void;
  /** Соответствует Control side=Left/Right в Figma (узел 213:753). */
  controlSide?: 'left' | 'right';
  controlPreset?: 'downChevron' | 'rightChevron';
};

export type AccordionProps = AccordionOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof AccordionOwnProps>;

/**
 * Аккордеон. Узел 213:753 в Figma (варианты Opened=No/Yes, Control
 * side=Left/Right), сверен через MCP-мост: собран из AccordionControl +
 * AccordionTitle + AccordionBody — те же части экспортируются отдельно
 * для случаев, когда нужен полностью свой заголовок (иконка, бейдж и
 * т.п.), собранный из примитивов напрямую, а не через готовый Accordion.
 *
 * Реальный образец в макете (узел 213:3796) использует у Title/Body не
 * Preset=Custom, а Preset=Title/Text — встроенное начертание (Heading S /
 * Body M), а не произвольный неоформленный слот. Поэтому здесь title и
 * children прокидываются как titleText/text (оба типизированы как
 * ReactNode, не только строка) — обычный текст получает типографику сам,
 * без ручной стилизации со стороны вызывающего кода.
 *
 * Заголовок целиком — button (не только стрелка): весь ряд кликабелен,
 * как и положено дисклоужеру; role/семантику даёт нативный button +
 * aria-expanded, а не кастомный role="button".
 */
export function Accordion({
  title,
  children,
  opened,
  onOpenedChange,
  controlSide = 'left',
  controlPreset = 'downChevron',
  className,
  ...rest
}: AccordionProps) {
  const control = <AccordionControl preset={controlPreset} open={opened} />;

  return (
    <div {...rest} data-control-side={controlSide} className={[styles.accordion, className].filter(Boolean).join(' ')}>
      <button
        type="button"
        aria-expanded={opened}
        className={[styles.header, 'ds-interactive'].join(' ')}
        onClick={() => onOpenedChange?.(!opened)}
      >
        {controlSide === 'left' && control}
        <AccordionTitle className={styles.title} preset="title" titleText={title} />
        {controlSide === 'right' && control}
      </button>
      {opened && <AccordionBody className={styles.body} preset="text" text={children} />}
    </div>
  );
}
