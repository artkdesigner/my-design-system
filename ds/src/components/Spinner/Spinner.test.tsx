import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('по умолчанию берёт размер l', () => {
    const { container } = render(<Spinner />);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'l');
  });

  it('переносит размер в data-атрибут', () => {
    const { container } = render(<Spinner size="s" />);
    expect(container.firstElementChild).toHaveAttribute('data-size', 's');
  });

  it('декоративный по умолчанию — aria-hidden', () => {
    const { container } = render(<Spinner />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('добавляет собственный класс к переданному, а не заменяет его', () => {
    const { container } = render(<Spinner className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });

  it('пропускает наружу произвольные атрибуты, вплоть до переопределения role', () => {
    const { container } = render(<Spinner role="status" aria-label="Загрузка" />);
    expect(container.firstElementChild).toHaveAttribute('role', 'status');
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Загрузка');
  });
});
