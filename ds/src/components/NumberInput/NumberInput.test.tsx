import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('рисует поле с текущим значением и кнопки степпера', () => {
    render(<NumberInput label="Количество" value={5} />);
    expect(screen.getByLabelText('Количество')).toHaveValue('5');
    expect(screen.getByRole('button', { name: 'Уменьшить' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Увеличить' })).toBeInTheDocument();
  });

  it('клик по «увеличить» вызывает onChange с value + step', async () => {
    const onChange = vi.fn();
    render(<NumberInput label="Количество" value={5} step={2} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Увеличить' }));
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('клик по «уменьшить» обрезает результат по min', async () => {
    const onChange = vi.fn();
    render(<NumberInput label="Количество" value={0} min={0} onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Уменьшить' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Увеличить' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('ввод валидного числа в поле вызывает onChange', () => {
    const onChange = vi.fn();
    render(<NumberInput label="Количество" value={5} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '42' } });
    expect(onChange).toHaveBeenCalledWith(42);
  });

  it('ввод невалидного текста не вызывает onChange', () => {
    const onChange = vi.fn();
    render(<NumberInput label="Количество" value={5} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '-' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('обрезает введённое число по max', () => {
    const onChange = vi.fn();
    render(<NumberInput label="Количество" value={5} max={10} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '99' } });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('disabled отключает и поле, и кнопки степпера', () => {
    render(<NumberInput label="Количество" value={5} disabled />);
    expect(screen.getByLabelText('Количество')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Уменьшить' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Увеличить' })).toBeDisabled();
  });

  it('alert показывает alertText, как у Input', () => {
    render(<NumberInput label="Количество" value={5} alert alertText="Введите корректное количество" />);
    expect(screen.getByText('Введите корректное количество')).toBeInTheDocument();
  });

  it('переносит size на Input и на Stepper', () => {
    render(<NumberInput label="Количество" value={5} size="s" />);
    expect(screen.getByRole('button', { name: 'Уменьшить' })).toHaveAttribute('data-size', 's');
  });
});
