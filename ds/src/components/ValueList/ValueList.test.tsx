import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ValueList, type ValueListItem } from './ValueList';

const items: ValueListItem[] = [
  { value: 'a', label: 'Aurum' },
  { value: 'b', label: 'Berkelium' },
  { value: 'c', label: 'Cerium' }
];

describe('ValueList', () => {
  it('без maxVisible рисует все теги без TagControl', () => {
    render(<ValueList items={items} />);
    expect(screen.getAllByText(/Aurum|Berkelium|Cerium/)).toHaveLength(3);
    expect(screen.queryByText(/Ещё/)).not.toBeInTheDocument();
  });

  it('с maxVisible показывает порог тегов и «Ещё N»', () => {
    render(<ValueList items={items} maxVisible={2} />);
    expect(screen.getByText('Aurum')).toBeInTheDocument();
    expect(screen.getByText('Berkelium')).toBeInTheDocument();
    expect(screen.queryByText('Cerium')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ещё 1' })).toBeInTheDocument();
  });

  it('клик по «Ещё N» разворачивает список и показывает «Скрыть»', async () => {
    render(<ValueList items={items} maxVisible={2} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ещё 1' }));
    expect(screen.getByText('Cerium')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Скрыть' })).toBeInTheDocument();
  });

  it('клик по «Скрыть» сворачивает список обратно', async () => {
    render(<ValueList items={items} maxVisible={2} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ещё 1' }));
    await userEvent.click(screen.getByRole('button', { name: 'Скрыть' }));
    expect(screen.queryByText('Cerium')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ещё 1' })).toBeInTheDocument();
  });

  it('клик по тегу вызывает onRemove с его value', async () => {
    const onRemove = vi.fn();
    render(<ValueList items={items} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Berkelium' }));
    expect(onRemove).toHaveBeenCalledWith('b');
  });

  it('maxVisible не сворачивает, если тегов не больше порога', () => {
    render(<ValueList items={items} maxVisible={5} />);
    expect(screen.queryByText(/Ещё/)).not.toBeInTheDocument();
  });
});
