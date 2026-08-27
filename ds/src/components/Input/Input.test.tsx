import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('рисует настоящее поле ввода, связанное с подписью', () => {
    render(<Input label="Имя" />);
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
  });

  it('по умолчанию берёт размер l', () => {
    const { container } = render(<Input label="Имя" />);
    expect(container.firstChild).toHaveProperty('dataset.size', 'l');
  });

  it('пока поле пустое и не в фокусе, показывает подпись как плейсхолдер', () => {
    render(<Input label="Имя" />);
    expect(screen.getByLabelText('Имя')).toHaveAttribute('placeholder', 'Имя');
  });

  it('в фокусе меняет плейсхолдер на переданный проп', async () => {
    render(<Input label="Имя" placeholder="Введите имя" />);
    const input = screen.getByLabelText('Имя');
    await userEvent.click(input);
    expect(input).toHaveAttribute('placeholder', 'Введите имя');
  });

  it('при потере фокуса возвращает подпись на место плейсхолдера', async () => {
    render(<Input label="Имя" placeholder="Введите имя" />);
    const input = screen.getByLabelText('Имя');
    await userEvent.click(input);
    await userEvent.tab();
    expect(input).toHaveAttribute('placeholder', 'Имя');
  });

  it('всплывает подпись, когда появляется значение', async () => {
    const { container } = render(<Input label="Имя" />);
    const input = screen.getByLabelText('Имя');
    await userEvent.type(input, 'Аня');
    expect(container.firstChild).toHaveProperty('dataset.labelFloated', 'true');
  });

  it('всплывает подпись сразу, если значение задано изначально', () => {
    const { container } = render(<Input label="Имя" defaultValue="Аня" />);
    expect(container.firstChild).toHaveProperty('dataset.labelFloated', 'true');
  });

  it('не всплывает подпись в пустом неактивном поле', () => {
    const { container } = render(<Input label="Имя" />);
    expect(container.firstChild).not.toHaveProperty('dataset.labelFloated', 'true');
  });

  it('включает тон ошибки на обёртке, когда передан alert', () => {
    const { container } = render(<Input label="Имя" alert="error" alertText="Заполните поле" />);
    expect(container.firstChild).toHaveProperty('dataset.alert', 'error');
    expect(screen.getByText('Заполните поле')).toBeInTheDocument();
  });

  it('без alert показывает обычную подсказку', () => {
    render(<Input label="Имя" hint="Как в паспорте" />);
    expect(screen.getByText('Как в паспорте')).toBeInTheDocument();
  });

  it('передаёт disabled в настоящее поле ввода', () => {
    render(<Input label="Имя" disabled />);
    expect(screen.getByLabelText('Имя')).toBeDisabled();
  });

  it('вызывает обработчик изменения значения', async () => {
    const onChange = vi.fn();
    render(<Input label="Имя" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Имя'), 'А');
    expect(onChange).toHaveBeenCalled();
  });

  it('пропускает наружу произвольные атрибуты поля', () => {
    render(<Input label="Имя" name="firstName" />);
    expect(screen.getByLabelText('Имя')).toHaveAttribute('name', 'firstName');
  });

  it('рисует переданный stepper и не рисует слот, если его нет', () => {
    const { container, rerender } = render(<Input label="Имя" stepper={<button data-testid="stepper" />} />);
    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    rerender(<Input label="Имя" />);
    expect(container.querySelector('[data-testid="stepper"]')).not.toBeInTheDocument();
  });
});
