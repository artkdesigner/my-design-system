import type { Meta, StoryObj } from '@storybook/react-vite';
import { groupByComponent, groupTokens } from './tokens-source';
import { Grid, Row, Section, page } from './Showcase';

const meta: Meta = { title: 'Foundations/Размеры компонентов' };
export default meta;

const components = groupByComponent(groupTokens().component);
const total = components.reduce((sum, group) => sum + group.tokens.length, 0);

/**
 * Двести с лишним компонентных токенов — самая большая часть дизайн-системы
 * и единственная, которая растёт с каждым новым компонентом. Держим их
 * разложенными по компонентам: искать «сколько там высота у тега» нужно
 * именно так, а не по общему алфавитному списку.
 *
 * Значения зависят от переключателя «Размер»: L, M и S — это режимы
 * коллекции ComponentSize.
 */
export const Все: StoryObj = {
  render: () => (
    <div style={page}>
      <p
        style={{
          fontFamily: 'var(--font-family-code)',
          fontSize: 'var(--font-size-hint-m)',
          color: 'var(--element-text-secondary)',
          margin: '0 0 var(--margin-24)'
        }}
      >
        {components.length} компонентов, {total} токенов. Переключатель «Размер» меняет значения.
      </p>

      {components.map((group) => (
        <Section key={group.name} title={group.name} count={group.tokens.length}>
          <Grid min="320px">
            {group.tokens.map((name) => (
              <Row key={name} name={name} />
            ))}
          </Grid>
        </Section>
      ))}
    </div>
  )
};
