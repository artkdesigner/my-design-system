import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('рисует настоящую кнопку, а не div', () => {
    render(<Button>Отправить</Button>);
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeInTheDocument();
  });

  it('по умолчанию берёт вид accent и размер l', () => {
    render(<Button>Метка</Button>);
    const button = screen.getByRole('button');
    expect(button.dataset.view).toBe('accent');
    expect(button.dataset.size).toBe('l');
  });

  it('переносит размер в data-атрибут, а не в класс', () => {
    render(<Button size="s">Метка</Button>);
    expect(screen.getByRole('button').dataset.size).toBe('s');
  });

  it('считает кнопку иконочной, когда текста нет', () => {
    render(<Button iconLeft={<svg />} aria-label="Закрыть" />);
    expect(screen.getByRole('button').dataset.iconOnly).toBe('true');
  });

  it('не считает иконочной кнопку с текстом и иконкой', () => {
    render(<Button iconLeft={<svg />}>Сохранить</Button>);
    expect(screen.getByRole('button').dataset.iconOnly).toBeUndefined();
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Жми</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('не вызывает обработчик, когда недоступна', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Жми
      </Button>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('пропускает наружу произвольные атрибуты кнопки', () => {
    render(<Button type="submit">Отправить</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('несёт класс ds-interactive — на него завязаны селекторы состояний', () => {
    render(<Button>Метка</Button>);
    expect(screen.getByRole('button')).toHaveClass('ds-interactive');
  });

  it('не помечает себя акцентной подложкой', () => {
    // Пометка data-on-accent на интерактивном элементе не работает:
    // переизлучение в .ds-interactive:* перебивает её по специфичности.
    // Цвет подписи на заливке берётся из --state-text-on-accent, см. CSS.
    render(<Button view="accent">Метка</Button>);
    expect(screen.getByRole('button').dataset.onAccent).toBeUndefined();
  });

  it('переводит опасное действие на тон сообщения об ошибке', () => {
    // Опасность в дизайн-системе выражена не отдельными токенами кнопки,
    // а режимом коллекции сообщений — тем же, что у сообщений об ошибке.
    render(<Button danger>Удалить</Button>);
    expect(screen.getByRole('button').dataset.message).toBe('error');
  });
});
