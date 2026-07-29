import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SegmentedControl } from './SegmentedControl';
import { Segment } from '../Segment';

describe('SegmentedControl', () => {
  it('рисует role="radiogroup"', () => {
    render(
      <SegmentedControl>
        <Segment selected>Первый</Segment>
        <Segment>Второй</Segment>
      </SegmentedControl>
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('рисует все дочерние сегменты', () => {
    render(
      <SegmentedControl>
        <Segment selected>Первый</Segment>
        <Segment>Второй</Segment>
      </SegmentedControl>
    );
    expect(screen.getByRole('radio', { name: 'Первый' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Второй' })).toBeInTheDocument();
  });

  it('по умолчанию не адаптивна и берёт размер l', () => {
    const { container } = render(
      <SegmentedControl>
        <Segment>Первый</Segment>
      </SegmentedControl>
    );
    expect(container.firstChild).not.toHaveAttribute('data-adaptive');
    expect(container.firstChild).toHaveAttribute('data-size', 'l');
  });

  it('adaptive переносится в data-атрибут', () => {
    const { container } = render(
      <SegmentedControl adaptive>
        <Segment>Первый</Segment>
      </SegmentedControl>
    );
    expect(container.firstChild).toHaveAttribute('data-adaptive', 'true');
  });

  it('переносит size в data-атрибут', () => {
    const { container } = render(
      <SegmentedControl size="s">
        <Segment>Первый</Segment>
      </SegmentedControl>
    );
    expect(container.firstChild).toHaveAttribute('data-size', 's');
  });

  it('не переключает сегменты сама — selected приходит снаружи', () => {
    render(
      <SegmentedControl>
        <Segment selected>Первый</Segment>
        <Segment>Второй</Segment>
      </SegmentedControl>
    );
    expect(screen.getByRole('radio', { name: 'Первый' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Второй' })).toHaveAttribute('aria-checked', 'false');
  });
});
