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
      <Button ghost message="error">
        Удалить
      </Button>
    );
    expect(screen.getByRole('button').dataset.onAccent).toBe('true');
  });

  it('ставит тон сообщения на саму кнопку', () => {
    // Тон обязан быть на самом элементе, а не на контейнере. Проверено на
    // живом CSS: тон с контейнера переживает покой, но под наведением
    // сбрасывается в info — переизлучение слоя сообщений в .ds-interactive:hover
    // объявляет его умолчательный режим. Составные селекторы спасают только
    // когда режим стоит на том же элементе.
    render(<Button message="error">Удалить</Button>);
    expect(screen.getByRole('button').dataset.message).toBe('error');
  });

  it('принимает любой из четырёх тонов', () => {
    render(<Button message="success">Готово</Button>);
    expect(screen.getByRole('button').dataset.message).toBe('success');
  });

  it('без пропа message режима сообщения не включает', () => {
    render(<Button>Сохранить</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-message');
  });

  it('не заводит второго атрибута под тот же признак', () => {
    // Раньше эмитилось два: data-danger для стилей и data-message для слоя
    // токенов. Один признак в двух местах — лишний повод им разойтись.
    render(<Button message="error">Удалить</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-danger');
  });

  it('в состоянии загрузки не рисует лейбл и аддоны', () => {
    render(
      <Button loading iconLeft={<svg />}>
        Отправить
      </Button>
    );
    expect(screen.queryByText('Отправить')).not.toBeInTheDocument();
  });

  it('в состоянии загрузки не вызывает обработчик клика', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Отправить
      </Button>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('в состоянии загрузки не ставит HTML disabled', () => {
    // Иначе фон красится в серый через :disabled в state.css — а по макету
    // (узлы 468:6501/478:12529/478:12621) заливка вида под Loading не меняется.
    render(<Button loading>Отправить</Button>);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('помечает состояние загрузки для доступности', () => {
    render(<Button loading>Отправить</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
