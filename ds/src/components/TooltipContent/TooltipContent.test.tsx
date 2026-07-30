import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TooltipContent } from './TooltipContent';

describe('TooltipContent', () => {
  it('при preset="text" рисует переданный text', () => {
    render(<TooltipContent preset="text" text="Подсказка" />);
    expect(screen.getByText('Подсказка')).toBeInTheDocument();
  });

  it('по умолчанию берёт preset text', () => {
    render(<TooltipContent text="Подсказка" />);
    expect(screen.getByText('Подсказка')).toBeInTheDocument();
  });

  it('при preset="custom" рисует children, а не text', () => {
    render(
      <TooltipContent preset="custom" text="Подсказка">
        <button>Кнопка</button>
      </TooltipContent>
    );
    expect(screen.getByRole('button', { name: 'Кнопка' })).toBeInTheDocument();
    expect(screen.queryByText('Подсказка')).not.toBeInTheDocument();
  });
});
