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

  it('включает на себе режим onAccent — так же, как компонент в Figma', () => {
    // Сверено по двум образцам из макета: и у залитой кнопки, и у прозрачной
    // опасной значения токенов совпадают с макетом только в режиме onAccent
    // (element_text_primary = #ffffff, element_border_message_secondary =
    // #cc2929). Без него получаются другие значения тех же токенов.
    render(<Button view="accent">Метка</Button>);
    expect(screen.getByRole('button').dataset.onAccent).toBe('true');
  });

  it('включает onAccent и на прозрачном виде — режим у кнопки один на все виды', () => {
    render(
      <Button ghost danger>
        Удалить
      </Button>
    );
    expect(screen.getByRole('button').dataset.onAccent).toBe('true');
  });

  it('переводит опасное действие на тон сообщения об ошибке', () => {
    // Опасность в дизайн-системе выражена не отдельными токенами кнопки,
    // а режимом коллекции сообщений — тем же, что у сообщений об ошибке.
    render(<Button danger>Удалить</Button>);
    expect(screen.getByRole('button').dataset.message).toBe('error');
  });
});
