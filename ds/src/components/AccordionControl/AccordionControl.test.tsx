import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AccordionControl } from './AccordionControl';

describe('AccordionControl', () => {
  it('по умолчанию preset=downChevron, закрыт', () => {
    const { container } = render(<AccordionControl />);
    const control = container.firstElementChild as HTMLElement;
    expect(control.dataset.preset).toBe('downChevron');
    expect(control).not.toHaveAttribute('data-open');
  });

  it('open переносится в data-атрибут', () => {
    const { container } = render(<AccordionControl open />);
    expect(container.firstElementChild).toHaveAttribute('data-open', 'true');
  });

  it('переносит preset в data-атрибут', () => {
    const { container } = render(<AccordionControl preset="rightChevron" />);
    expect((container.firstElementChild as HTMLElement).dataset.preset).toBe('rightChevron');
  });

  it('скрыт от скринридера — доступность даёт заголовок аккордеона', () => {
    const { container } = render(<AccordionControl />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
