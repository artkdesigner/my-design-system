import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Status } from './Status';

describe('Status', () => {
  it('рисует подпись', () => {
    render(<Status label="Активен" />);
    expect(screen.getByText('Активен')).toBeInTheDocument();
  });

  it('по умолчанию message-тон без заливки', () => {
    render(<Status label="Активен" />);
    const el = screen.getByText('Активен').closest('span[data-tone]') as HTMLElement;
    expect(el.dataset.tone).toBe('message');
    expect(el).not.toHaveAttribute('data-on-accent');
  });

  it('accent включает data-on-accent', () => {
    render(<Status label="Активен" accent />);
    const el = screen.getByText('Активен').closest('span[data-tone]') as HTMLElement;
    expect(el).toHaveAttribute('data-on-accent', 'true');
  });

  it('переносит tone=custom', () => {
    render(<Status label="Черновик" tone="custom" />);
    const el = screen.getByText('Черновик').closest('span[data-tone]') as HTMLElement;
    expect(el.dataset.tone).toBe('custom');
  });

  it('рисует addon, если передан', () => {
    render(<Status label="Активен" addon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('не рисует addon-слот, если не передан', () => {
    const { container } = render(<Status label="Активен" />);
    expect(container.querySelectorAll('span')).toHaveLength(2);
  });

  it('переносит size на корневой элемент', () => {
    render(<Status label="Активен" size="s" />);
    const el = screen.getByText('Активен').closest('span[data-tone]') as HTMLElement;
    expect(el).toHaveAttribute('data-size', 's');
  });
});
