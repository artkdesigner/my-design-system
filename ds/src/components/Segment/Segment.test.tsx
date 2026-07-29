import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Segment } from './Segment';

describe('Segment', () => {
  it('рисует элемент с ролью radio, а не обычную кнопку', () => {
    render(<Segment>Label</Segment>);
    expect(screen.getByRole('radio', { name: 'Label' })).toBeInTheDocument();
  });

  it('по умолчанию не выбран и берёт размер l', () => {
    render(<Segment>Label</Segment>);
    const segment = screen.getByRole('radio');
    expect(segment).toHaveAttribute('aria-checked', 'false');
    expect(segment.dataset.size).toBe('l');
  });

  it('выбранное состояние даёт aria-checked=true', () => {
    render(<Segment selected>Label</Segment>);
    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'true');
  });

  it('переносит размер в data-атрибут', () => {
    render(<Segment size="s">Label</Segment>);
    expect(screen.getByRole('radio').dataset.size).toBe('s');
  });

  it('несёт класс ds-interactive', () => {
    render(<Segment>Label</Segment>);
    expect(screen.getByRole('radio')).toHaveClass('ds-interactive');
  });

  it('с подписью и без иконок не считается иконочным', () => {
    render(<Segment>Label</Segment>);
    expect(screen.getByRole('radio')).not.toHaveAttribute('data-icon-only');
  });

  it('без подписи, но с иконкой считается иконочным', () => {
    render(<Segment iconLeft={<svg data-testid="icon" />} aria-label="Список" />);
    expect(screen.getByRole('radio')).toHaveAttribute('data-icon-only', 'true');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('прячет иконки от скринридера', () => {
    const { container } = render(
      <Segment iconLeft={<svg />} iconRight={<svg />}>
        Label
      </Segment>
    );
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  it('выбранный сегмент включает data-on-accent для белого содержимого', () => {
    render(<Segment selected>Label</Segment>);
    expect(screen.getByRole('radio')).toHaveAttribute('data-on-accent', 'true');
  });

  it('невыбранный сегмент не включает data-on-accent', () => {
    render(<Segment>Label</Segment>);
    expect(screen.getByRole('radio')).not.toHaveAttribute('data-on-accent');
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(
      <Segment onClick={onClick} selected={false}>
        Label
      </Segment>
    );
    await userEvent.click(screen.getByRole('radio'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('сам ничего не переключает — selected приходит снаружи', async () => {
    const onClick = vi.fn();
    render(
      <Segment onClick={onClick} selected={false}>
        Label
      </Segment>
    );
    await userEvent.click(screen.getByRole('radio'));
    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'false');
  });

  it('не вызывает обработчик, когда недоступен', async () => {
    const onClick = vi.fn();
    render(
      <Segment onClick={onClick} disabled>
        Label
      </Segment>
    );
    await userEvent.click(screen.getByRole('radio'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
