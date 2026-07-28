import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OptionListFooter } from './OptionListFooter';
import { Button } from '../Button';

const meta: Meta<typeof OptionListFooter> = {
  title: 'Components/OptionList/OptionListFooter',
  component: OptionListFooter
};

export default meta;
type Story = StoryObj<typeof OptionListFooter>;

const page: CSSProperties = {
  background: 'var(--element-bg-lvl-1)',
  fontFamily: 'var(--font-family-main)',
  width: '320px',
  border: 'var(--stroke-1) solid var(--element-border-secondary)',
  borderRadius: 'var(--radius-16)'
};

/** Узел 120:13568 в Figma — заливка + прозрачная кнопка, но текст на них в
 * макете плейсхолдер, поэтому здесь свои осмысленные подписи. */
export const ВПокое: Story = {
  name: 'В покое',
  render: () => (
    <div style={page}>
      <OptionListFooter>
        <Button view="primary">Применить</Button>
        <Button view="primary" ghost>
          Сбросить
        </Button>
      </OptionListFooter>
    </div>
  )
};
