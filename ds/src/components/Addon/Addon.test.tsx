import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Addon } from './Addon';

describe('Addon', () => {
  it('рисует содержимое внутри слота', () => {
    render(<Addon>{<svg data-testid="content" />}</Addon>);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('по умолчанию берёт размер l', () => {
    const { container } = render(<Addon>content</Addon>);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'l');
  });

  it('переносит размер в data-атрибут', () => {
    const { container } = render(<Addon size="s">content</Addon>);
    expect(container.firstElementChild).toHaveAttribute('data-size', 's');
  });

  it('не прячет себя от скринридера по умолчанию — внутри может быть интерактивный элемент', () => {
    const { container } = render(<Addon>content</Addon>);
    expect(container.firstElementChild).not.toHaveAttribute('aria-hidden');
  });

  it('пропускает наружу aria-hidden, когда вызывающий компонент помечает слот декоративным', () => {
    const { container } = render(<Addon aria-hidden="true">content</Addon>);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('добавляет собственный класс к переданному, а не заменяет его', () => {
    render(<Addon className="custom">content</Addon>);
    expect(screen.getByText('content')).toHaveClass('custom');
  });

  it('пропускает наружу произвольные атрибуты', () => {
    render(<Addon data-testid="my-addon">content</Addon>);
    expect(screen.getByTestId('my-addon')).toBeInTheDocument();
  });
});
