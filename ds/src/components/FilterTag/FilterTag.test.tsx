import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterTag } from './FilterTag';
import { OptionListCell } from '../OptionListCell';

describe('FilterTag', () => {
  it('без value рисует только label', () => {
    render(<FilterTag label="Статус" />);
    expect(screen.getByRole('button', { name: 'Статус' })).toBeInTheDocument();
  });

  it('с value в режиме !single рисует «label: value»', () => {
    render(<FilterTag label="Статус" value="Активен" />);
    expect(screen.getByRole('button', { name: 'Статус:Активен' })).toBeInTheDocument();
  });

  it('single без value рисует только label, single с value — только value', () => {
    const { rerender } = render(<FilterTag single label="Статус" />);
    expect(screen.getByRole('button')).toHaveTextContent('Статус');
    rerender(<FilterTag single label="Статус" value="Активен" />);
    expect(screen.getByRole('button')).toHaveTextContent('Активен');
    expect(screen.getByRole('button')).not.toHaveTextContent('Статус');
  });

  it('single не ставит aria-haspopup/aria-expanded', () => {
    render(<FilterTag single label="Статус" />);
    const trigger = screen.getByRole('button', { name: 'Статус' });
    expect(trigger).not.toHaveAttribute('aria-haspopup');
    expect(trigger).not.toHaveAttribute('aria-expanded');
  });

  it('!single несёт aria-haspopup и aria-expanded=false в покое', () => {
    render(<FilterTag label="Статус" />);
    const trigger = screen.getByRole('button', { name: 'Статус' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('single зовёт переданный onClick, не открывает карточку', async () => {
    const onClick = vi.fn();
    render(
      <FilterTag single label="Статус" onClick={onClick}>
        <OptionListCell label="Активен" />
      </FilterTag>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Статус' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByText('Активен')).not.toBeInTheDocument();
  });

  it('!single клик открывает карточку с children', async () => {
    render(
      <FilterTag label="Статус">
        <OptionListCell label="Активен" />
        <OptionListCell label="Неактивен" />
      </FilterTag>
    );
    const trigger = screen.getByRole('button', { name: 'Статус' });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Активен')).toBeInTheDocument();
  });

  it('!single повторный клик закрывает карточку', async () => {
    render(
      <FilterTag label="Статус">
        <OptionListCell label="Активен" />
      </FilterTag>
    );
    const trigger = screen.getByRole('button', { name: 'Статус' });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Активен')).not.toBeInTheDocument();
  });

  it('Escape закрывает открытую карточку', async () => {
    render(<FilterTag label="Статус" />);
    const trigger = screen.getByRole('button', { name: 'Статус' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('без onClear крестик не рисуется даже при заполненном value', () => {
    render(<FilterTag label="Статус" value="Активен" />);
    expect(screen.queryByRole('button', { name: 'Очистить' })).not.toBeInTheDocument();
  });

  it('с value и onClear рисует крестик и зовёт колбэк по клику', async () => {
    const onClear = vi.fn();
    render(<FilterTag label="Статус" value="Активен" onClear={onClear} />);
    await userEvent.click(screen.getByRole('button', { name: 'Очистить' }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('без value крестик не рисуется, даже если onClear передан', () => {
    render(<FilterTag label="Статус" onClear={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Очистить' })).not.toBeInTheDocument();
  });

  it('disabled отключает основную кнопку и крестик', () => {
    render(<FilterTag label="Статус" value="Активен" onClear={() => {}} disabled />);
    expect(screen.getByRole('button', { name: 'Статус:Активен' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Очистить' })).toBeDisabled();
  });

  it('data-on-accent ставится только при заполненном value', () => {
    const { container, rerender } = render(<FilterTag label="Статус" />);
    expect(container.firstElementChild).not.toHaveAttribute('data-on-accent');
    rerender(<FilterTag label="Статус" value="Активен" />);
    expect(container.firstElementChild).toHaveAttribute('data-on-accent');
  });
});
