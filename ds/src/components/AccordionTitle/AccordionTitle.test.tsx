import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccordionTitle } from './AccordionTitle';

describe('AccordionTitle', () => {
  it('по умолчанию preset=custom рисует children', () => {
    render(<AccordionTitle>Мой заголовок</AccordionTitle>);
    expect(screen.getByText('Мой заголовок')).toBeInTheDocument();
  });

  it('preset=title рисует titleText вместо children', () => {
    render(
      <AccordionTitle preset="title" titleText="Заголовок">
        Игнорируется
      </AccordionTitle>
    );
    expect(screen.getByText('Заголовок')).toBeInTheDocument();
    expect(screen.queryByText('Игнорируется')).not.toBeInTheDocument();
  });

  it('переносит preset в data-атрибут', () => {
    const { container } = render(<AccordionTitle preset="title" titleText="X" />);
    expect((container.firstElementChild as HTMLElement).dataset.preset).toBe('title');
  });
});
