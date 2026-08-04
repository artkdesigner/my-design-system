import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
  it('рисует свитч с ролью switch и подписью через label/htmlFor', () => {
    render(<Switch label="Push-уведомления" />);
    expect(screen.getByRole('switch', { name: 'Push-уведомления' })).toBeInTheDocument();
  });

  it('рисует подсказку под подписью', () => {
    render(<Switch label="Push-уведомления" hint="Придут даже при отключённом звуке" />);
    expect(screen.getByText('Придут даже при отключённом звуке')).toBeInTheDocument();
  });

  it('клик по подписи переключает так же, как клик по пилюле', async () => {
    const onClick = vi.fn();
    render(<Switch label="Push-уведомления" onClick={onClick} />);
    await userEvent.click(screen.getByText('Push-уведомления'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('переносит size на пилюлю и на обёртку', () => {
    render(<Switch label="Push-уведомления" size="s" />);
    expect(screen.getByRole('switch').dataset.size).toBe('s');
  });

  it('переносит checked на пилюлю', () => {
    render(<Switch label="Push-уведомления" checked />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('недоступное состояние отключает и пилюлю, и клик по подписи', async () => {
    const onClick = vi.fn();
    render(<Switch label="Push-уведомления" disabled onClick={onClick} />);
    expect(screen.getByRole('switch')).toBeDisabled();
    await userEvent.click(screen.getByText('Push-уведомления'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('не рисует блок подписи вовсе, если нет ни label, ни hint', () => {
    const { container } = render(<Switch aria-label="Push-уведомления" />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('использует переданный id, а не генерирует свой', () => {
    render(<Switch label="Push-уведомления" id="push-toggle" />);
    expect(screen.getByRole('switch')).toHaveAttribute('id', 'push-toggle');
  });

  it('по умолчанию рисует пилюлю перед подписью', () => {
    const { container } = render(<Switch label="Push-уведомления" />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.firstElementChild).toHaveAttribute('role', 'switch');
  });

  it('reverse рисует подпись перед пилюлей', () => {
    const { container } = render(<Switch label="Push-уведомления" reverse />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.firstElementChild).not.toHaveAttribute('role', 'switch');
    expect(wrapper?.lastElementChild).toHaveAttribute('role', 'switch');
  });
});
