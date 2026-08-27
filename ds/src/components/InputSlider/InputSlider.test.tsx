import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputSlider } from './InputSlider';

describe('InputSlider', () => {
  it('рисует поле с текущим значением и слайдер', () => {
    render(<InputSlider label="Количество" value={5} min={0} max={10} />);
    expect(screen.getByLabelText('Количество')).toHaveValue('5');
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '5');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '10');
  });

  it('ввод валидного числа в поле вызывает onChange', () => {
    const onChange = vi.fn();
    render(<InputSlider label="Количество" value={5} min={0} max={10} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '8' } });
    expect(onChange).toHaveBeenCalledWith(8);
  });

  it('ввод невалидного текста не вызывает onChange', () => {
    const onChange = vi.fn();
    render(<InputSlider label="Количество" value={5} min={0} max={10} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '-' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('обрезает введённое число по max', () => {
    const onChange = vi.fn();
    render(<InputSlider label="Количество" value={5} min={0} max={10} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '99' } });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('клавиатура слайдера вызывает onChange с шагом step', () => {
    const onChange = vi.fn();
    render(<InputSlider label="Количество" value={5} min={0} max={10} step={2} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('disabled отключает и поле, и слайдер', () => {
    render(<InputSlider label="Количество" value={5} min={0} max={10} disabled />);
    expect(screen.getByLabelText('Количество')).toBeDisabled();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('slider')).toHaveAttribute('tabindex', '-1');
  });

  it('alert показывает alertText под слайдером, а не над ним', () => {
    render(<InputSlider label="Количество" value={5} min={0} max={10} alert="error" alertText="Введите корректное количество" />);
    expect(screen.getByText('Введите корректное количество')).toBeInTheDocument();
  });

  it('без alert показывает обычную подсказку', () => {
    render(<InputSlider label="Количество" value={5} min={0} max={10} hint="От 0 до 10" />);
    expect(screen.getByText('От 0 до 10')).toBeInTheDocument();
  });

  it('pips=false прячет деления слайдера', () => {
    render(<InputSlider label="Количество" value={5} min={0} max={10} pips={false} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('переносит size на Input и на Slider', () => {
    render(<InputSlider label="Количество" value={5} min={0} max={10} size="s" />);
    expect(screen.getByLabelText('Количество').closest('[data-size]')).toHaveAttribute('data-size', 's');
    expect(screen.getByRole('slider').closest('[data-size]')).toHaveAttribute('data-size', 's');
  });
});
