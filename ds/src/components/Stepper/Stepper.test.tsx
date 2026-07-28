import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stepper } from './Stepper';

describe('Stepper', () => {
  it('рисует кнопки уменьшения и увеличения', () => {
    render(<Stepper value={5} />);
    expect(screen.getByRole('button', { name: 'Уменьшить' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Увеличить' })).toBeInTheDocument();
  });

  it('увеличение вызывает onChange с value + step', async () => {
    const onChange = vi.fn();
    render(<Stepper value={5} step={2} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Увеличить' }));
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('уменьшение вызывает onChange с value - step', async () => {
    const onChange = vi.fn();
    render(<Stepper value={5} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Уменьшить' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('на границе min кнопка уменьшения недоступна (состояние Min)', () => {
    render(<Stepper value={0} min={0} max={10} />);
    expect(screen.getByRole('button', { name: 'Уменьшить' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Увеличить' })).not.toBeDisabled();
  });

  it('на границе max кнопка увеличения недоступна (состояние Max)', () => {
    render(<Stepper value={10} min={0} max={10} />);
    expect(screen.getByRole('button', { name: 'Увеличить' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Уменьшить' })).not.toBeDisabled();
  });

  it('обе кнопки доступны в середине диапазона (состояние Middle)', () => {
    render(<Stepper value={5} min={0} max={10} />);
    expect(screen.getByRole('button', { name: 'Уменьшить' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Увеличить' })).not.toBeDisabled();
  });

  it('обрезает результат по max, даже если step перепрыгивает границу', async () => {
    const onChange = vi.fn();
    render(<Stepper value={9} step={5} max={10} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Увеличить' }));
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('переносит size в data-атрибут', () => {
    const { container } = render(<Stepper value={5} size="s" />);
    expect(container.firstChild).toHaveAttribute('data-size', 's');
  });

  it('переносит переданные подписи кнопок', () => {
    render(<Stepper value={5} decrementLabel="Меньше" incrementLabel="Больше" />);
    expect(screen.getByRole('button', { name: 'Меньше' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Больше' })).toBeInTheDocument();
  });

  it('disabled отключает обе кнопки независимо от границ диапазона', () => {
    render(<Stepper value={5} min={0} max={10} disabled />);
    expect(screen.getByRole('button', { name: 'Уменьшить' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Увеличить' })).toBeDisabled();
  });
});
