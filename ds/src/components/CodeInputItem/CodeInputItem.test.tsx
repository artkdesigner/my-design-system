import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CodeInputItem } from './CodeInputItem';

describe('CodeInputItem', () => {
  it('не показывает значение, пока не filled', () => {
    const { container, rerender } = render(<CodeInputItem value="5" />);
    expect(container.textContent).toBe('');
    rerender(<CodeInputItem value="5" filled />);
    expect(container.textContent).toBe('5');
  });

  it('рисует курсор только когда active', () => {
    const { container, rerender } = render(<CodeInputItem />);
    expect(container.querySelector('span')).not.toBeInTheDocument();
    rerender(<CodeInputItem active />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('не рисует курсор в состоянии error, даже если active', () => {
    const { container } = render(<CodeInputItem active error />);
    expect(container.querySelector('span')).not.toBeInTheDocument();
  });

  it('не рисует курсор в состоянии disabled, даже если active', () => {
    const { container } = render(<CodeInputItem active disabled />);
    expect(container.querySelector('span')).not.toBeInTheDocument();
  });

  it('показывает курсор рядом со значением, когда active и filled одновременно', () => {
    const { container } = render(<CodeInputItem value="5" filled active />);
    expect(container.textContent).toBe('5');
    expect(container.querySelectorAll('span')).toHaveLength(2);
  });

  it('по умолчанию берёт размер l', () => {
    const { container } = render(<CodeInputItem />);
    expect(container.firstChild).toHaveProperty('dataset.size', 'l');
  });

  it('переносит size в data-атрибут', () => {
    const { container } = render(<CodeInputItem size="s" />);
    expect(container.firstChild).toHaveProperty('dataset.size', 's');
  });

  it('декоративна для скринридеров — сама ячейка ничего не объявляет', () => {
    const { container } = render(<CodeInputItem />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
