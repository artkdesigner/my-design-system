import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';
import { ICONS } from '../Icon/icons.generated';

describe('StatusBadge', () => {
  it('по умолчанию рисует positiveCheck: иконка check, тон message', () => {
    const { container } = render(<StatusBadge />);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.dataset.tone).toBe('message');
    expect(badge.dataset.message).toBe('success');
    expect(container.querySelector('path')).toHaveAttribute('d', ICONS.check.d);
  });

  it('negativeCross: иконка x-03, статус error', () => {
    const { container } = render(<StatusBadge type="negativeCross" />);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.dataset.message).toBe('error');
    expect(container.querySelector('path')).toHaveAttribute('d', ICONS['x-03'].d);
  });

  it('neutralCross: та же иконка x-03, но без статуса — серый тон neutral', () => {
    const { container } = render(<StatusBadge type="neutralCross" />);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.dataset.tone).toBe('neutral');
    expect(badge.dataset.message).toBeUndefined();
    expect(container.querySelector('path')).toHaveAttribute('d', ICONS['x-03'].d);
  });

  it('warningAlert и negativeAlert используют одну иконку exclamation-mark, разные статусы', () => {
    const { container: warning } = render(<StatusBadge type="warningAlert" />);
    const { container: negative } = render(<StatusBadge type="negativeAlert" />);
    expect((warning.firstElementChild as HTMLElement).dataset.message).toBe('warning');
    expect((negative.firstElementChild as HTMLElement).dataset.message).toBe('error');
    expect(warning.querySelector('path')).toHaveAttribute('d', ICONS['exclamation-mark'].d);
    expect(negative.querySelector('path')).toHaveAttribute('d', ICONS['exclamation-mark'].d);
  });

  it('infoNeutral без статуса, infoAccent со статусом info — общая иконка information', () => {
    const { container: neutral } = render(<StatusBadge type="infoNeutral" />);
    const { container: accent } = render(<StatusBadge type="infoAccent" />);
    expect((neutral.firstElementChild as HTMLElement).dataset.tone).toBe('neutral');
    expect((accent.firstElementChild as HTMLElement).dataset.message).toBe('info');
    expect(neutral.querySelector('path')).toHaveAttribute('d', ICONS.information.d);
    expect(accent.querySelector('path')).toHaveAttribute('d', ICONS.information.d);
  });

  it('operation: иконка clock-02, серый тон neutral', () => {
    const { container } = render(<StatusBadge type="operation" />);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.dataset.tone).toBe('neutral');
    expect(container.querySelector('path')).toHaveAttribute('d', ICONS['clock-02'].d);
  });

  it('stop: иконка stop, статус error', () => {
    const { container } = render(<StatusBadge type="stop" />);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.dataset.message).toBe('error');
    expect(container.querySelector('path')).toHaveAttribute('d', ICONS.stop.d);
  });

  it('несёт data-on-accent — так element-icon-primary красится в белый', () => {
    const { container } = render(<StatusBadge />);
    expect((container.firstElementChild as HTMLElement).dataset.onAccent).toBe('true');
  });

  it('переносит size в data-атрибут', () => {
    const { container } = render(<StatusBadge size="s" />);
    expect((container.firstElementChild as HTMLElement).dataset.size).toBe('s');
  });

  it('иконка скрыта от читалок экрана как декоративная', () => {
    const { container } = render(<StatusBadge />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('пропускает наружу произвольные атрибуты обёртки', () => {
    const { container } = render(<StatusBadge data-testid="my-badge" />);
    expect(container.querySelector('[data-testid="my-badge"]')).toBeInTheDocument();
  });
});
