import { useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button';
import { TextButton } from '../TextButton';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import { Scrollbar } from '../Scrollbar';
import styles from './Modal.module.css';

type ModalAction = {
  label: ReactNode;
  onClick: () => void;
};

type ModalOwnProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** Ссылка «Назад» в шапке. Соответствует свойству Back в Figma — в коде
   * это слот по наличию колбэка, а не отдельный флаг (тот же приём, что
   * onButtonClick/onClose у Notification/Toast). */
  onBack?: () => void;
  backLabel?: ReactNode;
  closeLabel?: string;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  /**
   * Раскладка кнопок футера. Три реальных состояния макета (узел 179:5867:
   * Vertical × FullWidthButtons) — четвёртая комбинация (Vertical=true,
   * FullWidthButtons=false) в дизайне не существует, поэтому это один проп
   * с тремя значениями, а не два независимых булевых флага, которые
   * позволили бы собрать несуществующую в дизайне раскладку (тот же приём,
   * что у state в CheckboxItem).
   */
  actionsLayout?: 'horizontal' | 'horizontalFull' | 'vertical';
  /** Произвольное содержимое футера вместо пары кнопок — узел 179:6211,
   * вариант Content=Custom. Приоритетнее primaryAction/secondaryAction. */
  footer?: ReactNode;
  children?: ReactNode;
};

export type ModalProps = ModalOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof ModalOwnProps | 'title'>;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Модальный диалог. Узел 179:842 в Figma, сверен через MCP-мост: шапка
 * (назад + заголовок + крестик), скроллируемое тело (переиспользует готовый
 * Scrollbar, а не рисует бегунок вручную — узел 179:6638 уже разобран там)
 * и футер (пара кнопок, произвольный контент или пустой отступ).
 *
 * Единственный компонент дизайн-системы с побочными эффектами — реальный
 * диалог не может быть чистой вёрсткой, как остальные компоненты: без
 * portal он был бы обрезан overflow/z-index предков, без Escape и цикла
 * Tab внутри диалога — недоступен с клавиатуры (нарушает базовый паттерн
 * ARIA dialog). Тем не менее open/onClose снаружи — состояние открытости
 * по-прежнему не хранится внутри, та же философия управляемых компонентов,
 * что у всей остальной системы.
 *
 * Фокус: при открытии уходит на сам диалог и запоминает, что было
 * сфокусировано раньше; при закрытии фокус возвращается туда. Tab внутри
 * диалога закольцован на первый/последний фокусируемый элемент — вместе
 * с aria-modal="true" это и есть ловушка фокуса, без которой Tab увёл бы
 * пользователя на страницу под оверлеем.
 */
export function Modal({
  open,
  onClose,
  title,
  onBack,
  backLabel = 'Назад',
  closeLabel = 'Закрыть',
  primaryAction,
  secondaryAction,
  actionsLayout = 'horizontal',
  footer,
  children,
  className,
  ...rest
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const hasFooter = footer !== undefined || Boolean(primaryAction) || Boolean(secondaryAction);

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        {...rest}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={[styles.dialog, className].filter(Boolean).join(' ')}
      >
        <div className={styles.header}>
          <div className={styles.top}>
            {onBack && (
              <TextButton view="primary" addonLeft={<Icon name="arrow-curve-left-up" />} onClick={onBack}>
                {backLabel}
              </TextButton>
            )}
            <span className={styles.spacer} />
            <span className={styles.closeSlot}>
              <IconButton view="primary" icon={<Icon name="x-01" />} aria-label={closeLabel} onClick={onClose} />
            </span>
          </div>
          {title && (
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          )}
        </div>

        <Scrollbar className={styles.body}>{children}</Scrollbar>

        {hasFooter ? (
          <div className={styles.footer}>
            {footer ?? (
              <div className={styles.actions} data-layout={actionsLayout}>
                {primaryAction && (
                  <Button view="accent" onClick={primaryAction.onClick}>
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button view="primary" onClick={secondaryAction.onClick}>
                    {secondaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.footerSpacer} />
        )}
      </div>
    </div>,
    document.body
  );
}
