import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const options = [
  { value: 'ru', label: 'Россия' },
  { value: 'by', label: 'Беларусь' },
  { value: 'kz', label: 'Казахстан' }
];

describe('Select', () => {
  it('список закрыт по умолчанию', () => {
    render(<Select label="Страна" options={options} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('клик по полю открывает список со всеми вариантами', async () => {
    render(<Select label="Страна" options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('повторный клик закрывает список', async () => {
    render(<Select label="Страна" options={options} />);
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('без выбора показывает только крупную подпись, без значения', () => {
    render(<Select label="Страна" options={options} />);
    expect(screen.getByText('Страна')).toBeInTheDocument();
    expect(screen.queryByText('Россия')).not.toBeInTheDocument();
  });

  it('клик по варианту вызывает onChange значением опции, закрывает список и показывает её подпись', async () => {
    const onChange = vi.fn();
    render(<Select label="Страна" options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Казахстан' }));
    expect(onChange).toHaveBeenCalledWith('kz');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByText('Казахстан')).toBeInTheDocument();
  });

  it('без onChange работает неуправляемо: выбор остаётся в поле', async () => {
    render(<Select label="Страна" options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Беларусь' }));
    expect(screen.getByText('Беларусь')).toBeInTheDocument();
  });

  it('defaultValue показывает подпись соответствующей опции сразу', () => {
    render(<Select label="Страна" options={options} defaultValue="by" />);
    expect(screen.getByText('Беларусь')).toBeInTheDocument();
  });

  it('текущий выбор отмечен в списке галочкой', async () => {
    render(<Select label="Страна" options={options} defaultValue="by" />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Беларусь' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Россия' })).toHaveAttribute('aria-selected', 'false');
  });

  it('стрелки перемещают подсветку, Enter выбирает подсвеченный вариант', async () => {
    const onChange = vi.fn();
    render(<Select label="Страна" options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('by');
  });

  it('стрелка вниз на закрытом поле открывает список', async () => {
    render(<Select label="Страна" options={options} />);
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('Escape закрывает список, не меняя выбор', async () => {
    render(<Select label="Страна" options={options} defaultValue="ru" />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByText('Россия')).toBeInTheDocument();
  });

  it('disabled не открывает список по клику', async () => {
    render(<Select label="Страна" options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('alert показывает alertText, как у Input', () => {
    render(<Select label="Страна" options={options} alert="error" alertText="Выберите страну" />);
    expect(screen.getByText('Выберите страну')).toBeInTheDocument();
  });

  it('поле — комбобокс со ссылкой на список через aria-controls', async () => {
    render(<Select label="Страна" options={options} />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger.getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id);
  });
});
