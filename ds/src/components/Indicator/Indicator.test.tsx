import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Indicator } from './Indicator';

describe('Indicator', () => {
  it('по умолчанию рисует count и view=accent', () => {
    const { container } = render(<Indicator count="1" />);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.dataset.view).toBe('accent');
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('переносит view в data-атрибут', () => {
    const { container } = render(<Indicator count="1" view="neutral" />);
    expect((container.firstElementChild as HTMLElement).dataset.view).toBe('neutral');
  });

  it('dot=true не рисует count вовсе', () => {
    render(<Indicator count="1" dot />);
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('dot переносится в data-атрибут', () => {
    const { container } = render(<Indicator dot />);
    expect(container.firstElementChild).toHaveAttribute('data-dot', 'true');
  });

  it('без dot data-dot отсутствует', () => {
    const { container } = render(<Indicator count="1" />);
    expect(container.firstElementChild).not.toHaveAttribute('data-dot');
  });

  it('accent и neutral несут data-on-accent, light — нет', () => {
    const { container: accent } = render(<Indicator count="1" view="accent" />);
    const { container: neutral } = render(<Indicator count="1" view="neutral" />);
    const { container: light } = render(<Indicator count="1" view="light" />);
    expect(accent.firstElementChild).toHaveAttribute('data-on-accent', 'true');
    expect(neutral.firstElementChild).toHaveAttribute('data-on-accent', 'true');
    expect(light.firstElementChild).not.toHaveAttribute('data-on-accent');
  });

  it('переносит size в data-атрибут', () => {
    const { container } = render(<Indicator count="1" size="s" />);
    expect((container.firstElementChild as HTMLElement).dataset.size).toBe('s');
  });

  it('пропускает наружу произвольные атрибуты', () => {
    const { container } = render(<Indicator count="1" data-testid="my-indicator" />);
    expect(container.querySelector('[data-testid="my-indicator"]')).toBeInTheDocument();
  });
});
