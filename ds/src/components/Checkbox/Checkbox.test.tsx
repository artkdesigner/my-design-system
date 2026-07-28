import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('рисует чекбокс с ролью checkbox и подписью через label/htmlFor', () => {
    render(<Checkbox label="Согласие на обработку данных" />);
    expect(screen.getByRole('checkbox', { name: 'Согласие на обработку данных' })).toBeInTheDocument();
  });

  it('рисует подсказку под подписью', () => {
    render(<Checkbox label="Согласие" hint="Можно отозвать в любой момент" />);
    expect(screen.getByText('Можно отозвать в любой момент')).toBeInTheDocument();
  });

  it('клик по подписи переключает чекбокс так же, как клик по квадрату', async () => {
    const onClick = vi.fn();
    render(<Checkbox label="Согласие" onClick={onClick} />);
    await userEvent.click(screen.getByText('Согласие'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('переносит size на квадрат и на обёртку', () => {
    render(<Checkbox label="Согласие" size="s" />);
    expect(screen.getByRole('checkbox').dataset.size).toBe('s');
  });

  it('переносит state на квадрат', () => {
    render(<Checkbox label="Согласие" state="checked" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('недоступное состояние отключает и квадрат, и клик по подписи', async () => {
    const onClick = vi.fn();
    render(<Checkbox label="Согласие" disabled onClick={onClick} />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
    await userEvent.click(screen.getByText('Согласие'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('не рисует блок подписи вовсе, если нет ни label, ни hint', () => {
    const { container } = render(<Checkbox aria-label="Согласие" />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('использует переданный id, а не генерирует свой', () => {
    render(<Checkbox label="Согласие" id="consent" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'consent');
  });
});
