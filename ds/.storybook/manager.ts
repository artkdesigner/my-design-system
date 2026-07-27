import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

/**
 * Переключатель «Тема» в тулбаре — это глобал превью (canvas), он живёт
 * в другом процессе, чем сама оболочка Storybook (сайдбар, тулбар). Без
 * этого файла оболочка остаётся светлой, даже когда холст переключили
 * на тёмную — это два независимых UI. Слушаем канал и подстраиваем тему
 * оболочки под тот же переключатель, чтобы Storybook переключался целиком.
 *
 * Канал берётся внутри `addons.register`, а не у модуля верхнего уровня:
 * `addons.getChannel()` в момент загрузки файла возвращает временный канал,
 * который менеджер потом подменяет на настоящий, — снаружи регистрации он
 * никогда не получает события. Сверено экспериментально: канал снаружи
 * оказывается другим объектом, чем `window.__STORYBOOK_ADDONS_CHANNEL__`
 * после полной инициализации.
 */
addons.register('design-system/sync-manager-theme', (api) => {
  const channel = api.getChannel();
  if (!channel) return;

  function applyManagerTheme(globals: Record<string, unknown> | undefined) {
    const isDark = globals?.theme === 'dark';
    addons.setConfig({ theme: isDark ? themes.dark : themes.light });
  }

  channel.on('setGlobals', (data: { globals?: Record<string, unknown> }) => applyManagerTheme(data.globals));
  channel.on('globalsUpdated', (data: { globals?: Record<string, unknown> }) => applyManagerTheme(data.globals));
});
