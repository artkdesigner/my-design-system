import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FileUploadControls } from './FileUploadControls';

describe('FileUploadControls', () => {
  it('без колбэков не рисует ни одной кнопки', () => {
    render(<FileUploadControls />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('рисует только те кнопки, для которых передан колбэк', () => {
    render(<FileUploadControls onDownload={() => {}} onRemove={() => {}} />);
    expect(screen.getByRole('button', { name: 'Скачать файл' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить файл' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Повторить загрузку' })).not.toBeInTheDocument();
  });

  it('клик по кнопке зовёт свой колбэк', () => {
    const onRetry = vi.fn();
    render(<FileUploadControls onRetry={onRetry} />);
    screen.getByRole('button', { name: 'Повторить загрузку' }).click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
