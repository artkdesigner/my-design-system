import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Notification } from './Notification';

const meta: Meta<typeof Notification> = {
  title: 'Components/Notification',
  component: Notification,
  args: { title: 'Title', caption: 'Caption', buttonLabel: 'Button' }
};

export default meta;
type Story = StoryObj<typeof Notification>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-2)',
  width: 420
};

export const ВПокое: Story = {
  name: 'В покое',
  render: (args) => (
    <div style={page}>
      <Notification {...args} onButtonClick={() => {}} onClose={() => {}} />
    </div>
  )
};

/** Узел 207:6151 в Figma — типы StatusBadge и необязательные слоты. */
export const Типы: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexDirection: 'column', gap: 'var(--margin-16)' }}>
      <Notification title="Готово" caption="Операция выполнена успешно" badgeType="positiveCheck" onClose={() => {}} />
      <Notification title="Ошибка" caption="Не удалось сохранить изменения" badgeType="negativeCross" buttonLabel="Повторить" onButtonClick={() => {}} onClose={() => {}} />
      <Notification title="Внимание" caption="Проверьте введённые данные" badgeType="warningAlert" onClose={() => {}} />
      <Notification title="Без бейджа и без кнопок" showBadge={false} />
    </div>
  )
};
