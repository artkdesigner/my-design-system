import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon } from './Icon';
import { ICONS } from './icons.generated';

describe('Icon', () => {
  it('рисует svg с путём нужной иконки', () => {
    const { container } = render(<Icon name="activity" />);
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('d', ICONS.activity.d);
  });

  it('по умолчанию берёт размер l', () => {
    const { container } = render(<Icon name="activity" />);
    expect(container.querySelector('svg')).toHaveAttribute('data-size', 'l');
  });

  it('переносит размер в data-атрибут', () => {
    const { container } = render(<Icon name="activity" size="s" />);
    expect(container.querySelector('svg')).toHaveAttribute('data-size', 's');
  });

  it('красится через currentColor, а не свой цвет', () => {
    const { container } = render(<Icon name="activity" />);
    expect(container.querySelector('path')).toHaveAttribute('fill', 'currentColor');
  });

  it('скрыта от скринридера как декоративная', () => {
    const { container } = render(<Icon name="activity" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('берёт свой viewBox из данных иконки', () => {
    const { container } = render(<Icon name="arrow-refresh-05" />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', ICONS['arrow-refresh-05'].viewBox);
  });

  it('пропускает наружу произвольные атрибуты svg', () => {
    const { container } = render(<Icon name="activity" data-testid="my-icon" />);
    expect(container.querySelector('[data-testid="my-icon"]')).toBeInTheDocument();
  });
});
