import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SwitchItem } from './SwitchItem';

describe('SwitchItem', () => {
  it('рисует элемент с ролью switch', () => {
    render(<SwitchItem aria-label="Уведомления" />);
    expect(screen.getByRole('switch', { name: 'Уведомления' })).toBeInTheDocument();
  });

  it('по умолчанию выключен и берёт размер l', () => {
    render(<SwitchItem aria-label="Уведомления" />);
    const item = screen.getByRole('switch');
    expect(item).toHaveAttribute('aria-checked', 'false');
    expect(item.dataset.size).toBe('l');
  });

  it('переносит размер в data-атрибут', () => {
    render(<SwitchItem aria-label="Уведомления" size="s" />);
    expect(screen.getByRole('switch').dataset.size).toBe('s');
  });

  it('включённое состояние даёт aria-checked=true и data-checked', () => {
    render(<SwitchItem aria-label="Уведомления" checked />);
    const item = screen.getByRole('switch');
    expect(item).toHaveAttribute('aria-checked', 'true');
    expect(item).toHaveAttribute('data-checked');
  });

  it('в выключенном состоянии не ставит data-checked', () => {
    render(<SwitchItem aria-label="Уведомления" checked={false} />);
    expect(screen.getByRole('switch')).not.toHaveAttribute('data-checked');
  });

  it('несёт класс ds-interactive', () => {
    render(<SwitchItem aria-label="Уведомления" />);
    expect(screen.getByRole('switch')).toHaveClass('ds-interactive');
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<SwitchItem aria-label="Уведомления" onClick={onClick} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('не вызывает обработчик, когда недоступен', async () => {
    const onClick = vi.fn();
    render(<SwitchItem aria-label="Уведомления" onClick={onClick} disabled />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('сам ничего не переключает — состояние приходит снаружи', async () => {
    const onClick = vi.fn();
    render(<SwitchItem aria-label="Уведомления" checked={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });
});
