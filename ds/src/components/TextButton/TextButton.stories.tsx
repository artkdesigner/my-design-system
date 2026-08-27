import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextButton, type TextButtonProps } from './TextButton';
import { Icon, type IconName } from '../Icon';

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta: Meta<typeof TextButton> = {
  title: 'Components/TextButton',
  component: TextButton,
  args: { children: 'Label' }
};

export default meta;
type Story = StoryObj<typeof TextButton>;

const VIEWS = ['accent', 'primary'] as const;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)'
};

const label: CSSProperties = {
  fontFamily: 'var(--font-family-code)',
  fontSize: 'var(--font-size-hint-m)',
  color: 'var(--element-text-secondary)',
  textAlign: 'left',
  fontWeight: 'var(--font-weight-regular)',
  whiteSpace: 'nowrap'
};

export const Обычная: Story = { name: 'В покое' };

export const СИконками: Story = {
  name: 'Текст + аддон',
  args: { addonLeft: <PlusIcon />, addonRight: <PlusIcon /> }
};

const ADDON_ICONS = ['check', 'plus-01', 'dash', 'search-01', 'star-01', 'information', 'x-03'] as const;

type AddonDemoProps = Omit<TextButtonProps, 'addonLeft' | 'addonRight'> & {
  /** Включает левый аддон целиком — addonLeft у TextButton это ReactNode
   * (значит, у Storybook нет для него готового контрола), поэтому здесь
   * boolean + select собирают реальный addonLeft за кулисами. */
  withAddon: boolean;
  addonIcon: IconName;
};

function AddonDemo({ withAddon, addonIcon, ...rest }: AddonDemoProps) {
  return <TextButton {...rest} addonLeft={withAddon ? <Icon name={addonIcon} /> : undefined} />;
}

/**
 * Живой контрол для addonLeft: включить аддон и выбрать, что внутри —
 * то, что не даёт сделать напрямую сам проп (ReactNode не превращается в
 * контрол Storybook сам по себе).
 */
export const Аддон: StoryObj<typeof AddonDemo> = {
  name: 'Аддон (контрол)',
  args: { children: 'Label', withAddon: true, addonIcon: 'check' },
  argTypes: {
    withAddon: { control: 'boolean', name: 'Показать аддон' },
    addonIcon: { control: 'select', options: ADDON_ICONS, name: 'Иконка в аддоне' }
  },
  render: (args) => (
    <div style={page}>
      <AddonDemo {...args} />
    </div>
  )
};

/** Матрица для сверки с макетом: 2 вида × 4 тона сообщения (+ обычная строка). */
export const Матрица: Story = {
  render: () => {
    const tones = ['info', 'success', 'warning', 'error'] as const;
    return (
      <div style={page}>
        <table style={{ borderSpacing: 'var(--margin-12)' }}>
          <thead>
            <tr>
              <th />
              {VIEWS.map((view) => (
                <th key={view} style={label}>
                  {view}
                </th>
              ))}
              <th style={label}>alert</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={label}>обычная</td>
              {VIEWS.map((view) => (
                <td key={view}>
                  <TextButton view={view}>Label</TextButton>
                </td>
              ))}
              <td>
                <TextButton alert="error">Label</TextButton>
              </td>
            </tr>
            {tones.map((tone) => (
              <tr key={tone}>
                <td style={label}>{tone}</td>
                <td colSpan={VIEWS.length} />
                <td>
                  <TextButton alert={tone}>Label</TextButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

/**
 * Четыре тона сообщения. В отличие от Button здесь одна строка, а не две:
 * у TextButton нет заливки/ghost-варианта (см. комментарий над компонентом),
 * только сам тон.
 */
export const Тоны: Story = {
  name: 'Тип сообщения',
  render: () => {
    const tones = ['info', 'success', 'warning', 'error'] as const;

    return (
      <div style={page}>
        <table style={{ borderSpacing: 'var(--margin-12)' }}>
          <thead>
            <tr>
              <th />
              {tones.map((tone) => (
                <th key={tone} style={label}>
                  {tone}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={label}>alert</td>
              {tones.map((tone) => (
                <td key={tone}>
                  <TextButton alert={tone}>Label</TextButton>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
};

/** Три размера рядом — проверка режимов ComponentSize. */
export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', alignItems: 'center', gap: 'var(--margin-16)' }}>
      <TextButton size="l">Large</TextButton>
      <TextButton size="m">Medium</TextButton>
      <TextButton size="s">Small</TextButton>
    </div>
  )
};
