import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OptionListEmptyState } from './OptionListEmptyState';

describe('OptionListEmptyState', () => {
  it('по умолчанию рисует «Ничего не нашлось»', () => {
    render(<OptionListEmptyState />);
    expect(screen.getByText('Ничего не нашлось')).toBeInTheDocument();
  });

  it('рисует переданный text вместо дефолтного', () => {
    render(<OptionListEmptyState text="Нет совпадений" />);
    expect(screen.getByText('Нет совпадений')).toBeInTheDocument();
    expect(screen.queryByText('Ничего не нашлось')).not.toBeInTheDocument();
  });

  it('переносит size на корневой элемент', () => {
    const { container } = render(<OptionListEmptyState size="m" />);
    expect(container.firstChild).toHaveAttribute('data-size', 'm');
  });
});
