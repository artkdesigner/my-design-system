import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Scrollbar } from './Scrollbar';

describe('Scrollbar', () => {
  it('рисует переданное содержимое', () => {
    render(
      <Scrollbar>
        <p>Контент</p>
      </Scrollbar>
    );
    expect(screen.getByText('Контент')).toBeInTheDocument();
  });

  it('пропускает наружу произвольные атрибуты обёртки', () => {
    render(
      <Scrollbar aria-label="Список">
        <p>Контент</p>
      </Scrollbar>
    );
    expect(screen.getByLabelText('Список')).toBeInTheDocument();
  });

  it('добавляет переданный className к обёртке', () => {
    const { container } = render(
      <Scrollbar className="custom">
        <p>Контент</p>
      </Scrollbar>
    );
    expect(container.firstChild).toHaveClass('custom');
  });
});
