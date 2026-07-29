import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagControl } from './TagControl';

describe('TagControl', () => {
  it('mode="more" показывает счётчик скрытых тегов', () => {
    render(<TagControl mode="more" count={3} />);
    expect(screen.getByRole('button', { name: 'Ещё 3' })).toBeInTheDocument();
  });

  it('mode="hide" показывает фиксированную подпись', () => {
    render(<TagControl mode="hide" count={5} />);
    expect(screen.getByRole('button', { name: 'Скрыть' })).toBeInTheDocument();
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<TagControl mode="more" count={1} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
