import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OptionListGroupTitle } from './OptionListGroupTitle';

describe('OptionListGroupTitle', () => {
  it('рисует переданный title', () => {
    render(<OptionListGroupTitle title="Категория" />);
    expect(screen.getByText('Категория')).toBeInTheDocument();
  });

  it('переносит size на корневой элемент', () => {
    const { container } = render(<OptionListGroupTitle title="X" size="m" />);
    expect(container.firstChild).toHaveAttribute('data-size', 'm');
  });
});
