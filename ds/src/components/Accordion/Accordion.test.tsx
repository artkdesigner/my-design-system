import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('closed: заголовок виден, тело — нет', () => {
    render(
      <Accordion title="Title" opened={false}>
        Body text
      </Accordion>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.queryByText('Body text')).not.toBeInTheDocument();
  });

  it('opened: тело тоже видно', () => {
    render(
      <Accordion title="Title" opened>
        Body text
      </Accordion>
    );
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('клик по заголовку зовёт onOpenedChange с инвертированным opened', () => {
    const onOpenedChange = vi.fn();
    render(
      <Accordion title="Title" opened={false} onOpenedChange={onOpenedChange}>
        Body text
      </Accordion>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onOpenedChange).toHaveBeenCalledWith(true);
  });

  it('не переключается сам — opened управляется снаружи', () => {
    render(
      <Accordion title="Title" opened={false}>
        Body text
      </Accordion>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Body text')).not.toBeInTheDocument();
  });

  it('aria-expanded отражает opened', () => {
    render(
      <Accordion title="Title" opened>
        Body text
      </Accordion>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('controlSide переносится в data-атрибут', () => {
    const { container } = render(
      <Accordion title="Title" opened={false} controlSide="right">
        Body text
      </Accordion>
    );
    expect((container.firstElementChild as HTMLElement).dataset.controlSide).toBe('right');
  });
});
