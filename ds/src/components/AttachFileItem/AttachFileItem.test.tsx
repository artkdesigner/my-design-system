import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AttachFileItem } from './AttachFileItem';

describe('AttachFileItem', () => {
  it('noFile: рисует label и moreLabel', () => {
    render(<AttachFileItem label="docx, xls, pdf" moreLabel="Ещё 3" />);
    expect(screen.getByText('docx, xls, pdf')).toBeInTheDocument();
    expect(screen.getByText('Ещё 3')).toBeInTheDocument();
  });

  it('noFile: без moreLabel кнопка-ссылка не рисуется', () => {
    render(<AttachFileItem label="docx, xls, pdf" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('loading: рисует имя.расширение и прогресс', () => {
    const { container } = render(<AttachFileItem state="loading" name="Файл" format="docx" progress={40} />);
    expect(container.textContent).toContain('Файл.docx');
    expect(container.querySelector('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '40');
  });

  it('done: без прогресс-бара', () => {
    const { container } = render(<AttachFileItem state="done" name="Файл" format="docx" onRemove={() => {}} />);
    expect(container.querySelector('[role="progressbar"]')).not.toBeInTheDocument();
  });

  it('loading/done: onRemove зовёт колбэк по клику на крестик', () => {
    const onRemove = vi.fn();
    render(<AttachFileItem state="done" name="Файл" format="docx" onRemove={onRemove} />);
    screen.getByRole('button').click();
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('many: рисует manyLabel', () => {
    render(<AttachFileItem state="many" manyLabel="2 файла" onRemove={() => {}} />);
    expect(screen.getByText('2 файла')).toBeInTheDocument();
  });

  it('error: рисует errorText и переносит data-alert', () => {
    const { container } = render(<AttachFileItem state="error" errorText="Не получилось загрузить" />);
    expect(screen.getByText('Не получилось загрузить')).toBeInTheDocument();
    expect((container.firstElementChild as HTMLElement).dataset.alert).toBe('error');
  });

  it('переносит state и size в data-атрибуты', () => {
    const { container } = render(<AttachFileItem state="many" size="s" manyLabel="2 файла" />);
    const item = container.firstElementChild as HTMLElement;
    expect(item.dataset.state).toBe('many');
    expect(item.dataset.size).toBe('s');
  });
});
