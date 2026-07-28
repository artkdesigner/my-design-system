import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './Label';

describe('Label', () => {
  it('рисует подпись как нативный label', () => {
    render(<Label label="Имя" />);
    expect(screen.getByText('Имя').tagName).toBe('SPAN');
    expect(screen.getByText('Имя').closest('label')).toBeInTheDocument();
  });

  it('связывает подпись с полем через htmlFor', () => {
    render(
      <>
        <Label label="Имя" htmlFor="name-input" />
        <input id="name-input" />
      </>
    );
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
  });

  it('рисует подсказку под подписью', () => {
    render(<Label label="Имя" hint="Только буквы" />);
    expect(screen.getByText('Только буквы')).toBeInTheDocument();
  });

  it('не рисует блок подсказки, если hint не передан', () => {
    const { container } = render(<Label label="Имя" />);
    expect(container.querySelectorAll('span')).toHaveLength(2);
  });

  it('рисует левый и правый addon, если переданы', () => {
    render(<Label label="Имя" leftAddon={<span data-testid="left" />} rightAddon={<span data-testid="right" />} />);
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('переносит size на корневой элемент', () => {
    render(<Label label="Имя" size="s" />);
    expect(screen.getByText('Имя').closest('label')).toHaveAttribute('data-size', 's');
  });
});
