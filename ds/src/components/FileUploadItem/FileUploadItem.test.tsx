import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FileUploadItem } from './FileUploadItem';

describe('FileUploadItem', () => {
  it('default: показывает download и remove, но не retry', () => {
    render(<FileUploadItem name="Name" format="format" onDownload={() => {}} onRemove={() => {}} onRetry={() => {}} />);
    expect(screen.getByRole('button', { name: 'Скачать файл' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить файл' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Повторить загрузку' })).not.toBeInTheDocument();
  });

  it('error: показывает retry и remove, но не download', () => {
    render(
      <FileUploadItem
        name="Name"
        state="error"
        errorText1="Ошибка"
        onDownload={() => {}}
        onRemove={() => {}}
        onRetry={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Повторить загрузку' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить файл' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Скачать файл' })).not.toBeInTheDocument();
    expect(screen.getByText('Ошибка')).toBeInTheDocument();
  });

  it('deleted: показывает только retry', () => {
    render(<FileUploadItem name="Name" state="deleted" onDownload={() => {}} onRemove={() => {}} onRetry={() => {}} />);
    expect(screen.getByRole('button', { name: 'Повторить загрузку' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Удалить файл' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Скачать файл' })).not.toBeInTheDocument();
  });

  it('deleted: retry остаётся рабочей кнопкой (не HTML-disabled)', () => {
    const onRetry = vi.fn();
    render(<FileUploadItem name="Name" state="deleted" onRetry={onRetry} />);
    const button = screen.getByRole('button', { name: 'Повторить загрузку' });
    expect(button).not.toBeDisabled();
    button.click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('deleted: переносит data-state=disabled для каскада серых токенов', () => {
    const { container } = render(<FileUploadItem name="Name" state="deleted" />);
    const item = container.firstElementChild as HTMLElement;
    expect(item.dataset.state).toBe('disabled');
    expect(item.dataset.status).toBe('deleted');
  });

  it('default/error не переносят data-state', () => {
    const { container } = render(<FileUploadItem name="Name" />);
    expect((container.firstElementChild as HTMLElement)).not.toHaveAttribute('data-state');
  });
});
