import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccordionHeader } from './AccordionHeader';

describe('AccordionHeader', () => {
  it('по умолчанию preset=custom рисует children', () => {
    render(<AccordionHeader>Мой заголовок</AccordionHeader>);
    expect(screen.getByText('Мой заголовок')).toBeInTheDocument();
  });

  it('preset=title рисует titleText вместо children', () => {
    render(
      <AccordionHeader preset="title" titleText="Заголовок">
        Игнорируется
      </AccordionHeader>
    );
    expect(screen.getByText('Заголовок')).toBeInTheDocument();
    expect(screen.queryByText('Игнорируется')).not.toBeInTheDocument();
  });

  it('переносит preset в data-атрибут', () => {
    const { container } = render(<AccordionHeader preset="title" titleText="X" />);
    expect((container.firstElementChild as HTMLElement).dataset.preset).toBe('title');
  });
});
