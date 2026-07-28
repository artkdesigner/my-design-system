import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RadioGroup } from './RadioGroup';
import { Radio } from '../Radio';

describe('RadioGroup', () => {
  it('рисует role="radiogroup", подписанную заголовком', () => {
    render(
      <RadioGroup title="Способ оплаты">
        <Radio label="Картой" />
        <Radio label="Наличными" />
      </RadioGroup>
    );
    expect(screen.getByRole('radiogroup', { name: 'Способ оплаты' })).toBeInTheDocument();
  });

  it('рисует все дочерние радиокнопки', () => {
    render(
      <RadioGroup title="Способ оплаты">
        <Radio label="Картой" />
        <Radio label="Наличными" />
      </RadioGroup>
    );
    expect(screen.getByRole('radio', { name: 'Картой' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Наличными' })).toBeInTheDocument();
  });

  it('без заголовка не рисует блок заголовка', () => {
    const { container } = render(
      <RadioGroup>
        <Radio label="Картой" />
      </RadioGroup>
    );
    expect(container.querySelector('[id$="-title"]')).not.toBeInTheDocument();
  });

  it('рисует подсказку', () => {
    render(
      <RadioGroup title="Способ оплаты" hint="Спишется после подтверждения заказа">
        <Radio label="Картой" />
      </RadioGroup>
    );
    expect(screen.getByText('Спишется после подтверждения заказа')).toBeInTheDocument();
  });

  it('в состоянии alert показывает alertText вместо hint', () => {
    render(
      <RadioGroup title="Способ оплаты" hint="Обычная подсказка" alert alertText="Выберите способ оплаты">
        <Radio label="Картой" />
      </RadioGroup>
    );
    expect(screen.getByText('Выберите способ оплаты')).toBeInTheDocument();
    expect(screen.queryByText('Обычная подсказка')).not.toBeInTheDocument();
  });

  it('переносит size в data-атрибут обёртки', () => {
    const { container } = render(
      <RadioGroup title="Способ оплаты" size="s">
        <Radio label="Картой" />
      </RadioGroup>
    );
    expect(container.firstChild).toHaveAttribute('data-size', 's');
  });

  it('по умолчанию direction horizontal', () => {
    const { container } = render(
      <RadioGroup title="Способ оплаты">
        <Radio label="Картой" />
      </RadioGroup>
    );
    const items = (container.firstChild as HTMLElement).querySelector('[data-direction]');
    expect(items).toHaveAttribute('data-direction', 'horizontal');
  });

  it('переносит direction в data-атрибут ряда пунктов', () => {
    const { container } = render(
      <RadioGroup title="Способ оплаты" direction="vertical">
        <Radio label="Картой" />
      </RadioGroup>
    );
    const items = (container.firstChild as HTMLElement).querySelector('[data-direction]');
    expect(items).toHaveAttribute('data-direction', 'vertical');
  });
});
