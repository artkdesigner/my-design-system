import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextButton } from './TextButton';

describe('TextButton', () => {
  it('рисует настоящую кнопку, а не div', () => {
    render(<TextButton>Отправить</TextButton>);
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeInTheDocument();
  });

  it('по умолчанию берёт вид accent и размер l', () => {
    render(<TextButton>Метка</TextButton>);
    const button = screen.getByRole('button');
    expect(button.dataset.view).toBe('accent');
    expect(button.dataset.size).toBe('l');
  });

  it('переносит размер в data-атрибут', () => {
    render(<TextButton size="s">Метка</TextButton>);
    expect(screen.getByRole('button').dataset.size).toBe('s');
  });

  it('несёт класс ds-interactive', () => {
    render(<TextButton>Метка</TextButton>);
    expect(screen.getByRole('button')).toHaveClass('ds-interactive');
  });

  it('никогда не заливается — режима onAccent без тона не включает', () => {
    // В макете у TextButton нет залитого состояния вообще: это всегда
    // прозрачная надпись. Режим onAccent, который у Button включает заливка,
    // здесь не нужен без тона.
    render(<TextButton view="accent">Метка</TextButton>);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-on-accent');
  });

  it('ставит тон сообщения на саму кнопку', () => {
    render(<TextButton message="error">Удалить</TextButton>);
    expect(screen.getByRole('button').dataset.message).toBe('error');
  });

  it('без пропа message режима сообщения не включает', () => {
    render(<TextButton>Сохранить</TextButton>);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-message');
  });

  it('показывает левую и правую иконку', () => {
    render(
      <TextButton addonLeft={<svg data-testid="left" />} addonRight={<svg data-testid="right" />}>
        Метка
      </TextButton>
    );
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('без addonLeft/addonRight не рисует слоты вовсе', () => {
    const { container } = render(<TextButton>Метка</TextButton>);
    expect(container.querySelectorAll('span')).toHaveLength(1);
  });

  it('меняет содержимое аддона при повторном рендере с другой иконкой', () => {
    const { rerender } = render(<TextButton addonLeft={<svg data-testid="icon-a" />}>Метка</TextButton>);
    expect(screen.getByTestId('icon-a')).toBeInTheDocument();

    rerender(<TextButton addonLeft={<svg data-testid="icon-b" />}>Метка</TextButton>);
    expect(screen.queryByTestId('icon-a')).not.toBeInTheDocument();
    expect(screen.getByTestId('icon-b')).toBeInTheDocument();
  });

  it('включает аддон при повторном рендере, если раньше его не было', () => {
    const { rerender } = render(<TextButton>Метка</TextButton>);
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();

    rerender(<TextButton addonLeft={<svg data-testid="icon" />}>Метка</TextButton>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<TextButton onClick={onClick}>Жми</TextButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('не вызывает обработчик, когда недоступна', async () => {
    const onClick = vi.fn();
    render(
      <TextButton onClick={onClick} disabled>
        Жми
      </TextButton>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('пропускает наружу произвольные атрибуты кнопки', () => {
    render(<TextButton type="submit">Отправить</TextButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
