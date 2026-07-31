import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Attach } from './Attach';

describe('Attach', () => {
  it('рисует кнопку с label по умолчанию', () => {
    render(<Attach />);
    expect(screen.getByRole('button', { name: 'Прикрепите файл' })).toBeInTheDocument();
  });

  it('рисует hint, если он передан', () => {
    render(<Attach hint="Hint text" />);
    expect(screen.getByText('Hint text')).toBeInTheDocument();
  });

  it('рисует children рядом с кнопкой', () => {
    render(<Attach>{'docx, xls, pdf'}</Attach>);
    expect(screen.getByText('docx, xls, pdf')).toBeInTheDocument();
  });

  it('клик по кнопке зовёт onClick', () => {
    const onClick = vi.fn();
    render(<Attach onClick={onClick} />);
    screen.getByRole('button').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('maxLimit=true скрывает кнопку и hint, рисует только maxLimitText', () => {
    render(
      <Attach hint="Hint text" maxLimit maxLimitText="Загружено 5 из 5 доступных файлов">
        docx
      </Attach>
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument();
    expect(screen.queryByText('docx')).not.toBeInTheDocument();
    expect(screen.getByText('Загружено 5 из 5 доступных файлов')).toBeInTheDocument();
  });

  it('disabled переносится на кнопку', () => {
    render(<Attach disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
