import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxItem } from './CheckboxItem';
import { ICONS } from '../Icon/icons.generated';

describe('CheckboxItem', () => {
  it('рисует элемент с ролью checkbox, а не обычную кнопку', () => {
    render(<CheckboxItem aria-label="Согласие" />);
    expect(screen.getByRole('checkbox', { name: 'Согласие' })).toBeInTheDocument();
  });

  it('по умолчанию не отмечен и берёт размер l', () => {
    render(<CheckboxItem aria-label="Согласие" />);
    const item = screen.getByRole('checkbox');
    expect(item).toHaveAttribute('aria-checked', 'false');
    expect(item.dataset.size).toBe('l');
  });

  it('переносит размер в data-атрибут', () => {
    render(<CheckboxItem aria-label="Согласие" size="s" />);
    expect(screen.getByRole('checkbox').dataset.size).toBe('s');
  });

  it('отмеченное состояние даёт aria-checked=true и рисует check', () => {
    const { container } = render(<CheckboxItem aria-label="Согласие" state="checked" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    expect(container.querySelector('path')).toHaveAttribute('d', ICONS.check.d);
  });

  it('промежуточное состояние даёт aria-checked=mixed и рисует dash', () => {
    const { container } = render(<CheckboxItem aria-label="Согласие" state="indeterminate" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    expect(container.querySelector('path')).toHaveAttribute('d', ICONS.dash.d);
  });

  it('в невыбранном состоянии не рисует иконку вовсе', () => {
    const { container } = render(<CheckboxItem aria-label="Согласие" state="unchecked" />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('несёт класс ds-interactive', () => {
    render(<CheckboxItem aria-label="Согласие" />);
    expect(screen.getByRole('checkbox')).toHaveClass('ds-interactive');
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<CheckboxItem aria-label="Согласие" onClick={onClick} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('не вызывает обработчик, когда недоступен', async () => {
    const onClick = vi.fn();
    render(<CheckboxItem aria-label="Согласие" onClick={onClick} disabled />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('сам ничего не переключает — состояние приходит снаружи', async () => {
    const onClick = vi.fn();
    render(<CheckboxItem aria-label="Согласие" state="unchecked" onClick={onClick} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
  });

  it('пропускает наружу произвольные атрибуты кнопки', () => {
    render(<CheckboxItem aria-label="Согласие" data-testid="my-checkbox" />);
    expect(screen.getByTestId('my-checkbox')).toBeInTheDocument();
  });
});
