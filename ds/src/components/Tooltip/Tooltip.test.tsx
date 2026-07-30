import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('рисует переданное содержимое', () => {
    render(<Tooltip>Подсказка</Tooltip>);
    expect(screen.getByText('Подсказка')).toBeInTheDocument();
  });

  it('по умолчанию берёт tailDirection left и рисует хвостик первым', () => {
    const { container } = render(<Tooltip>Подсказка</Tooltip>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.firstElementChild).toHaveAttribute('data-direction', 'left');
  });

  it('при tailDirection right рисует хвостик последним', () => {
    const { container } = render(<Tooltip tailDirection="right">Подсказка</Tooltip>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.lastElementChild).toHaveAttribute('data-direction', 'right');
  });

  it('при tailDirection up/down переключает ось раскладки на column', () => {
    const { container: up } = render(<Tooltip tailDirection="up">Подсказка</Tooltip>);
    expect(up.firstChild).toHaveProperty('dataset.axis', 'column');

    const { container: left } = render(<Tooltip tailDirection="left">Подсказка</Tooltip>);
    expect(left.firstChild).toHaveProperty('dataset.axis', 'row');
  });

  it('по умолчанию берёт размер l', () => {
    const { container } = render(<Tooltip>Подсказка</Tooltip>);
    expect(container.firstChild).toHaveProperty('dataset.size', 'l');
  });
});
