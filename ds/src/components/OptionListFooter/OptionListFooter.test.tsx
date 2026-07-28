import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OptionListFooter } from './OptionListFooter';

describe('OptionListFooter', () => {
  it('рисует переданный children', () => {
    render(
      <OptionListFooter>
        <button>Применить</button>
      </OptionListFooter>
    );
    expect(screen.getByRole('button', { name: 'Применить' })).toBeInTheDocument();
  });

  it('переносит size на корневой элемент', () => {
    const { container } = render(<OptionListFooter size="m" />);
    expect(container.firstChild).toHaveAttribute('data-size', 'm');
  });
});
