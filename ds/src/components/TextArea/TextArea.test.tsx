import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  it('рисует настоящее многострочное поле, связанное с подписью', () => {
    render(<TextArea label="Комментарий" />);
    expect(screen.getByLabelText('Комментарий').tagName).toBe('TEXTAREA');
  });

  it('по умолчанию берёт размер l', () => {
    const { container } = render(<TextArea label="Комментарий" />);
    expect(container.firstChild).toHaveProperty('dataset.size', 'l');
  });

  it('пока поле пустое и не в фокусе, показывает подпись как плейсхолдер', () => {
    render(<TextArea label="Комментарий" />);
    expect(screen.getByLabelText('Комментарий')).toHaveAttribute('placeholder', 'Комментарий');
  });

  it('в фокусе меняет плейсхолдер на переданный проп', async () => {
    render(<TextArea label="Комментарий" placeholder="Расскажите подробнее" />);
    const textarea = screen.getByLabelText('Комментарий');
    await userEvent.click(textarea);
    expect(textarea).toHaveAttribute('placeholder', 'Расскажите подробнее');
  });

  it('при потере фокуса возвращает подпись на место плейсхолдера', async () => {
    render(<TextArea label="Комментарий" placeholder="Расскажите подробнее" />);
    const textarea = screen.getByLabelText('Комментарий');
    await userEvent.click(textarea);
    await userEvent.tab();
    expect(textarea).toHaveAttribute('placeholder', 'Комментарий');
  });

  it('всплывает подпись, когда появляется значение', async () => {
    const { container } = render(<TextArea label="Комментарий" />);
    await userEvent.type(screen.getByLabelText('Комментарий'), 'Текст');
    expect(container.firstChild).toHaveProperty('dataset.labelFloated', 'true');
  });

  it('всплывает подпись сразу, если значение задано изначально', () => {
    const { container } = render(<TextArea label="Комментарий" defaultValue="Текст" />);
    expect(container.firstChild).toHaveProperty('dataset.labelFloated', 'true');
  });

  it('не всплывает подпись в пустом неактивном поле', () => {
    const { container } = render(<TextArea label="Комментарий" />);
    expect(container.firstChild).not.toHaveProperty('dataset.labelFloated', 'true');
  });

  it('включает тон ошибки на обёртке, когда передан alert', () => {
    const { container } = render(<TextArea label="Комментарий" alert alertText="Заполните поле" />);
    expect(container.firstChild).toHaveProperty('dataset.alert', 'error');
    expect(screen.getByText('Заполните поле')).toBeInTheDocument();
  });

  it('без alert показывает обычную подсказку', () => {
    render(<TextArea label="Комментарий" hint="До 500 символов" />);
    expect(screen.getByText('До 500 символов')).toBeInTheDocument();
  });

  it('передаёт disabled в настоящее поле ввода', () => {
    render(<TextArea label="Комментарий" disabled />);
    expect(screen.getByLabelText('Комментарий')).toBeDisabled();
  });

  it('вызывает обработчик изменения значения', async () => {
    const onChange = vi.fn();
    render(<TextArea label="Комментарий" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Комментарий'), 'Т');
    expect(onChange).toHaveBeenCalled();
  });

  it('пропускает наружу произвольные атрибуты поля', () => {
    render(<TextArea label="Комментарий" name="feedback" />);
    expect(screen.getByLabelText('Комментарий')).toHaveAttribute('name', 'feedback');
  });

  it('переносит size в data-атрибут обёртки', () => {
    const { container } = render(<TextArea label="Комментарий" size="s" />);
    expect(container.firstChild).toHaveProperty('dataset.size', 's');
  });
});
