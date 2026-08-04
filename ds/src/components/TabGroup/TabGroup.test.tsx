import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TabGroup } from './TabGroup';
import { Tab } from '../Tab';

describe('TabGroup', () => {
  it('рисует элемент с ролью tablist', () => {
    render(
      <TabGroup>
        <Tab active>Обзор</Tab>
        <Tab>История</Tab>
      </TabGroup>
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('не клонирует детей и не хранит активную вкладку сама', () => {
    render(
      <TabGroup>
        <Tab active>Обзор</Tab>
        <Tab>История</Tab>
      </TabGroup>
    );
    expect(screen.getByRole('tab', { name: 'Обзор' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'История' })).toHaveAttribute('aria-selected', 'false');
  });

  it('переносит size в data-атрибут', () => {
    render(<TabGroup size="s" />);
    expect(screen.getByRole('tablist').dataset.size).toBe('s');
  });

  it('по умолчанию берёт размер l', () => {
    render(<TabGroup />);
    expect(screen.getByRole('tablist').dataset.size).toBe('l');
  });
});
