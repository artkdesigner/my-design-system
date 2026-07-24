import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokenNames } from '../tokens/tokens';
import { sortByNumericSuffix } from './tokens-source';
import { Row, Section, page } from './Showcase';

const meta: Meta = { title: 'Foundations/Шкалы' };
export default meta;

const withPrefix = (prefix: string) =>
  sortByNumericSuffix(tokenNames.filter((name) => name.startsWith(prefix)));

const bar = (name: string) => ({
  width: `var(${name})`,
  minWidth: 'var(--stroke-2)',
  height: 'var(--scales-16)',
  flexShrink: 0,
  borderRadius: 'var(--radius-2)',
  background: 'var(--element-bg-action-accent)'
});

/** Линейка: полоски длиной в сам токен, по возрастанию. */
function Ruler({ prefix, title, hint }: { prefix: string; title: string; hint?: string }) {
  const names = withPrefix(prefix);
  if (names.length === 0) return null;

  return (
    <Section title={title} count={names.length} hint={hint}>
      <div style={{ display: 'grid', gap: 'var(--margin-4)' }}>
        {names.map((name) => (
          <Row key={name} name={name}>
            <div style={bar(name)} />
          </Row>
        ))}
      </div>
    </Section>
  );
}

export const Размеры: StoryObj = {
  render: () => (
    <div style={page}>
      <Ruler
        prefix="--scales-"
        title="Шкала"
        hint="Общая сетка величин. На неё ссылаются отступы, радиусы и размеры компонентов."
      />
      <Ruler prefix="--padding-" title="Внутренние отступы" />
      <Ruler prefix="--margin-" title="Внешние отступы" />
    </div>
  )
};

export const Радиусы: StoryObj = {
  render: () => {
    const names = withPrefix('--radius-');
    return (
      <div style={page}>
        <Section title="Радиусы" count={names.length}>
          <div style={{ display: 'grid', gap: 'var(--margin-8)' }}>
            {names.map((name) => (
              <Row key={name} name={name}>
                <div
                  style={{
                    width: 'var(--scales-48)',
                    height: 'var(--scales-32)',
                    flexShrink: 0,
                    borderRadius: `var(${name})`,
                    background: 'var(--element-bg-action-secondary)',
                    border: 'var(--stroke-1) solid var(--element-border-accent)'
                  }}
                />
              </Row>
            ))}
          </div>
        </Section>
      </div>
    );
  }
};

export const Линии: StoryObj = {
  render: () => {
    const names = withPrefix('--stroke-');
    return (
      <div style={page}>
        <Section
          title="Толщина линий"
          count={names.length}
          hint="Нулевая толщина — законное значение: границу выключают ей, а не удалением объявления."
        >
          <div style={{ display: 'grid', gap: 'var(--margin-12)' }}>
            {names.map((name) => (
              <Row key={name} name={name}>
                <div
                  style={{
                    width: 'var(--scales-48)',
                    flexShrink: 0,
                    borderTop: `var(${name}) solid var(--element-border-accent)`
                  }}
                />
              </Row>
            ))}
          </div>
        </Section>
      </div>
    );
  }
};
