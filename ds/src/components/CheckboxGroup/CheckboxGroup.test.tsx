import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CheckboxGroup } from './CheckboxGroup';
import { Checkbox } from '../Checkbox';

describe('CheckboxGroup', () => {
  it('рисует role="group", подписанную заголовком', () => {
    render(
      <CheckboxGroup title="Уведомления">
        <Checkbox label="Почта" />
        <Checkbox label="SMS" />
      </CheckboxGroup>
    );
    expect(screen.getByRole('group', { name: 'Уведомления' })).toBeInTheDocument();
  });

  it('рисует все дочерние чекбоксы', () => {
    render(
      <CheckboxGroup title="Уведомления">
        <Checkbox label="Почта" />
        <Checkbox label="SMS" />
      </CheckboxGroup>
    );
    expect(screen.getByRole('checkbox', { name: 'Почта' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'SMS' })).toBeInTheDocument();
  });

  it('без заголовка не рисует блок заголовка', () => {
    const { container } = render(
      <CheckboxGroup>
        <Checkbox label="Почта" />
      </CheckboxGroup>
    );
    expect(container.querySelector('[id$="-title"]')).not.toBeInTheDocument();
  });

  it('рисует подсказку', () => {
    render(
      <CheckboxGroup title="Уведомления" hint="Выберите хотя бы один канал">
        <Checkbox label="Почта" />
      </CheckboxGroup>
    );
    expect(screen.getByText('Выберите хотя бы один канал')).toBeInTheDocument();
  });

  it('в состоянии alert показывает alertText вместо hint', () => {
    render(
      <CheckboxGroup title="Уведомления" hint="Обычная подсказка" alert alertText="Выберите хотя бы один канал">
        <Checkbox label="Почта" />
      </CheckboxGroup>
    );
    expect(screen.getByText('Выберите хотя бы один канал')).toBeInTheDocument();
    expect(screen.queryByText('Обычная подсказка')).not.toBeInTheDocument();
  });

  it('переносит size в data-атрибут обёртки', () => {
    const { container } = render(
      <CheckboxGroup title="Уведомления" size="s">
        <Checkbox label="Почта" />
      </CheckboxGroup>
    );
    expect(container.firstChild).toHaveAttribute('data-size', 's');
  });

  it('по умолчанию direction horizontal', () => {
    const { container } = render(
      <CheckboxGroup title="Уведомления">
        <Checkbox label="Почта" />
      </CheckboxGroup>
    );
    const items = (container.firstChild as HTMLElement).querySelector('[data-direction]');
    expect(items).toHaveAttribute('data-direction', 'horizontal');
  });

  it('переносит direction в data-атрибут ряда пунктов', () => {
    const { container } = render(
      <CheckboxGroup title="Уведомления" direction="vertical">
        <Checkbox label="Почта" />
      </CheckboxGroup>
    );
    const items = (container.firstChild as HTMLElement).querySelector('[data-direction]');
    expect(items).toHaveAttribute('data-direction', 'vertical');
  });
});
