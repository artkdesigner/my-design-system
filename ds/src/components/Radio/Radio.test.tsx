import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from './Radio';

describe('Radio', () => {
  it('рисует радио с ролью radio и подписью через label/htmlFor', () => {
    render(<Radio label="Оплата картой" />);
    expect(screen.getByRole('radio', { name: 'Оплата картой' })).toBeInTheDocument();
  });

  it('рисует подсказку под подписью', () => {
    render(<Radio label="Оплата картой" hint="Спишется сразу после подтверждения" />);
    expect(screen.getByText('Спишется сразу после подтверждения')).toBeInTheDocument();
  });

  it('клик по подписи переключает радио так же, как клик по кружку', async () => {
    const onClick = vi.fn();
    render(<Radio label="Оплата картой" onClick={onClick} />);
    await userEvent.click(screen.getByText('Оплата картой'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('переносит size на кружок', () => {
    render(<Radio label="Оплата картой" size="s" />);
    expect(screen.getByRole('radio').dataset.size).toBe('s');
  });

  it('переносит selected на кружок', () => {
    render(<Radio label="Оплата картой" selected />);
    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'true');
  });

  it('недоступное состояние отключает и кружок, и клик по подписи', async () => {
    const onClick = vi.fn();
    render(<Radio label="Оплата картой" disabled onClick={onClick} />);
    expect(screen.getByRole('radio')).toBeDisabled();
    await userEvent.click(screen.getByText('Оплата картой'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('не рисует блок подписи вовсе, если нет ни label, ни hint', () => {
    const { container } = render(<Radio aria-label="Оплата картой" />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('использует переданный id, а не генерирует свой', () => {
    render(<Radio label="Оплата картой" id="pay-card" />);
    expect(screen.getByRole('radio')).toHaveAttribute('id', 'pay-card');
  });
});
