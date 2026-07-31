import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('по умолчанию size=l и role=progressbar', () => {
    const { container } = render(<ProgressBar value={40} />);
    const track = container.firstElementChild as HTMLElement;
    expect(track.dataset.size).toBe('l');
    expect(track).toHaveAttribute('role', 'progressbar');
  });

  it('переносит value в aria-valuenow и ширину заливки', () => {
    const { container } = render(<ProgressBar value={40} />);
    const track = container.firstElementChild as HTMLElement;
    expect(track).toHaveAttribute('aria-valuenow', '40');
    const fill = track.firstElementChild as HTMLElement;
    expect(fill.style.width).toBe('40%');
  });

  it('переносит size в data-атрибут', () => {
    const { container } = render(<ProgressBar value={10} size="s" />);
    expect((container.firstElementChild as HTMLElement).dataset.size).toBe('s');
  });

  it('обрезает value до диапазона 0–100', () => {
    const { container: over } = render(<ProgressBar value={140} />);
    const { container: under } = render(<ProgressBar value={-20} />);
    expect((over.firstElementChild as HTMLElement)).toHaveAttribute('aria-valuenow', '100');
    expect((under.firstElementChild as HTMLElement)).toHaveAttribute('aria-valuenow', '0');
  });

  it('пропускает наружу произвольные атрибуты', () => {
    const { container } = render(<ProgressBar value={10} data-testid="my-progress" />);
    expect(container.querySelector('[data-testid="my-progress"]')).toBeInTheDocument();
  });
});
