import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionButton } from './ActionButton';

describe('ActionButton', () => {
  it('рисует настоящую кнопку, а не div', () => {
    render(<ActionButton icon={<svg />}>Отправить</ActionButton>);
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeInTheDocument();
  });

  it('по умолчанию берёт вид accent и размер l', () => {
    render(<ActionButton icon={<svg />}>Метка</ActionButton>);
    const button = screen.getByRole('button');
    expect(button.dataset.view).toBe('accent');
    expect(button.dataset.size).toBe('l');
  });

  it('несёт класс ds-interactive', () => {
    render(<ActionButton icon={<svg />}>Метка</ActionButton>);
    expect(screen.getByRole('button')).toHaveClass('ds-interactive');
  });

  it('переносит ghost в data-атрибут кнопки', () => {
    render(
      <ActionButton icon={<svg />} ghost>
        Метка
      </ActionButton>
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-ghost', 'true');
  });

  it('без ghost атрибут data-ghost не ставит', () => {
    render(<ActionButton icon={<svg />}>Метка</ActionButton>);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-ghost');
  });

  it('ставит тон сообщения на саму кнопку', () => {
    render(
      <ActionButton icon={<svg />} message="error">
        Удалить
      </ActionButton>
    );
    expect(screen.getByRole('button').dataset.message).toBe('error');
  });

  it('показывает иконку и подпись', () => {
    render(
      <ActionButton icon={<svg data-testid="icon" />}>Метка</ActionButton>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Метка')).toBeInTheDocument();
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(
      <ActionButton icon={<svg />} onClick={onClick}>
        Жми
      </ActionButton>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('не вызывает обработчик, когда недоступна', async () => {
    const onClick = vi.fn();
    render(
      <ActionButton icon={<svg />} onClick={onClick} disabled>
        Жми
      </ActionButton>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('пропускает наружу произвольные атрибуты кнопки', () => {
    render(
      <ActionButton icon={<svg />} type="submit">
        Отправить
      </ActionButton>
    );
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
