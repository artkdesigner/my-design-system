import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageButton } from './PageButton';

describe('PageButton', () => {
  it('рисует номер страницы', () => {
    render(<PageButton page={3} />);
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });

  it('selected переносит aria-current и data-атрибуты', () => {
    render(<PageButton page={1} selected />);
    const button = screen.getByRole('button', { name: '1' });
    expect(button).toHaveAttribute('aria-current', 'page');
    expect(button).toHaveAttribute('data-selected', 'true');
    expect(button).toHaveAttribute('data-on-accent', 'true');
  });

  it('не selected — без aria-current', () => {
    render(<PageButton page={2} />);
    expect(screen.getByRole('button', { name: '2' })).not.toHaveAttribute('aria-current');
  });

  it('hidden рисует «…» без кнопки', () => {
    render(<PageButton page={5} hidden />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('…')).toBeInTheDocument();
  });

  it('клик по кнопке зовёт onClick', () => {
    const onClick = vi.fn();
    render(<PageButton page={4} onClick={onClick} />);
    screen.getByRole('button', { name: '4' }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
