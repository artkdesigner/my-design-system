import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';
import { ICONS } from '../Icon/icons.generated';

describe('StatusBadge', () => {
  it('рисует переданную иконку', () => {
    const { container } = render(<StatusBadge icon="check-contained" />);
    expect(container.querySelector('path')).toHaveAttribute('d', ICONS['check-contained'].d);
  });

  it('по умолчанию статус info и размер l', () => {
    const { container } = render(<StatusBadge icon="information-circle-contained" />);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.dataset.message).toBe('info');
    expect(badge.dataset.size).toBe('l');
  });

  it('переносит статус в data-message', () => {
    const { container } = render(<StatusBadge icon="x-circle-contained" status="error" />);
    expect((container.firstElementChild as HTMLElement).dataset.message).toBe('error');
  });

  it('переносит size в data-атрибут', () => {
    const { container } = render(<StatusBadge icon="check-contained" size="s" />);
    expect((container.firstElementChild as HTMLElement).dataset.size).toBe('s');
  });

  it('иконка скрыта от читалок экрана как декоративная', () => {
    const { container } = render(<StatusBadge icon="check-contained" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('пропускает наружу произвольные атрибуты обёртки', () => {
    const { container } = render(<StatusBadge icon="check-contained" data-testid="my-badge" />);
    expect(container.querySelector('[data-testid="my-badge"]')).toBeInTheDocument();
  });
});
