import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptionListCell } from './OptionListCell';

describe('OptionListCell', () => {
  it('рисует пункт с ролью option и подписью', () => {
    render(<OptionListCell label="Опция" />);
    expect(screen.getByRole('option', { name: 'Опция' })).toBeInTheDocument();
  });

  it('по умолчанию не выбран', () => {
    render(<OptionListCell label="Опция" />);
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'false');
  });

  it('переносит selected в aria-selected', () => {
    render(<OptionListCell label="Опция" selected />);
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'true');
  });

  it('прячет галочку от скринридера', () => {
    const { container } = render(<OptionListCell label="Опция" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('переносит size на корневой элемент', () => {
    render(<OptionListCell label="Опция" size="s" />);
    expect(screen.getByRole('option')).toHaveAttribute('data-size', 's');
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<OptionListCell label="Опция" onClick={onClick} />);
    await userEvent.click(screen.getByRole('option'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('несёт класс ds-interactive', () => {
    render(<OptionListCell label="Опция" />);
    expect(screen.getByRole('option')).toHaveClass('ds-interactive');
  });
});
