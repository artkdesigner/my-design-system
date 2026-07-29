import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectWithTags } from './SelectWithTags';

const options = [
  { value: 'ru', label: 'Россия' },
  { value: 'by', label: 'Беларусь' },
  { value: 'kz', label: 'Казахстан' }
];

describe('SelectWithTags', () => {
  it('список закрыт по умолчанию', () => {
    render(<SelectWithTags label="Страны" options={options} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('клик по полю открывает список со всеми вариантами', async () => {
    render(<SelectWithTags label="Страны" options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('без выбора показывает только крупную подпись, без тегов', () => {
    render(<SelectWithTags label="Страны" options={options} />);
    expect(screen.getByText('Страны')).toBeInTheDocument();
    expect(screen.queryByText('Россия')).not.toBeInTheDocument();
  });

  it('клик по варианту добавляет тег и вызывает onChange, список остаётся открытым', async () => {
    const onChange = vi.fn();
    render(<SelectWithTags label="Страны" options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Казахстан' }));
    expect(onChange).toHaveBeenCalledWith(['kz']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('повторный клик по уже выбранному варианту убирает тег', async () => {
    const onChange = vi.fn();
    render(<SelectWithTags label="Страны" options={options} defaultValue={['kz']} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Казахстан' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('без onChange работает неуправляемо: выбранные теги остаются в поле', async () => {
    render(<SelectWithTags label="Страны" options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Беларусь' }));
    expect(screen.getByRole('button', { name: 'Беларусь' })).toBeInTheDocument();
  });

  it('defaultValue сразу показывает теги вместо подписи', () => {
    render(<SelectWithTags label="Страны" options={options} defaultValue={['ru', 'by']} />);
    expect(screen.queryByText('Страны')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Россия' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Беларусь' })).toBeInTheDocument();
  });

  it('клик по крестику тега убирает его, не открывая список заново', async () => {
    const onChange = vi.fn();
    render(<SelectWithTags label="Страны" options={options} defaultValue={['ru', 'by']} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Россия' }));
    expect(onChange).toHaveBeenCalledWith(['by']);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('текущий выбор отмечен в списке галочкой', async () => {
    render(<SelectWithTags label="Страны" options={options} defaultValue={['by']} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Беларусь' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Россия' })).toHaveAttribute('aria-selected', 'false');
  });

  it('стрелки перемещают подсветку, Enter переключает подсвеченный вариант', async () => {
    const onChange = vi.fn();
    render(<SelectWithTags label="Страны" options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith(['by']);
  });

  it('Escape закрывает список, не меняя выбор', async () => {
    render(<SelectWithTags label="Страны" options={options} defaultValue={['ru']} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Россия' })).toBeInTheDocument();
  });

  it('disabled не открывает список по клику', async () => {
    render(<SelectWithTags label="Страны" options={options} disabled />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('alert показывает alertText', () => {
    render(<SelectWithTags label="Страны" options={options} alert alertText="Выберите страну" />);
    expect(screen.getByText('Выберите страну')).toBeInTheDocument();
  });

  it('поле — комбобокс со ссылкой на список через aria-controls', async () => {
    render(<SelectWithTags label="Страны" options={options} />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger.getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id);
  });

  it('maxVisibleTags сворачивает лишние теги в «Ещё N»', () => {
    render(<SelectWithTags label="Страны" options={options} defaultValue={['ru', 'by', 'kz']} maxVisibleTags={1} />);
    expect(screen.getByRole('button', { name: 'Россия' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Беларусь' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ещё 2' })).toBeInTheDocument();
  });
});
