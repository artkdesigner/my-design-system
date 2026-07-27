import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioItem } from './RadioItem';

describe('RadioItem', () => {
  it('рисует элемент с ролью radio, а не обычную кнопку', () => {
    render(<RadioItem aria-label="Вариант" />);
    expect(screen.getByRole('radio', { name: 'Вариант' })).toBeInTheDocument();
  });

  it('по умолчанию не выбран и берёт размер l', () => {
    render(<RadioItem aria-label="Вариант" />);
    const item = screen.getByRole('radio');
    expect(item).toHaveAttribute('aria-checked', 'false');
    expect(item.dataset.size).toBe('l');
  });

  it('переносит размер в data-атрибут', () => {
    render(<RadioItem aria-label="Вариант" size="s" />);
    expect(screen.getByRole('radio').dataset.size).toBe('s');
  });

  it('выбранное состояние даёт aria-checked=true и рисует точку', () => {
    const { container } = render(<RadioItem aria-label="Вариант" selected />);
    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'true');
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('невыбранное состояние точку не рисует', () => {
    const { container } = render(<RadioItem aria-label="Вариант" selected={false} />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('несёт класс ds-interactive', () => {
    render(<RadioItem aria-label="Вариант" />);
    expect(screen.getByRole('radio')).toHaveClass('ds-interactive');
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<RadioItem aria-label="Вариант" onClick={onClick} />);
    await userEvent.click(screen.getByRole('radio'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('не вызывает обработчик, когда недоступен', async () => {
    const onClick = vi.fn();
    render(<RadioItem aria-label="Вариант" onClick={onClick} disabled />);
    await userEvent.click(screen.getByRole('radio'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('сам ничего не переключает — состояние приходит снаружи', async () => {
    render(<RadioItem aria-label="Вариант" selected={false} onClick={() => {}} />);
    await userEvent.click(screen.getByRole('radio'));
    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'false');
  });

  it('пропускает наружу произвольные атрибуты кнопки', () => {
    render(<RadioItem aria-label="Вариант" data-testid="my-radio" />);
    expect(screen.getByTestId('my-radio')).toBeInTheDocument();
  });
});
