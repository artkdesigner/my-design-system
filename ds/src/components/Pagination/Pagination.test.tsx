import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('default: рисует все страницы без «…», если их немного', () => {
    render(<Pagination view="default" page={1} totalPages={5} />);
    ['1', '2', '3', '4', '5'].forEach((n) => expect(screen.getByRole('button', { name: n })).toBeInTheDocument());
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('default: сворачивает дальний хвост в «…», начало и текущую с соседями показывает', () => {
    render(<Pagination view="default" page={1} totalPages={34} />);
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '34' })).toBeInTheDocument();
    expect(screen.getByText('…')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '10' })).not.toBeInTheDocument();
  });

  it('default: страница в середине даёт «…» с обеих сторон', () => {
    render(<Pagination view="default" page={17} totalPages={34} />);
    expect(screen.getAllByText('…')).toHaveLength(2);
    expect(screen.getByRole('button', { name: '17' })).toHaveAttribute('aria-current', 'page');
  });

  it('клик по номеру зовёт onPageChange с этим номером', () => {
    const onPageChange = vi.fn();
    render(<Pagination view="default" page={1} totalPages={10} onPageChange={onPageChange} />);
    screen.getByRole('button', { name: '2' }).click();
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('стрелки листают на ±1 и отключаются на границах', () => {
    const onPageChange = vi.fn();
    render(<Pagination view="default" page={1} totalPages={10} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Предыдущая страница' })).toBeDisabled();
    screen.getByRole('button', { name: 'Следующая страница' }).click();
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('perPage: рисует текст вместо кнопок номеров', () => {
    render(<Pagination view="perPage" page={3} totalPages={12} />);
    expect(screen.getByText('3 из 12 страниц')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '3' })).not.toBeInTheDocument();
  });

  it('perPage: последняя страница отключает next', () => {
    render(<Pagination view="perPage" page={12} totalPages={12} />);
    expect(screen.getByRole('button', { name: 'Следующая страница' })).toBeDisabled();
  });
});
