import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccordionBody } from './AccordionBody';

describe('AccordionBody', () => {
  it('по умолчанию preset=custom рисует children', () => {
    render(<AccordionBody>Моё содержимое</AccordionBody>);
    expect(screen.getByText('Моё содержимое')).toBeInTheDocument();
  });

  it('preset=text рисует text вместо children', () => {
    render(
      <AccordionBody preset="text" text="Текст">
        Игнорируется
      </AccordionBody>
    );
    expect(screen.getByText('Текст')).toBeInTheDocument();
    expect(screen.queryByText('Игнорируется')).not.toBeInTheDocument();
  });

  it('переносит preset в data-атрибут', () => {
    const { container } = render(<AccordionBody preset="text" text="X" />);
    expect((container.firstElementChild as HTMLElement).dataset.preset).toBe('text');
  });
});
