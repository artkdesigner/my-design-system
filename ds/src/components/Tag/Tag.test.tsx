import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tag } from './Tag';

describe('Tag', () => {
  it('рисует настоящую кнопку с подписью', () => {
    render(<Tag label="Тег" />);
    expect(screen.getByRole('button', { name: 'Тег' })).toBeInTheDocument();
  });

  it('по умолчанию не выбран', () => {
    render(<Tag label="Тег" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('переносит selected в aria-pressed и data-атрибуты', () => {
    render(<Tag label="Тег" selected />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-selected', 'true');
    expect(button).toHaveAttribute('data-on-accent', 'true');
  });

  it('без label становится иконочным и не рисует rightAddon', () => {
    render(<Tag aria-label="Закрыть" leftAddon={<svg data-testid="left" />} rightAddon={<svg data-testid="right" />} />);
    const button = screen.getByRole('button', { name: 'Закрыть' });
    expect(button).toHaveAttribute('data-icon-only', 'true');
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.queryByTestId('right')).not.toBeInTheDocument();
  });

  it('с label рисует оба addon', () => {
    render(<Tag label="Тег" leftAddon={<svg data-testid="left" />} rightAddon={<svg data-testid="right" />} />);
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('переносит corners и size', () => {
    render(<Tag label="Тег" corners="square" size="s" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-corners', 'square');
    expect(button).toHaveAttribute('data-size', 's');
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<Tag label="Тег" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('несёт класс ds-interactive', () => {
    render(<Tag label="Тег" />);
    expect(screen.getByRole('button')).toHaveClass('ds-interactive');
  });
});
