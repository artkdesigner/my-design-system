import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropzone } from './Dropzone';

function makeDataTransfer(files: File[]) {
  return { files, dataTransfer: { files } };
}

describe('Dropzone', () => {
  it('по умолчанию рисует текст «Перетащите файлы»', () => {
    render(<Dropzone />);
    expect(screen.getByText('Перетащите файлы')).toBeInTheDocument();
  });

  it('children заменяет текст по умолчанию', () => {
    render(<Dropzone>Свой текст</Dropzone>);
    expect(screen.getByText('Свой текст')).toBeInTheDocument();
    expect(screen.queryByText('Перетащите файлы')).not.toBeInTheDocument();
  });

  it('dragOver включает data-active, dragLeave выключает', () => {
    const { container } = render(<Dropzone />);
    const zone = container.firstElementChild as HTMLElement;
    fireEvent.dragOver(zone);
    expect(zone).toHaveAttribute('data-active', 'true');
    fireEvent.dragLeave(zone);
    expect(zone).not.toHaveAttribute('data-active');
  });

  it('drop зовёт onFilesDrop с файлами из dataTransfer и сбрасывает data-active', () => {
    const onFilesDrop = vi.fn();
    const { container } = render(<Dropzone onFilesDrop={onFilesDrop} />);
    const zone = container.firstElementChild as HTMLElement;
    const file = new File(['x'], 'file.txt');
    fireEvent.dragOver(zone);
    fireEvent.drop(zone, makeDataTransfer([file]));
    expect(onFilesDrop).toHaveBeenCalledTimes(1);
    const [received] = onFilesDrop.mock.calls[0] as [FileList];
    expect(received[0]).toBe(file);
    expect(zone).not.toHaveAttribute('data-active');
  });

  it('disabled: dragOver не включает data-active, drop не зовёт onFilesDrop', () => {
    const onFilesDrop = vi.fn();
    const { container } = render(<Dropzone disabled onFilesDrop={onFilesDrop} />);
    const zone = container.firstElementChild as HTMLElement;
    fireEvent.dragOver(zone);
    expect(zone).not.toHaveAttribute('data-active');
    fireEvent.drop(zone, makeDataTransfer([new File(['x'], 'file.txt')]));
    expect(onFilesDrop).not.toHaveBeenCalled();
    expect(zone).toHaveAttribute('data-disabled', 'true');
  });
});
