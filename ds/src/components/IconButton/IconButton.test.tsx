import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('рисует настоящую кнопку, а не div', () => {
    render(<IconButton icon={<svg />} aria-label="Закрыть" />);
    expect(screen.getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
  });

  it('по умолчанию берёт вид accent и размер l', () => {
    render(<IconButton icon={<svg />} aria-label="Закрыть" />);
    const button = screen.getByRole('button');
    expect(button.dataset.view).toBe('accent');
    expect(button.dataset.size).toBe('l');
  });

  it('переносит размер в data-атрибут', () => {
    render(<IconButton icon={<svg />} aria-label="Закрыть" size="s" />);
    expect(screen.getByRole('button').dataset.size).toBe('s');
  });

  it('несёт класс ds-interactive', () => {
    render(<IconButton icon={<svg />} aria-label="Закрыть" />);
    expect(screen.getByRole('button')).toHaveClass('ds-interactive');
  });

  it('включает режим уведомления error у вида alert', () => {
    // element_icon_alert без data-alert остаётся info (см. состав токенов
    // в state.css): без атрибута alert был бы синим, а не красным.
    render(<IconButton icon={<svg />} aria-label="Удалить" view="alert" />);
    expect(screen.getByRole('button').dataset.alert).toBe('error');
  });

  it('у остальных видов режим сообщения не включает', () => {
    render(<IconButton icon={<svg />} aria-label="Ок" view="primary" />);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-alert');
  });

  it('показывает переданную иконку', () => {
    render(<IconButton icon={<svg data-testid="icon" />} aria-label="Закрыть" />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('прячет иконку от скринридера — доступное имя у самой кнопки', () => {
    const { container } = render(<IconButton icon={<svg />} aria-label="Закрыть" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<IconButton icon={<svg />} aria-label="Закрыть" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('не вызывает обработчик, когда недоступна', async () => {
    const onClick = vi.fn();
    render(<IconButton icon={<svg />} aria-label="Закрыть" onClick={onClick} disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('пропускает наружу произвольные атрибуты кнопки', () => {
    render(<IconButton icon={<svg />} aria-label="Отправить" type="submit" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
