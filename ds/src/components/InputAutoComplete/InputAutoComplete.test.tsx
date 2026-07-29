import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputAutoComplete } from './InputAutoComplete';

const options = [
  { value: 'ru', label: 'Россия' },
  { value: 'by', label: 'Беларусь' },
  { value: 'kz', label: 'Казахстан' }
];

describe('InputAutoComplete', () => {
  it('список закрыт, пока поле не в фокусе', () => {
    render(<InputAutoComplete label="Страна" options={options} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('фокус открывает список со всеми вариантами', async () => {
    render(<InputAutoComplete label="Страна" options={options} />);
    await userEvent.click(screen.getByLabelText('Страна'));
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('ввод текста фильтрует список подстрокой без учёта регистра', async () => {
    render(<InputAutoComplete label="Страна" options={options} />);
    const input = screen.getByLabelText('Страна');
    await userEvent.click(input);
    fireEvent.change(input, { target: { value: 'бел' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'Беларусь' })).toBeInTheDocument();
  });

  it('список прячется, если ни один вариант не подошёл', async () => {
    render(<InputAutoComplete label="Страна" options={options} />);
    const input = screen.getByLabelText('Страна');
    await userEvent.click(input);
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('клик по варианту подставляет его в поле, вызывает onChange и закрывает список', async () => {
    const onChange = vi.fn();
    render(<InputAutoComplete label="Страна" options={options} onChange={onChange} />);
    const input = screen.getByLabelText('Страна');
    await userEvent.click(input);
    await userEvent.click(screen.getByRole('option', { name: 'Казахстан' }));
    expect(onChange).toHaveBeenCalledWith('Казахстан');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('без onChange работает неуправляемо: значение остаётся в поле', async () => {
    render(<InputAutoComplete label="Страна" options={options} />);
    const input = screen.getByLabelText('Страна');
    await userEvent.click(input);
    await userEvent.click(screen.getByRole('option', { name: 'Беларусь' }));
    expect(input).toHaveValue('Беларусь');
  });

  it('стрелки перемещают подсветку, Enter выбирает подсвеченный вариант', async () => {
    const onChange = vi.fn();
    render(<InputAutoComplete label="Страна" options={options} onChange={onChange} />);
    const input = screen.getByLabelText('Страна');
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('Беларусь');
  });

  it('Escape закрывает список, не меняя значение', async () => {
    render(<InputAutoComplete label="Страна" options={options} defaultValue="Ро" />);
    const input = screen.getByLabelText('Страна');
    await userEvent.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveValue('Ро');
  });

  it('disabled не открывает список по фокусу', () => {
    render(<InputAutoComplete label="Страна" options={options} disabled />);
    expect(screen.getByLabelText('Страна')).toBeDisabled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('alert показывает alertText, как у Input', () => {
    render(<InputAutoComplete label="Страна" options={options} alert alertText="Введите страну из списка" />);
    expect(screen.getByText('Введите страну из списка')).toBeInTheDocument();
  });

  it('поле — комбобокс, ссылается на список через aria-controls', async () => {
    render(<InputAutoComplete label="Страна" options={options} />);
    const input = screen.getByLabelText('Страна');
    expect(input).toHaveAttribute('role', 'combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input.getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id);
  });
});
