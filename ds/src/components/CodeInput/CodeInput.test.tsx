import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeInput } from './CodeInput';

describe('CodeInput', () => {
  it('рисует настоящее текстовое поле', () => {
    render(<CodeInput value="" aria-label="Код" />);
    expect(screen.getByLabelText('Код')).toBeInTheDocument();
  });

  it('рисует по одной ячейке на length, по умолчанию 8', () => {
    const { container } = render(<CodeInput value="" aria-label="Код" />);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(8);
  });

  it('уважает переданный length', () => {
    const { container } = render(<CodeInput value="" length={4} aria-label="Код" />);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(4);
  });

  it('показывает введённые цифры в ячейках по порядку', () => {
    const { container } = render(<CodeInput value="12" length={4} aria-label="Код" />);
    const cells = container.querySelectorAll('[aria-hidden="true"]');
    expect(cells[0]).toHaveTextContent('1');
    expect(cells[1]).toHaveTextContent('2');
    expect(cells[2]).toHaveTextContent('');
  });

  it('вызывает onChange только цифрами, обрезая по length', () => {
    const onChange = vi.fn();
    render(<CodeInput value="" length={4} onChange={onChange} aria-label="Код" />);
    fireEvent.change(screen.getByLabelText('Код'), { target: { value: 'a1b2c3d4e5' } });
    expect(onChange).toHaveBeenCalledWith('1234');
  });

  it('отключает поле при disabled', () => {
    render(<CodeInput value="" disabled aria-label="Код" />);
    expect(screen.getByLabelText('Код')).toBeDisabled();
  });

  it('в состоянии alert показывает alertText', () => {
    render(<CodeInput value="00000000" alert="error" alertText="Неверный код" aria-label="Код" />);
    expect(screen.getByText('Неверный код')).toBeInTheDocument();
  });

  it('без alert не показывает hint-блок', () => {
    render(<CodeInput value="" aria-label="Код" />);
    expect(screen.queryByText(/Неверный/)).not.toBeInTheDocument();
  });

  it('по умолчанию берёт размер l', () => {
    const { container } = render(<CodeInput value="" aria-label="Код" />);
    expect(container.firstChild).toHaveProperty('dataset.size', 'l');
  });
});
