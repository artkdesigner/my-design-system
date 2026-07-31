import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Notification } from './Notification';

describe('Notification', () => {
  it('рисует title и caption', () => {
    render(<Notification title="Title" caption="Caption" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Caption')).toBeInTheDocument();
  });

  it('без caption не рисует его вовсе', () => {
    render(<Notification title="Title" />);
    expect(screen.queryByText('Caption')).not.toBeInTheDocument();
  });

  it('showBadge=false скрывает StatusBadge', () => {
    const { container } = render(<Notification title="Title" showBadge={false} />);
    expect(container.querySelector('[data-message], [data-tone]')).not.toBeInTheDocument();
  });

  it('без onButtonClick кнопка не рисуется', () => {
    render(<Notification title="Title" buttonLabel="Button" />);
    expect(screen.queryByRole('button', { name: 'Button' })).not.toBeInTheDocument();
  });

  it('с onButtonClick рисует кнопку и зовёт колбэк по клику', () => {
    const onButtonClick = vi.fn();
    render(<Notification title="Title" buttonLabel="Button" onButtonClick={onButtonClick} />);
    screen.getByRole('button', { name: 'Button' }).click();
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  it('без onClose крестик закрытия не рисуется', () => {
    render(<Notification title="Title" />);
    expect(screen.queryByRole('button', { name: 'Закрыть уведомление' })).not.toBeInTheDocument();
  });

  it('с onClose рисует крестик и зовёт колбэк по клику', () => {
    const onClose = vi.fn();
    render(<Notification title="Title" onClose={onClose} />);
    screen.getByRole('button', { name: 'Закрыть уведомление' }).click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('переносит role=status для доступности', () => {
    const { container } = render(<Notification title="Title" />);
    expect(container.firstElementChild).toHaveAttribute('role', 'status');
  });
});
