import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
  it('рисует hr', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('по умолчанию горизонтальная, без aria-orientation', () => {
    render(<Divider />);
    const divider = screen.getByRole('separator');
    expect(divider.dataset.orientation).toBe('horizontal');
    expect(divider).not.toHaveAttribute('aria-orientation');
  });

  it('vertical ставит data-orientation и aria-orientation', () => {
    render(<Divider orientation="vertical" />);
    const divider = screen.getByRole('separator');
    expect(divider.dataset.orientation).toBe('vertical');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('пропускает наружу произвольные атрибуты', () => {
    render(<Divider data-testid="my-divider" />);
    expect(screen.getByTestId('my-divider')).toBeInTheDocument();
  });
});
