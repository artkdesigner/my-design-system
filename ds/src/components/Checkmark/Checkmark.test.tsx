import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Checkmark } from './Checkmark';
import { ICONS } from '../Icon/icons.generated';

describe('Checkmark', () => {
  it('рисует иконку check из общего набора, а не свой путь', () => {
    const { container } = render(<Checkmark />);
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('d', ICONS.check.d);
  });

  it('по умолчанию не отмечена', () => {
    const { container } = render(<Checkmark />);
    expect(container.firstElementChild).not.toHaveAttribute('data-selected');
  });

  it('переносит выбранность в data-атрибут', () => {
    const { container } = render(<Checkmark selected />);
    expect(container.firstElementChild).toHaveAttribute('data-selected', 'true');
  });

  it('по умолчанию берёт размер l', () => {
    const { container } = render(<Checkmark />);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'l');
  });

  it('переносит размер в data-атрибут', () => {
    const { container } = render(<Checkmark size="s" />);
    expect(container.firstElementChild).toHaveAttribute('data-size', 's');
  });

  it('передаёт размер вложенной иконке', () => {
    const { container } = render(<Checkmark size="m" />);
    expect(container.querySelector('svg')).toHaveAttribute('data-size', 'm');
  });

  it('добавляет собственный класс к переданному, а не заменяет его', () => {
    const { container } = render(<Checkmark className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });
});
