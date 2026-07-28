import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TagGroup } from './TagGroup';
import { Tag } from '../Tag';

describe('TagGroup', () => {
  it('рисует role="group", подписанную заголовком', () => {
    render(
      <TagGroup title="Категории">
        <Tag label="Первая" />
        <Tag label="Вторая" />
      </TagGroup>
    );
    expect(screen.getByRole('group', { name: 'Категории' })).toBeInTheDocument();
  });

  it('рисует все дочерние теги', () => {
    render(
      <TagGroup title="Категории">
        <Tag label="Первая" />
        <Tag label="Вторая" />
      </TagGroup>
    );
    expect(screen.getByRole('button', { name: 'Первая' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Вторая' })).toBeInTheDocument();
  });

  it('без заголовка не рисует блок заголовка', () => {
    const { container } = render(
      <TagGroup>
        <Tag label="Первая" />
      </TagGroup>
    );
    expect(container.querySelector('[id$="-title"]')).not.toBeInTheDocument();
  });

  it('рисует подсказку', () => {
    render(
      <TagGroup title="Категории" hint="Можно выбрать несколько">
        <Tag label="Первая" />
      </TagGroup>
    );
    expect(screen.getByText('Можно выбрать несколько')).toBeInTheDocument();
  });

  it('в состоянии alert показывает alertText вместо hint', () => {
    render(
      <TagGroup title="Категории" hint="Обычная подсказка" alert alertText="Выберите хотя бы одну категорию">
        <Tag label="Первая" />
      </TagGroup>
    );
    expect(screen.getByText('Выберите хотя бы одну категорию')).toBeInTheDocument();
    expect(screen.queryByText('Обычная подсказка')).not.toBeInTheDocument();
  });

  it('переносит size в data-атрибут обёртки', () => {
    const { container } = render(
      <TagGroup title="Категории" size="s">
        <Tag label="Первая" />
      </TagGroup>
    );
    expect(container.firstChild).toHaveAttribute('data-size', 's');
  });
});
