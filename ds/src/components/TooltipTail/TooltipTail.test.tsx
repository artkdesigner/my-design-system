import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TooltipTail } from './TooltipTail';

describe('TooltipTail', () => {
  it('декоративен для скринридеров', () => {
    const { container } = render(<TooltipTail />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('по умолчанию берёт size l и position middle', () => {
    const { container } = render(<TooltipTail />);
    expect(container.firstChild).toHaveProperty('dataset.size', 'l');
    expect(container.firstChild).toHaveProperty('dataset.position', 'middle');
  });

  it('переносит position в data-атрибут', () => {
    const { container } = render(<TooltipTail position="start" />);
    expect(container.firstChild).toHaveProperty('dataset.position', 'start');
  });

  it('рисует форму как svg', () => {
    const { container } = render(<TooltipTail />);
    expect(container.querySelector('svg path')).toBeInTheDocument();
  });
});
