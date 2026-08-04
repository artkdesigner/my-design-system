import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PickerButton } from './PickerButton';
import { OptionListCell } from '../OptionListCell';

describe('PickerButton', () => {
  it('без label рисует компактную кнопку с доступным именем по умолчанию', () => {
    render(<PickerButton />);
    expect(screen.getByRole('button', { name: 'Открыть меню' })).toBeInTheDocument();
  });

  it('свой triggerLabel переопределяет имя по умолчанию', () => {
    render(<PickerButton triggerLabel="Действия со строкой" />);
    expect(screen.getByRole('button', { name: 'Действия со строкой' })).toBeInTheDocument();
  });

  it('с label рисует подпись вместо доступного имени', () => {
    render(<PickerButton label="Сортировка" />);
    expect(screen.getByRole('button', { name: 'Сортировка' })).toBeInTheDocument();
  });

  it('несёт aria-haspopup и aria-controls, изначально закрыта', () => {
    render(<PickerButton label="Сортировка" />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls');
  });

  it('клик по кнопке открывает карточку с переданным содержимым', async () => {
    render(
      <PickerButton label="Сортировка">
        <OptionListCell label="По дате" />
        <OptionListCell label="По имени" />
      </PickerButton>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Сортировка' }));
    expect(screen.getByRole('button', { name: 'Сортировка' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('По дате')).toBeInTheDocument();
    expect(screen.getByText('По имени')).toBeInTheDocument();
  });

  it('повторный клик закрывает карточку', async () => {
    render(
      <PickerButton label="Сортировка">
        <OptionListCell label="По дате" />
      </PickerButton>
    );
    const trigger = screen.getByRole('button', { name: 'Сортировка' });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('По дате')).not.toBeInTheDocument();
  });

  it('закрытую карточку не рисует вовсе', () => {
    render(
      <PickerButton label="Сортировка">
        <OptionListCell label="По дате" />
      </PickerButton>
    );
    expect(screen.queryByText('По дате')).not.toBeInTheDocument();
  });

  it('Escape закрывает открытую карточку', async () => {
    render(<PickerButton label="Сортировка" />);
    const trigger = screen.getByRole('button', { name: 'Сортировка' });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('потеря фокуса кнопкой закрывает карточку', async () => {
    render(
      <>
        <PickerButton label="Сортировка" />
        <button>Соседний элемент</button>
      </>
    );
    const trigger = screen.getByRole('button', { name: 'Сортировка' });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Соседний элемент' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('disabled не даёт открыть карточку', async () => {
    render(<PickerButton label="Сортировка" disabled />);
    const trigger = screen.getByRole('button', { name: 'Сортировка' });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('клик по содержимому карточки не гасится мышью раньше своего onClick', async () => {
    const onSelect = vi.fn();
    render(
      <PickerButton label="Сортировка">
        <OptionListCell label="По дате" onClick={onSelect} />
      </PickerButton>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Сортировка' }));
    await userEvent.click(screen.getByText('По дате'));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
