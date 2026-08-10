import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('closed: заголовок виден, тело скрыто от a11y и вынуто из табиндекса', () => {
    render(
      <Accordion title="Title" opened={false}>
        Body text
      </Accordion>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    // Тело остаётся в DOM (нужно для плавной CSS-анимации высоты), но
    // помечается aria-hidden + inert, а не размонтируется.
    const wrapper = screen.getByText('Body text').closest('[aria-hidden]') as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).toHaveAttribute('inert');
  });

  it('opened: тело видно и доступно', () => {
    render(
      <Accordion title="Title" opened>
        Body text
      </Accordion>
    );
    const wrapper = screen.getByText('Body text').closest('[aria-hidden]') as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'false');
    expect(wrapper).not.toHaveAttribute('inert');
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
    const wrapper = screen.getByText('Body text').closest('[aria-hidden]') as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
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
