import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokenNames } from '../tokens/tokens';
import { resolveToken } from './tokens-source';
import { Row, Section, page } from './Showcase';

const meta: Meta = { title: 'Foundations/Типографика' };
export default meta;

const families = tokenNames.filter((name) => name.startsWith('--font-family-'));
const sizes = tokenNames.filter((name) => name.startsWith('--font-size-'));
const weights = tokenNames.filter((name) => name.startsWith('--font-weight-'));

const ПАНГРАММА = 'Съешь ещё этих мягких французских булок, да выпей чаю';

export const Шрифты: StoryObj = {
  render: () => (
    <div style={page}>
      <Section
        title="Семейства"
        count={families.length}
        hint="Начертания лежат в пакете, в ds/src/assets/fonts. Если строки ниже набраны системным шрифтом, значит файлы не подключились."
      >
        <div style={{ display: 'grid', gap: 'var(--margin-16)' }}>
          {families.map((name) => (
            <div key={name}>
              <Row name={name} />
              <div
                style={{
                  fontFamily: `var(${name})`,
                  fontSize: 'var(--font-size-heading-s)',
                  marginTop: 'var(--margin-4)'
                }}
              >
                {ПАНГРАММА} 0123456789
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
};

export const Размеры: StoryObj = {
  render: () => {
    // По возрастанию вычисленного кегля, а не по алфавиту имени: так видно
    // саму лестницу размеров.
    const ordered = [...sizes].sort(
      (a, b) => parseFloat(resolveToken(a)) - parseFloat(resolveToken(b))
    );

    return (
      <div style={page}>
        <Section
          title="Кегли"
          count={ordered.length}
          hint="Коллекция Typography — один режим, поэтому переключатель «Размер» на эту лестницу не влияет. Меняются от размера кегли внутри компонентов: --button-label-font-size и подобные, они на странице «Размеры компонентов»."
        >
          <div style={{ display: 'grid', gap: 'var(--margin-20)' }}>
            {ordered.map((name) => (
              <div key={name}>
                <Row name={name} />
                <div
                  style={{
                    fontFamily: 'var(--font-family-main)',
                    fontSize: `var(${name})`,
                    lineHeight: 1.2,
                    marginTop: 'var(--margin-2)'
                  }}
                >
                  {ПАНГРАММА}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    );
  }
};

export const Начертания: StoryObj = {
  render: () => (
    <div style={page}>
      <Section
        title="Начертания"
        count={weights.length}
        hint="Ловушка группы: Italic — это font-style, а не font-weight. Каждая строка ниже потребляет свой токен тем свойством, которому он годится."
      >
        <div style={{ display: 'grid', gap: 'var(--margin-16)' }}>
          {weights.map((name) => {
            const value = resolveToken(name);
            const isStyle = value === 'italic' || value === 'oblique';

            return (
              <div key={name}>
                <Row name={name}>
                  <span
                    style={{
                      fontFamily: 'var(--font-family-code)',
                      fontSize: 'var(--font-size-hint-m)',
                      color: 'var(--element-text-secondary)',
                      flexShrink: 0
                    }}
                  >
                    {isStyle ? 'font-style' : 'font-weight'}
                  </span>
                </Row>
                <div
                  style={{
                    fontFamily: 'var(--font-family-main)',
                    fontSize: 'var(--font-size-heading-s)',
                    marginTop: 'var(--margin-2)',
                    ...(isStyle ? { fontStyle: `var(${name})` } : { fontWeight: `var(${name})` })
                  }}
                >
                  {ПАНГРАММА}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  )
};
