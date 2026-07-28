import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptionListHeader } from './OptionListHeader';

describe('OptionListHeader', () => {
  it('по умолчанию (без preset) рисует поле поиска', () => {
    render(<OptionListHeader />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('рисует поле поиска с подписью "Поиск" по умолчанию', () => {
    render(<OptionListHeader />);
    expect(screen.getByLabelText('Поиск')).toBeInTheDocument();
  });

  it('переносит переданный label', () => {
    render(<OptionListHeader label="Найти город" />);
    expect(screen.getByLabelText('Найти город')).toBeInTheDocument();
  });

  it('переносит проп value на инпут', () => {
    render(<OptionListHeader value="Москва" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('Москва');
  });

  it('переносит size на обёртку', () => {
    const { container } = render(<OptionListHeader size="s" />);
    expect(container.firstChild).toHaveAttribute('data-size', 's');
  });

  it('preset selectAll рисует чекбокс с подписью "Выбрать всё" по умолчанию', () => {
    render(<OptionListHeader preset="selectAll" />);
    expect(screen.getByRole('checkbox', { name: 'Выбрать всё' })).toBeInTheDocument();
  });

  it('preset selectAll переносит переданный label', () => {
    render(<OptionListHeader preset="selectAll" label="Отметить все опции" />);
    expect(screen.getByRole('checkbox', { name: 'Отметить все опции' })).toBeInTheDocument();
  });

  it('preset selectAll переносит state и вызывает onClick', async () => {
    const onClick = vi.fn();
    render(<OptionListHeader preset="selectAll" state="checked" onClick={onClick} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(checkbox);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
