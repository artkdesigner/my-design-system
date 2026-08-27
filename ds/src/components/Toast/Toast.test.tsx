import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  it('рисует title и caption', () => {
    render(<Toast title="Title" caption="Caption" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Caption')).toBeInTheDocument();
  });

  it('без caption не рисует его вовсе', () => {
    render(<Toast title="Title" />);
    expect(screen.queryByText('Caption')).not.toBeInTheDocument();
  });

  it('по умолчанию view=neutral', () => {
    const { container } = render(<Toast title="Title" />);
    expect(container.firstElementChild).toHaveAttribute('data-view', 'neutral');
  });

  it('view=alert переносится на корень', () => {
    const { container } = render(<Toast title="Title" view="alert" />);
    expect(container.firstElementChild).toHaveAttribute('data-view', 'alert');
  });

  it('без onButtonClick кнопка не рисуется', () => {
    render(<Toast title="Title" buttonLabel="Button" />);
    expect(screen.queryByRole('button', { name: 'Button' })).not.toBeInTheDocument();
  });

  it('с onButtonClick рисует кнопку и зовёт колбэк по клику', () => {
    const onButtonClick = vi.fn();
    render(<Toast title="Title" buttonLabel="Button" onButtonClick={onButtonClick} />);
    screen.getByRole('button', { name: 'Button' }).click();
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  it('без onClose крестик закрытия не рисуется', () => {
    render(<Toast title="Title" />);
    expect(screen.queryByRole('button', { name: 'Закрыть уведомление' })).not.toBeInTheDocument();
  });

  it('с onClose рисует крестик и зовёт колбэк по клику', () => {
    const onClose = vi.fn();
    render(<Toast title="Title" onClose={onClose} />);
    screen.getByRole('button', { name: 'Закрыть уведомление' }).click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('переносит role=status для доступности', () => {
    const { container } = render(<Toast title="Title" />);
    expect(container.firstElementChild).toHaveAttribute('role', 'status');
  });
});
