import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tab } from './Tab';

describe('Tab', () => {
  it('рисует элемент с ролью tab и подписью', () => {
    render(<Tab>Обзор</Tab>);
    expect(screen.getByRole('tab', { name: 'Обзор' })).toBeInTheDocument();
  });

  it('по умолчанию не активна и берёт размер l', () => {
    render(<Tab>Обзор</Tab>);
    const tab = screen.getByRole('tab');
    expect(tab).toHaveAttribute('aria-selected', 'false');
    expect(tab.dataset.size).toBe('l');
  });

  it('active даёт aria-selected=true и data-active', () => {
    render(<Tab active>Обзор</Tab>);
    const tab = screen.getByRole('tab');
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('data-active');
  });

  it('без icon не рисует Addon', () => {
    const { container } = render(<Tab>Обзор</Tab>);
    expect(container.querySelectorAll('span').length).toBe(1);
  });

  it('с icon рисует переданное содержимое', () => {
    render(<Tab icon={<svg data-testid="icon" />}>Обзор</Tab>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('несёт класс ds-interactive', () => {
    render(<Tab>Обзор</Tab>);
    expect(screen.getByRole('tab')).toHaveClass('ds-interactive');
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<Tab onClick={onClick}>Обзор</Tab>);
    await userEvent.click(screen.getByRole('tab'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('не вызывает обработчик, когда недоступна', async () => {
    const onClick = vi.fn();
    render(
      <Tab onClick={onClick} disabled>
        Обзор
      </Tab>
    );
    await userEvent.click(screen.getByRole('tab'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('сама ничего не переключает — active приходит снаружи', async () => {
    const onClick = vi.fn();
    render(
      <Tab active={false} onClick={onClick}>
        Обзор
      </Tab>
    );
    await userEvent.click(screen.getByRole('tab'));
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'false');
  });
});
