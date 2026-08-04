import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('ничего не рисует, когда open=false', () => {
    render(
      <Modal open={false} onClose={() => {}}>
        Контент
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('рисует диалог с aria-modal и aria-labelledby на заголовок', () => {
    render(
      <Modal open onClose={() => {}} title="Заголовок">
        Контент
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const titleId = dialog.getAttribute('aria-labelledby');
    expect(document.getElementById(titleId!)).toHaveTextContent('Заголовок');
  });

  it('без title не ставит aria-labelledby', () => {
    render(
      <Modal open onClose={() => {}}>
        Контент
      </Modal>
    );
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
  });

  it('рисует переданный контент тела', () => {
    render(
      <Modal open onClose={() => {}}>
        Контент диалога
      </Modal>
    );
    expect(screen.getByText('Контент диалога')).toBeInTheDocument();
  });

  it('крестик закрытия зовёт onClose', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        Контент
      </Modal>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('клик по фону оверлея зовёт onClose', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        Контент
      </Modal>
    );
    await userEvent.click(screen.getByRole('dialog').parentElement!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('клик внутри диалога не зовёт onClose', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        Контент диалога
      </Modal>
    );
    await userEvent.click(screen.getByText('Контент диалога'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Escape зовёт onClose', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        Контент
      </Modal>
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('без onBack не рисует ссылку назад', () => {
    render(
      <Modal open onClose={() => {}}>
        Контент
      </Modal>
    );
    expect(screen.queryByRole('button', { name: 'Назад' })).not.toBeInTheDocument();
  });

  it('с onBack рисует ссылку назад и зовёт колбэк по клику', async () => {
    const onBack = vi.fn();
    render(
      <Modal open onClose={() => {}} onBack={onBack}>
        Контент
      </Modal>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Назад' }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('без primaryAction/secondaryAction/footer не рисует кнопок футера', () => {
    render(
      <Modal open onClose={() => {}}>
        Контент
      </Modal>
    );
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('primaryAction и secondaryAction рисуют кнопки и зовут свои колбэки', async () => {
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();
    render(
      <Modal
        open
        onClose={() => {}}
        primaryAction={{ label: 'Сохранить', onClick: onPrimary }}
        secondaryAction={{ label: 'Отмена', onClick: onSecondary }}
      >
        Контент
      </Modal>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
    await userEvent.click(screen.getByRole('button', { name: 'Отмена' }));
    expect(onPrimary).toHaveBeenCalledOnce();
    expect(onSecondary).toHaveBeenCalledOnce();
  });

  it('footer перебивает primaryAction/secondaryAction', () => {
    render(
      <Modal
        open
        onClose={() => {}}
        primaryAction={{ label: 'Сохранить', onClick: () => {} }}
        footer={<span>Свой футер</span>}
      >
        Контент
      </Modal>
    );
    expect(screen.getByText('Свой футер')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Сохранить' })).not.toBeInTheDocument();
  });

  it('при открытии переносит фокус в диалог', () => {
    render(
      <Modal open onClose={() => {}}>
        Контент
      </Modal>
    );
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('Tab на последнем фокусируемом элементе зацикливается на первый', async () => {
    render(
      <Modal
        open
        onClose={() => {}}
        primaryAction={{ label: 'Сохранить', onClick: () => {} }}
      >
        Контент
      </Modal>
    );
    const close = screen.getByRole('button', { name: 'Закрыть' });
    const save = screen.getByRole('button', { name: 'Сохранить' });
    save.focus();
    await userEvent.tab();
    expect(close).toHaveFocus();
  });

  it('Shift+Tab на первом фокусируемом элементе зацикливается на последний', async () => {
    render(
      <Modal
        open
        onClose={() => {}}
        primaryAction={{ label: 'Сохранить', onClick: () => {} }}
      >
        Контент
      </Modal>
    );
    const close = screen.getByRole('button', { name: 'Закрыть' });
    const save = screen.getByRole('button', { name: 'Сохранить' });
    close.focus();
    await userEvent.tab({ shift: true });
    expect(save).toHaveFocus();
  });

  it('при закрытии возвращает фокус на элемент, открывший диалог', async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Открыть</button>
          <Modal open={open} onClose={() => setOpen(false)}>
            Контент
          </Modal>
        </>
      );
    }
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Открыть' });
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(trigger).toHaveFocus();
  });
});
