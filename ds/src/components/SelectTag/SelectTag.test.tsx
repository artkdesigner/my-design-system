import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectTag } from './SelectTag';

describe('SelectTag', () => {
  it('рисует настоящую кнопку с подписью', () => {
    render(<SelectTag label="Aurum" />);
    expect(screen.getByRole('button', { name: 'Aurum' })).toBeInTheDocument();
  });

  it('всегда несёт data-on-accent — выбор здесь не переключается', () => {
    render(<SelectTag label="Aurum" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-on-accent', 'true');
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<SelectTag label="Aurum" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disabled прячет крестик закрытия', () => {
    const { rerender } = render(<SelectTag label="Aurum" />);
    expect(document.querySelector('svg')).toBeInTheDocument();
    rerender(<SelectTag label="Aurum" disabled />);
    expect(document.querySelector('svg')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('несёт класс ds-interactive и переносит size', () => {
    render(<SelectTag label="Aurum" size="s" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ds-interactive');
    expect(button).toHaveAttribute('data-size', 's');
  });
});
