import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploadForm } from './FileUploadForm';

function dragEventWithFiles() {
  return { dataTransfer: { types: ['Files'], files: [new File(['x'], 'a.txt')] } };
}

describe('FileUploadForm', () => {
  it('рисует заголовок и описание', () => {
    render(<FileUploadForm title="Документы" description="Загрузите файлы" />);
    expect(screen.getByText('Документы')).toBeInTheDocument();
    expect(screen.getByText('Загрузите файлы')).toBeInTheDocument();
  });

  it('без files не рисует блок счётчика и список', () => {
    render(<FileUploadForm title="Документы" />);
    expect(screen.queryByText('Всего файлов')).not.toBeInTheDocument();
  });

  it('с files рисует счётчик и строки FileUploadItem', () => {
    render(
      <FileUploadForm
        files={[
          { id: 1, name: 'Файл1', format: 'docx' },
          { id: 2, name: 'Файл2', format: 'pdf' }
        ]}
      />
    );
    expect(screen.getByText('Всего файлов')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Файл1')).toBeInTheDocument();
    expect(screen.getByText('Файл2')).toBeInTheDocument();
  });

  it('showCounter=false скрывает счётчик, но не список', () => {
    render(<FileUploadForm showCounter={false} files={[{ id: 1, name: 'Файл1' }]} />);
    expect(screen.queryByText('Всего файлов')).not.toBeInTheDocument();
    expect(screen.getByText('Файл1')).toBeInTheDocument();
  });

  it('клик по кнопке Attach зовёт onAttach', () => {
    const onAttach = vi.fn();
    render(<FileUploadForm attachLabel="Прикрепите файл" onAttach={onAttach} />);
    screen.getByRole('button', { name: 'Прикрепите файл' }).click();
    expect(onAttach).toHaveBeenCalledTimes(1);
  });

  it('remove/retry/download строки зовут колбэки с id файла', () => {
    const onRemoveFile = vi.fn();
    render(
      <FileUploadForm
        files={[{ id: 'file-1', name: 'Файл1', format: 'docx' }]}
        onRemoveFile={onRemoveFile}
      />
    );
    screen.getByRole('button', { name: 'Удалить файл' }).click();
    expect(onRemoveFile).toHaveBeenCalledWith('file-1');
  });

  it('dragenter с файлами переключает data-dragged, drop сбрасывает', () => {
    const onFilesDrop = vi.fn();
    const { container } = render(<FileUploadForm onFilesDrop={onFilesDrop} />);
    const form = container.firstElementChild as HTMLElement;
    fireEvent.dragEnter(form, dragEventWithFiles());
    expect(form).toHaveAttribute('data-dragged', 'true');

    const dropzone = form.querySelector('[class*="dropzoneLayer"]') as HTMLElement;
    fireEvent.drop(dropzone, dragEventWithFiles());
    expect(onFilesDrop).toHaveBeenCalledTimes(1);
    expect(form).not.toHaveAttribute('data-dragged');
  });

  it('dragenter без файлов (например, текст) не включает data-dragged', () => {
    const { container } = render(<FileUploadForm />);
    const form = container.firstElementChild as HTMLElement;
    fireEvent.dragEnter(form, { dataTransfer: { types: ['text/plain'] } });
    expect(form).not.toHaveAttribute('data-dragged');
  });
});
