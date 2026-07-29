import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from './Slider';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Slider', () => {
  it('рисует роль slider с текущими границами и значением', () => {
    render(<Slider value={4} min={1} max={10} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '1');
    expect(slider).toHaveAttribute('aria-valuemax', '10');
    expect(slider).toHaveAttribute('aria-valuenow', '4');
  });

  it('по умолчанию берёт размер l', () => {
    const { container } = render(<Slider value={4} />);
    expect(container.firstChild).toHaveProperty('dataset.size', 'l');
  });

  it('рисует деления от min до max с шагом step', () => {
    render(<Slider value={4} min={1} max={10} step={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(document.querySelectorAll('[class*="pips"] > span')).toHaveLength(10);
  });

  it('pips=false прячет ряд делений', () => {
    render(<Slider value={4} min={1} max={10} pips={false} />);
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('стрелка вправо увеличивает значение на step', () => {
    const onChange = vi.fn();
    render(<Slider value={4} min={1} max={10} step={1} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('стрелка влево уменьшает значение на step', () => {
    const onChange = vi.fn();
    render(<Slider value={4} min={1} max={10} step={2} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('не выходит за max по стрелке вправо', () => {
    const onChange = vi.fn();
    render(<Slider value={10} min={1} max={10} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('Home и End переносят в min и max', () => {
    const onChange = vi.fn();
    render(<Slider value={4} min={1} max={10} onChange={onChange} />);
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith(1);
    fireEvent.keyDown(slider, { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it('disabled отключает клавиатуру и убирает из таб-порядка', () => {
    const onChange = vi.fn();
    render(<Slider value={4} min={1} max={10} disabled onChange={onChange} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('tabindex', '-1');
    expect(slider).toHaveAttribute('aria-disabled', 'true');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('клик по линии переставляет значение по позиции курсора', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      right: 200,
      width: 200,
      top: 0,
      bottom: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ''
    });
    const onChange = vi.fn();
    const { container } = render(<Slider value={1} min={1} max={10} step={1} onChange={onChange} />);
    const line = container.querySelector('[class*="line"]') as HTMLElement;
    fireEvent.pointerDown(line, { clientX: 100, pointerId: 1 });
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('disabled игнорирует клик по линии', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      right: 200,
      width: 200,
      top: 0,
      bottom: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ''
    });
    const onChange = vi.fn();
    const { container } = render(<Slider value={1} min={1} max={10} disabled onChange={onChange} />);
    const line = container.querySelector('[class*="line"]') as HTMLElement;
    fireEvent.pointerDown(line, { clientX: 100, pointerId: 1 });
    expect(onChange).not.toHaveBeenCalled();
  });
});
