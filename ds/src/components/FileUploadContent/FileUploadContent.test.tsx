import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FileUploadContent } from './FileUploadContent';

describe('FileUploadContent', () => {
  it('рисует имя и формат', () => {
    render(<FileUploadContent name="Название файла" format="docx" />);
    expect(screen.getByText('Название файла')).toBeInTheDocument();
    expect(screen.getByText('docx')).toBeInTheDocument();
  });

  it('default: рисует subtitle1/subtitle2', () => {
    render(<FileUploadContent name="Файл" subtitle1="12 КБ" subtitle2="Сегодня" />);
    expect(screen.getByText('12 КБ')).toBeInTheDocument();
    expect(screen.getByText('Сегодня')).toBeInTheDocument();
  });

  it('error: рисует errorText вместо subtitle', () => {
    render(
      <FileUploadContent name="Файл" state="error" subtitle1="Игнор" errorText1="Слишком большой файл" />
    );
    expect(screen.getByText('Слишком большой файл')).toBeInTheDocument();
    expect(screen.queryByText('Игнор')).not.toBeInTheDocument();
  });

  it('error: переносит data-message', () => {
    const { container } = render(<FileUploadContent name="Файл" state="error" errorText1="X" />);
    expect((container.firstElementChild as HTMLElement).dataset.message).toBe('error');
  });
});
