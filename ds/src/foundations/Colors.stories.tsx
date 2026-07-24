import type { Meta, StoryObj } from '@storybook/react-vite';
import { groupTokens } from './tokens-source';
import { Grid, Section, Swatch, page } from './Showcase';

const meta: Meta = { title: 'Foundations/Цвета' };
export default meta;

const groups = groupTokens();

/**
 * Слои идут в порядке зависимостей — том же, в котором подключаются файлы
 * CSS. Каждый следующий слой ссылается только на предыдущие, поэтому
 * читать страницу сверху вниз значит читать дизайн-систему от сырых цветов
 * к тому, что берут компоненты.
 */
export const Все: StoryObj = {
  render: () => (
    <div style={page}>
      <Section
        title="Палитра"
        count={groups.palette.length}
        hint="Сырые цвета. Ни от чего не зависят и ни на что не реагируют — ни на тему, ни на акцент."
      >
        <Grid>
          {groups.palette.map((name) => (
            <Swatch key={name} name={name} />
          ))}
        </Grid>
      </Section>

      <Section
        title="Тема и акценты"
        count={groups.theme.length}
        hint="Ссылаются на палитру. Переключатели «Тема» и «Акцент» меняют колонку значений."
      >
        <Grid>
          {groups.theme.map((name) => (
            <Swatch key={name} name={name} />
          ))}
        </Grid>
      </Section>

      <Section
        title="Состояния"
        count={groups.state.length}
        hint="Ссылаются на тему. Переключатель «Состояние» показывает наведение, нажатие и недоступность принудительно."
      >
        <Grid>
          {groups.state.map((name) => (
            <Swatch key={name} name={name} />
          ))}
        </Grid>
      </Section>

      <Section
        title="Сообщения"
        count={groups.message.length}
        hint="Тон сообщения: инфо, успех, предупреждение, ошибка. Переключатель «Сообщение»."
      >
        <Grid>
          {groups.message.map((name) => (
            <Swatch key={name} name={name} />
          ))}
        </Grid>
      </Section>

      <Section
        title="На акценте"
        count={groups.onAccent.length}
        hint="Для содержимого на акцентной подложке. Переключатель «На акценте»."
      >
        <Grid>
          {groups.onAccent.map((name) => (
            <Swatch key={name} name={name} />
          ))}
        </Grid>
      </Section>

      <Section
        title="Element"
        count={groups.element.length}
        hint="Верхний слой — из него берут цвета компоненты. Реагирует на всё перечисленное выше сразу."
      >
        <Grid>
          {groups.element.map((name) => (
            <Swatch key={name} name={name} />
          ))}
        </Grid>
      </Section>
    </div>
  )
};
