import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FileUploadLeftSlot } from './FileUploadLeftSlot';

describe('FileUploadLeftSlot', () => {
  it('по умолчанию state=empty', () => {
    const { container } = render(<FileUploadLeftSlot />);
    expect((container.firstElementChild as HTMLElement).dataset.status).toBe('empty');
  });

  it('loading: кольцо красится conic-gradient по progress', () => {
    const { container } = render(<FileUploadLeftSlot state="loading" progress={40} />);
    const ring = container.querySelector('.ring, [class*="ring"]') as HTMLElement;
    expect(ring.style.background).toContain('40%');
  });

  it('success/error переносят data-alert', () => {
    const { container: success } = render(<FileUploadLeftSlot state="success" />);
    const { container: error } = render(<FileUploadLeftSlot state="error" />);
    expect((success.firstElementChild as HTMLElement).dataset.alert).toBe('success');
    expect((error.firstElementChild as HTMLElement).dataset.alert).toBe('error');
  });

  it('deleted: рисует крестик поверх иконки', () => {
    const { container } = render(<FileUploadLeftSlot state="deleted" />);
    expect(container.querySelector('[class*="cross"]')).toBeInTheDocument();
  });

  it('progress обрезается до 0–100', () => {
    const { container } = render(<FileUploadLeftSlot state="loading" progress={140} />);
    const ring = container.querySelector('[class*="ring"]') as HTMLElement;
    expect(ring.style.background).toContain('100%');
  });

  it('icon подменяет миниатюру, кроме state=empty', () => {
    const { getByTestId, queryByTestId } = render(
      <FileUploadLeftSlot state="success" icon={<span data-testid="custom-icon" />} />
    );
    expect(getByTestId('custom-icon')).toBeInTheDocument();

    const empty = render(<FileUploadLeftSlot state="empty" icon={<span data-testid="ignored-icon" />} />);
    expect(empty.queryByTestId('ignored-icon')).not.toBeInTheDocument();
  });
});
