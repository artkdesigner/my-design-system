import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OptionList } from './OptionList';
import { OptionListCell } from '../OptionListCell';

describe('OptionList', () => {
  it('рисует переданные ячейки как children', () => {
    render(
      <OptionList>
        <OptionListCell label="Первая" />
        <OptionListCell label="Вторая" />
      </OptionList>
    );
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('переносит size на корневой элемент', () => {
    const { container } = render(<OptionList size="s" />);
    expect(container.firstChild).toHaveAttribute('data-size', 's');
  });

  it('по умолчанию size l', () => {
    const { container } = render(<OptionList />);
    expect(container.firstChild).toHaveAttribute('data-size', 'l');
  });
});
