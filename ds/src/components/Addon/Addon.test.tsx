import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Addon } from './Addon';
import { ICONS } from '../Icon/icons.generated';

describe('Addon', () => {
  it('рисует содержимое внутри слота', () => {
    render(<Addon>{<svg data-testid="content" />}</Addon>);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('по умолчанию берёт размер l', () => {
    const { container } = render(<Addon>content</Addon>);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'l');
  });

  it('переносит размер в data-атрибут', () => {
    const { container } = render(<Addon size="s">content</Addon>);
    expect(container.firstElementChild).toHaveAttribute('data-size', 's');
  });

  it('не прячет себя от скринридера по умолчанию — внутри может быть интерактивный элемент', () => {
    const { container } = render(<Addon>content</Addon>);
    expect(container.firstElementChild).not.toHaveAttribute('aria-hidden');
  });

  it('пропускает наружу aria-hidden, когда вызывающий компонент помечает слот декоративным', () => {
    const { container } = render(<Addon aria-hidden="true">content</Addon>);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('добавляет собственный класс к переданному, а не заменяет его', () => {
    render(<Addon className="custom">content</Addon>);
    expect(screen.getByText('content')).toHaveClass('custom');
  });

  it('пропускает наружу произвольные атрибуты', () => {
    render(<Addon data-testid="my-addon">content</Addon>);
    expect(screen.getByTestId('my-addon')).toBeInTheDocument();
  });

  it('проп icon сам подставляет Icon нужного размера', () => {
    const { container } = render(<Addon icon="activity" size="m" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-size', 'm');
    expect(container.querySelector('path')).toHaveAttribute('d', ICONS.activity.d);
  });

  it('проп checkmark сам подставляет Checkmark и передаёт ему selected', () => {
    const { container } = render(<Addon checkmark size="s" />);
    const checkmark = container.querySelector('[data-selected]');
    expect(checkmark).toHaveAttribute('data-selected', 'true');
    expect(checkmark).toHaveAttribute('data-size', 's');
  });

  it('checkmark={false} всё равно рисует Checkmark, просто невыбранный', () => {
    const { container } = render(<Addon checkmark={false} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-selected]')).toHaveLength(0);
  });

  it('icon приоритетнее checkmark и children', () => {
    render(
      <Addon icon="activity" checkmark>
        <span data-testid="children">children</span>
      </Addon>
    );
    expect(screen.queryByTestId('children')).not.toBeInTheDocument();
  });

  it('без icon и checkmark рисует children как раньше', () => {
    render(<Addon>{<svg data-testid="content" />}</Addon>);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('проп text рисует текст и переключает форму слота на data-content="text"', () => {
    const { container } = render(<Addon text="kg" />);
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-content', 'text');
  });

  it('без text data-content отсутствует', () => {
    const { container } = render(<Addon icon="activity" />);
    expect(container.firstElementChild).not.toHaveAttribute('data-content');
  });

  it('icon и checkmark приоритетнее text', () => {
    render(<Addon icon="activity" text="kg" />);
    expect(screen.queryByText('kg')).not.toBeInTheDocument();
  });

  it('text приоритетнее children', () => {
    render(
      <Addon text="kg">
        <span data-testid="children">children</span>
      </Addon>
    );
    expect(screen.queryByTestId('children')).not.toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('проп checkboxItem сам подставляет CheckboxItem нужного размера', () => {
    const { container } = render(<Addon checkboxItem={{ state: 'checked', 'aria-label': 'Согласие' }} size="m" />);
    const item = screen.getByRole('checkbox');
    expect(item).toHaveAttribute('aria-checked', 'true');
    expect(item.dataset.size).toBe('m');
    expect(container.firstElementChild).not.toHaveAttribute('data-content');
  });

  it('проп radioItem сам подставляет RadioItem нужного размера', () => {
    render(<Addon radioItem={{ selected: true, 'aria-label': 'Вариант' }} size="s" />);
    const item = screen.getByRole('radio');
    expect(item).toHaveAttribute('aria-checked', 'true');
    expect(item.dataset.size).toBe('s');
  });

  it('проп statusBadge сам подставляет StatusBadge нужного размера', () => {
    const { container } = render(<Addon statusBadge={{ type: 'warningAlert' }} size="m" />);
    expect(container.querySelector('[data-message="warning"]')).toBeInTheDocument();
  });

  it('проп spinner сам подставляет Spinner нужного размера', () => {
    const { container } = render(<Addon spinner={{}} size="s" />);
    expect(container.querySelector('[data-size="s"][aria-hidden="true"]')).toBeInTheDocument();
  });

  it('проп indicator сам подставляет Indicator и переключает форму слота на data-content="indicator"', () => {
    const { container } = render(<Addon indicator={{ count: '99+' }} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-content', 'indicator');
  });

  it('checkboxItem приоритетнее radioItem/statusBadge/spinner/indicator/text/children', () => {
    render(
      <Addon
        checkboxItem={{ 'aria-label': 'Согласие' }}
        radioItem={{ 'aria-label': 'Вариант' }}
        statusBadge={{}}
        spinner={{}}
        indicator={{ count: '1' }}
        text="kg"
      >
        <span data-testid="children">children</span>
      </Addon>
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(screen.queryByText('kg')).not.toBeInTheDocument();
    expect(screen.queryByTestId('children')).not.toBeInTheDocument();
  });
});
