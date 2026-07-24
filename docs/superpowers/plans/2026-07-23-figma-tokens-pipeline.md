# Конвейер токенов Figma → Storybook: план реализации

> **Для агентов:** ОБЯЗАТЕЛЬНЫЙ ПОДНАВЫК: используйте superpowers:subagent-driven-development (рекомендуется) или superpowers:executing-plans для выполнения плана по задачам. Шаги размечены чекбоксами (`- [ ]`).

**Цель:** собрать работающий конвейер «переменные Figma → CSS-токены → Storybook» и провести через него один эталонный компонент Button со всеми режимами.

**Архитектура:** плагин Figma выгружает переменные вместе со ссылками и режимами в `figma-export.json`. Скрипт `sync-tokens` превращает выгрузку в четыре слоя CSS-переменных плюс типы TypeScript. Компоненты пишутся вручную и читают только токены. Каждая коллекция режимов Figma становится слоем переопределения CSS, режим — селектором.

**Стек:** Node 24, npm 11 (workspaces), Vitest, React + TypeScript, Storybook на Vite, CSS Modules. Figma Plugin API для выгрузки.

**Спецификация:** `docs/superpowers/specs/2026-07-23-figma-to-code-design.md`

---

## Структура файлов

```
figma-plugin/
  manifest.json          — регистрация плагина в Figma
  code.js                — сбор переменных через Plugin API
  ui.html                — кнопка выгрузки и сохранение файла

scripts/
  lib/naming.mjs         — перевод имён Figma в имена CSS-переменных
  lib/parse-export.mjs   — выгрузка → промежуточная модель
  lib/to-css.mjs         — модель → слои CSS
  lib/to-ts.mjs          — модель → tokens.ts и tokens.map.json
  mode-selectors.json    — соответствие «коллекция + режим → селектор CSS»
  sync-tokens.mjs        — точка входа генерации
  check-tokens.mjs       — числовая сверка кода с Figma

ds/
  package.json, tsconfig.json
  .storybook/main.ts, preview.ts
  src/tokens/            — генерируется, руками не трогать
  src/components/Button/ — Button.tsx, Button.module.css, Button.stories.tsx, index.ts
  src/foundations/       — Colors, Typography, Scales — страницы витрины
  src/index.ts

tests/fixtures/figma-export.sample.json — урезанная выгрузка для тестов
```

Разделение по ответственности: `naming` знает только про имена, `parse-export` только про форму выгрузки, `to-css` только про генерацию CSS. Каждый файл тестируется отдельно и помещается в голову целиком.

---

### Задача 1: Каркас репозитория и тестовая оснастка

**Файлы:**
- Создать: `package.json`
- Создать: `scripts/lib/naming.mjs`
- Тест: `scripts/lib/naming.test.mjs`

- [ ] **Шаг 1: Создать корневой package.json**

```json
{
  "name": "design-system-workspace",
  "private": true,
  "type": "module",
  "workspaces": ["ds"],
  "scripts": {
    "test": "vitest run",
    "sync-tokens": "node scripts/sync-tokens.mjs",
    "check-tokens": "node scripts/check-tokens.mjs",
    "storybook": "npm run storybook -w ds",
    "build-storybook": "npm run build-storybook -w ds"
  },
  "devDependencies": {
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Шаг 2: Установить зависимости**

Выполнить: `npm install`
Ожидается: создаётся `node_modules/` и `package-lock.json`, ошибок нет.

- [ ] **Шаг 3: Написать падающий тест на перевод имён**

Создать `scripts/lib/naming.test.mjs`:

```js
import { describe, it, expect } from 'vitest';
import { toCssVarName } from './naming.mjs';

describe('toCssVarName', () => {
  it('отбрасывает группу, продублированную в имени', () => {
    expect(toCssVarName('BG/state_bg_accent')).toBe('--state-bg-accent');
    expect(toCssVarName('Text/element_text_primary')).toBe('--element-text-primary');
  });

  it('схлопывает трёхкратный повтор в компонентных токенах', () => {
    expect(toCssVarName('Button/Button/Button_height')).toBe('--button-height');
    expect(toCssVarName('Addon/Addon_size')).toBe('--addon-size');
  });

  it('сохраняет осмысленный контекст при частичном повторе', () => {
    expect(toCssVarName('Font size/Body/body_m')).toBe('--font-size-body-m');
    expect(toCssVarName('Gray/palette_gray_900')).toBe('--palette-gray-900');
  });

  it('не трогает имена без повторов', () => {
    expect(toCssVarName('Padding/24')).toBe('--padding-24');
    expect(toCssVarName('Font family/Main')).toBe('--font-family-main');
    expect(toCssVarName('Body M/Regular')).toBe('--body-m-regular');
  });

  it('сохраняет дефисы внутри слова', () => {
    expect(toCssVarName('Text/state_text_on-accent')).toBe('--state-text-on-accent');
  });
});
```

- [ ] **Шаг 4: Убедиться, что тест падает**

Выполнить: `npx vitest run scripts/lib/naming.test.mjs`
Ожидается: FAIL, «Failed to load url ./naming.mjs» — файла ещё нет.

- [ ] **Шаг 5: Написать минимальную реализацию**

Создать `scripts/lib/naming.mjs`:

```js
/**
 * Переводит путь переменной Figma в имя пользовательского свойства CSS.
 *
 * Слова из пути режутся по «/», «_» и пробелам, приводятся к нижнему регистру.
 * Повторяющиеся слова убираются — остаётся последнее вхождение: группа в Figma
 * почти всегда продублирована в самом имени переменной («BG/state_bg_accent»).
 */
export function toCssVarName(figmaPath) {
  const words = figmaPath
    .split(/[/_\s]+/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);

  const kept = words.filter((word, i) => words.lastIndexOf(word) === i);
  return '--' + kept.join('-');
}
```

- [ ] **Шаг 6: Убедиться, что тест проходит**

Выполнить: `npx vitest run scripts/lib/naming.test.mjs`
Ожидается: PASS, 5 тестов.

- [ ] **Шаг 7: Зафиксировать**

```bash
git add package.json package-lock.json scripts/lib/naming.mjs scripts/lib/naming.test.mjs .gitignore
git commit -m "Каркас репозитория и перевод имён токенов Figma в CSS"
```

---

### Задача 2: Плагин Figma для выгрузки переменных

Плагин работает в режиме разработки на любом тарифе. Автотестами не покрывается — Plugin API доступен только внутри Figma; проверка ручная, а форма результата закрепляется тестами в задаче 4.

**Файлы:**
- Создать: `figma-plugin/manifest.json`
- Создать: `figma-plugin/code.js`
- Создать: `figma-plugin/ui.html`

- [ ] **Шаг 1: Создать манифест**

`figma-plugin/manifest.json`:

```json
{
  "name": "DS Variables Export",
  "id": "ds-variables-export",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"],
  "networkAccess": { "allowedDomains": ["none"] }
}
```

`networkAccess: none` означает, что плагин физически не может отправить содержимое файла куда-либо наружу.

- [ ] **Шаг 2: Написать сбор переменных**

`figma-plugin/code.js`:

```js
figma.showUI(__html__, { width: 320, height: 200 });

function rgbaToHex({ r, g, b, a }) {
  const to = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  const hex = `#${to(r)}${to(g)}${to(b)}`;
  return a === undefined || a === 1 ? hex : hex + to(a);
}

function normalizeValue(raw) {
  if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') {
    return { type: 'ALIAS', id: raw.id };
  }
  if (raw && typeof raw === 'object' && 'r' in raw) {
    return { type: 'COLOR', value: rgbaToHex(raw) };
  }
  return { type: 'VALUE', value: raw };
}

async function collectVariables() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const result = {
    exportedAt: new Date().toISOString(),
    fileName: figma.root.name,
    collections: []
  };

  for (const collection of collections) {
    const variables = [];

    for (const id of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(id);
      if (!variable) continue;

      const valuesByMode = {};
      for (const modeId of Object.keys(variable.valuesByMode)) {
        valuesByMode[modeId] = normalizeValue(variable.valuesByMode[modeId]);
      }

      variables.push({
        id: variable.id,
        name: variable.name,
        resolvedType: variable.resolvedType,
        valuesByMode
      });
    }

    result.collections.push({
      id: collection.id,
      name: collection.name,
      defaultModeId: collection.defaultModeId,
      modes: collection.modes.map((m) => ({ modeId: m.modeId, name: m.name })),
      variables
    });
  }

  return result;
}

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'export') return;
  try {
    const data = await collectVariables();
    figma.ui.postMessage({ type: 'result', json: JSON.stringify(data, null, 2) });
  } catch (error) {
    figma.ui.postMessage({ type: 'error', message: String(error) });
  }
};
```

- [ ] **Шаг 3: Написать интерфейс плагина**

`figma-plugin/ui.html`:

```html
<style>
  body { font: 13px/1.4 sans-serif; padding: 16px; }
  button { width: 100%; padding: 10px; font-size: 13px; cursor: pointer; }
  #status { margin-top: 12px; color: #666; }
</style>

<button id="run">Выгрузить переменные</button>
<div id="status"></div>

<script>
  const status = document.getElementById('status');

  document.getElementById('run').onclick = () => {
    status.textContent = 'Собираю…';
    parent.postMessage({ pluginMessage: { type: 'export' } }, '*');
  };

  onmessage = (event) => {
    const msg = event.data.pluginMessage;
    if (msg.type === 'error') {
      status.textContent = 'Ошибка: ' + msg.message;
      return;
    }
    const blob = new Blob([msg.json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'figma-export.json';
    link.click();
    status.textContent = 'Готово, файл сохранён.';
  };
</script>
```

- [ ] **Шаг 4: Проверить плагин вручную в Figma**

1. Открыть десктопное приложение Figma на файле дизайн-системы.
2. Меню Plugins → Development → Import plugin from manifest, выбрать `figma-plugin/manifest.json`.
3. Запустить плагин, нажать «Выгрузить переменные».
4. Положить скачанный `figma-export.json` в корень репозитория.

Ожидается: файл создан, внутри непустой массив `collections`, среди имён встречаются ColorsTheme, ColorsState и ComponentSize.

- [ ] **Шаг 5: Проверить, что ссылки действительно сохранились**

Выполнить:

```bash
node -e "const d=require('./figma-export.json');const a=d.collections.flatMap(c=>c.variables).flatMap(v=>Object.values(v.valuesByMode)).filter(x=>x.type==='ALIAS');console.log('ссылок:',a.length)"
```

Ожидается: число заметно больше нуля. По спецификации 161 токен из 233 — ссылки; если здесь ноль, плагин собрал вычисленные значения и дальше идти нельзя.

- [ ] **Шаг 6: Зафиксировать**

```bash
git add figma-plugin/ figma-export.json
git commit -m "Плагин Figma для выгрузки переменных со ссылками и режимами"
```

---

### Задача 3: Фикстура для тестов

**Файлы:**
- Создать: `tests/fixtures/figma-export.sample.json`

- [ ] **Шаг 1: Создать урезанную выгрузку**

Файл собирается вручную и повторяет форму настоящей выгрузки, но содержит ровно то, что нужно тестам: палитру без режимов, тему, состояния с двумя режимами и размеры с двумя режимами.

`tests/fixtures/figma-export.sample.json`:

```json
{
  "exportedAt": "2026-07-23T12:00:00.000Z",
  "fileName": "Design system",
  "collections": [
    {
      "id": "C:1",
      "name": "ColorsPalette",
      "defaultModeId": "m1",
      "modes": [{ "modeId": "m1", "name": "Default" }],
      "variables": [
        {
          "id": "V:1",
          "name": "Blue/palette_blue_default",
          "resolvedType": "COLOR",
          "valuesByMode": { "m1": { "type": "COLOR", "value": "#2936cc" } }
        },
        {
          "id": "V:2",
          "name": "Blue/palette_blue_600",
          "resolvedType": "COLOR",
          "valuesByMode": { "m1": { "type": "COLOR", "value": "#1f2999" } }
        }
      ]
    },
    {
      "id": "C:2",
      "name": "ColorsTheme",
      "defaultModeId": "m2",
      "modes": [{ "modeId": "m2", "name": "Light" }],
      "variables": [
        {
          "id": "V:3",
          "name": "Accent/theme_accent_default",
          "resolvedType": "COLOR",
          "valuesByMode": { "m2": { "type": "ALIAS", "id": "V:1" } }
        },
        {
          "id": "V:4",
          "name": "Accent/theme_accent_600",
          "resolvedType": "COLOR",
          "valuesByMode": { "m2": { "type": "ALIAS", "id": "V:2" } }
        }
      ]
    },
    {
      "id": "C:3",
      "name": "ColorsState",
      "defaultModeId": "m3",
      "modes": [
        { "modeId": "m3", "name": "Default" },
        { "modeId": "m4", "name": "Hover" }
      ],
      "variables": [
        {
          "id": "V:5",
          "name": "BG/state_bg_accent",
          "resolvedType": "COLOR",
          "valuesByMode": {
            "m3": { "type": "ALIAS", "id": "V:3" },
            "m4": { "type": "ALIAS", "id": "V:4" }
          }
        }
      ]
    },
    {
      "id": "C:4",
      "name": "ComponentSize",
      "defaultModeId": "m5",
      "modes": [
        { "modeId": "m5", "name": "L" },
        { "modeId": "m6", "name": "S" }
      ],
      "variables": [
        {
          "id": "V:6",
          "name": "Button/Button/Button_height",
          "resolvedType": "FLOAT",
          "valuesByMode": {
            "m5": { "type": "VALUE", "value": 56 },
            "m6": { "type": "VALUE", "value": 32 }
          }
        }
      ]
    }
  ]
}
```

- [ ] **Шаг 2: Зафиксировать**

```bash
git add tests/fixtures/figma-export.sample.json
git commit -m "Фикстура выгрузки Figma для тестов конвейера"
```

---

### Задача 4: Разбор выгрузки в промежуточную модель

**Файлы:**
- Создать: `scripts/lib/parse-export.mjs`
- Тест: `scripts/lib/parse-export.test.mjs`

- [ ] **Шаг 1: Написать падающие тесты**

Создать `scripts/lib/parse-export.test.mjs`:

```js
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseExport } from './parse-export.mjs';

const raw = JSON.parse(
  readFileSync(new URL('../../tests/fixtures/figma-export.sample.json', import.meta.url))
);

describe('parseExport', () => {
  it('переводит имена переменных в имена CSS', () => {
    const model = parseExport(raw);
    const palette = model.collections.find((c) => c.name === 'ColorsPalette');
    expect(palette.modes[0].tokens[0].cssVar).toBe('--palette-blue-default');
  });

  it('превращает ссылку в имя другой переменной, а не в значение', () => {
    const model = parseExport(raw);
    const theme = model.collections.find((c) => c.name === 'ColorsTheme');
    const accent = theme.modes[0].tokens.find((t) => t.cssVar === '--theme-accent-default');
    expect(accent.ref).toBe('--palette-blue-default');
    expect(accent.value).toBeUndefined();
  });

  it('раскладывает многорежимную коллекцию по режимам', () => {
    const model = parseExport(raw);
    const size = model.collections.find((c) => c.name === 'ComponentSize');
    expect(size.modes.map((m) => m.name)).toEqual(['L', 'S']);
    expect(size.modes[0].tokens[0].value).toBe(56);
    expect(size.modes[1].tokens[0].value).toBe(32);
  });

  it('помечает режим по умолчанию', () => {
    const model = parseExport(raw);
    const state = model.collections.find((c) => c.name === 'ColorsState');
    expect(state.modes.find((m) => m.isDefault).name).toBe('Default');
  });

  it('падает на ссылке в никуда', () => {
    const broken = structuredClone(raw);
    broken.collections[1].variables[0].valuesByMode.m2 = { type: 'ALIAS', id: 'V:404' };
    expect(() => parseExport(broken)).toThrow(/V:404/);
  });

  it('падает при совпадении имён CSS у разных переменных', () => {
    const clashing = structuredClone(raw);
    clashing.collections[0].variables[1].name = 'Blue/palette_blue_default';
    expect(() => parseExport(clashing)).toThrow(/--palette-blue-default/);
  });
});
```

- [ ] **Шаг 2: Убедиться, что тесты падают**

Выполнить: `npx vitest run scripts/lib/parse-export.test.mjs`
Ожидается: FAIL, модуль не найден.

- [ ] **Шаг 3: Написать реализацию**

Создать `scripts/lib/parse-export.mjs`:

```js
import { toCssVarName } from './naming.mjs';

/**
 * Превращает выгрузку плагина в модель, пригодную для генерации:
 * коллекция → режимы → токены, где токен либо несёт значение,
 * либо ссылается на другую переменную по её имени CSS.
 */
export function parseExport(raw) {
  const nameById = new Map();
  const seen = new Map();

  for (const collection of raw.collections) {
    for (const variable of collection.variables) {
      const cssVar = toCssVarName(variable.name);
      if (seen.has(cssVar)) {
        throw new Error(
          `Имя ${cssVar} получено сразу из двух переменных: ` +
            `«${seen.get(cssVar)}» и «${variable.name}». Правило перевода имён даёт совпадение.`
        );
      }
      seen.set(cssVar, variable.name);
      nameById.set(variable.id, cssVar);
    }
  }

  const collections = raw.collections.map((collection) => ({
    name: collection.name,
    modes: collection.modes.map((mode) => ({
      name: mode.name,
      isDefault: mode.modeId === collection.defaultModeId,
      tokens: collection.variables
        .filter((variable) => variable.valuesByMode[mode.modeId] !== undefined)
        .map((variable) => toToken(variable, mode.modeId, nameById))
    }))
  }));

  return { fileName: raw.fileName, exportedAt: raw.exportedAt, collections };
}

function toToken(variable, modeId, nameById) {
  const cssVar = toCssVarName(variable.name);
  const entry = variable.valuesByMode[modeId];

  if (entry.type === 'ALIAS') {
    const ref = nameById.get(entry.id);
    if (!ref) {
      throw new Error(
        `Переменная «${variable.name}» ссылается на ${entry.id}, которого нет в выгрузке.`
      );
    }
    return { cssVar, figmaName: variable.name, ref };
  }

  return { cssVar, figmaName: variable.name, value: entry.value };
}
```

- [ ] **Шаг 4: Убедиться, что тесты проходят**

Выполнить: `npx vitest run scripts/lib/parse-export.test.mjs`
Ожидается: PASS, 6 тестов.

- [ ] **Шаг 5: Зафиксировать**

```bash
git add scripts/lib/parse-export.mjs scripts/lib/parse-export.test.mjs
git commit -m "Разбор выгрузки Figma в модель со ссылками между токенами"
```

---

### Задача 5: Соответствие режимов селекторам CSS

Селекторы нельзя вывести из имён режимов автоматически — это решение человека. Файл пишется один раз; встретив незнакомую коллекцию или режим, генератор обязан упасть, а не угадывать.

**Файлы:**
- Создать: `scripts/mode-selectors.json`
- Создать: `scripts/lib/to-css.mjs`
- Тест: `scripts/lib/to-css.test.mjs`

- [ ] **Шаг 1: Описать соответствие**

`scripts/mode-selectors.json`:

```json
{
  "ColorsPalette": {
    "layer": "palette",
    "order": 1,
    "modes": { "Default": [":root"] }
  },
  "ColorsTheme": {
    "layer": "theme",
    "order": 2,
    "modes": {
      "Light": [":root", "[data-theme=\"light\"]"],
      "Dark": ["[data-theme=\"dark\"]"]
    }
  },
  "ColorsState": {
    "layer": "state",
    "order": 3,
    "modes": {
      "Default": [":root"],
      "Hover": [".ds-interactive:hover", "[data-state=\"hover\"]"],
      "Pressed": [".ds-interactive:active", "[data-state=\"pressed\"]"],
      "Disabled": [".ds-interactive:disabled", "[data-state=\"disabled\"]"]
    }
  },
  "ComponentSize": {
    "layer": "scale",
    "order": 4,
    "modes": {
      "L": [":root", "[data-size=\"l\"]"],
      "M": ["[data-size=\"m\"]"],
      "S": ["[data-size=\"s\"]"]
    }
  }
}
```

Каждое состояние объявлено парой: псевдокласс для настоящего взаимодействия и атрибут для принудительного показа в витрине. Они генерируются из одного значения, поэтому разойтись не могут.

Имена коллекций и режимов здесь предположительные. После первой настоящей выгрузки (задача 8) файл правится под фактические — генератор сам сообщит, что не совпало.

- [ ] **Шаг 2: Написать падающие тесты**

Создать `scripts/lib/to-css.test.mjs`:

```js
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseExport } from './parse-export.mjs';
import { toCss } from './to-css.mjs';

const raw = JSON.parse(
  readFileSync(new URL('../../tests/fixtures/figma-export.sample.json', import.meta.url))
);
const config = JSON.parse(readFileSync(new URL('../mode-selectors.json', import.meta.url)));
const model = parseExport(raw);

describe('toCss', () => {
  it('раскладывает коллекции по файлам слоёв', () => {
    const files = toCss(model, config);
    expect(Object.keys(files).sort()).toEqual([
      'palette.css',
      'scale.css',
      'state.css',
      'theme.css'
    ]);
  });

  it('выдаёт значение как есть', () => {
    const files = toCss(model, config);
    expect(files['palette.css']).toContain('--palette-blue-default: #2936cc;');
  });

  it('выдаёт ссылку через var, а не подставляет значение', () => {
    const files = toCss(model, config);
    expect(files['theme.css']).toContain('--theme-accent-default: var(--palette-blue-default);');
    expect(files['theme.css']).not.toContain('#2936cc');
  });

  it('добавляет единицы измерения числовым токенам', () => {
    const files = toCss(model, config);
    expect(files['scale.css']).toContain('--button-height: 56px;');
  });

  it('выдаёт по блоку на режим с нужными селекторами', () => {
    const files = toCss(model, config);
    expect(files['state.css']).toContain('.ds-interactive:hover,\n[data-state="hover"] {');
  });

  it('падает на коллекции, которой нет в соответствии', () => {
    const unknown = structuredClone(model);
    unknown.collections.push({ name: 'ColorsWeather', modes: [] });
    expect(() => toCss(unknown, config)).toThrow(/ColorsWeather/);
  });

  it('падает на режиме, которого нет в соответствии', () => {
    const unknown = structuredClone(model);
    unknown.collections.find((c) => c.name === 'ComponentSize').modes.push({
      name: 'XXL',
      isDefault: false,
      tokens: []
    });
    expect(() => toCss(unknown, config)).toThrow(/XXL/);
  });
});
```

- [ ] **Шаг 3: Убедиться, что тесты падают**

Выполнить: `npx vitest run scripts/lib/to-css.test.mjs`
Ожидается: FAIL, модуль не найден.

- [ ] **Шаг 4: Написать реализацию**

Создать `scripts/lib/to-css.mjs`:

```js
const UNITLESS = new Set(['--font-weight', '--line-height', '--opacity', '--z-index']);

/**
 * Превращает модель в набор файлов CSS: по файлу на слой,
 * внутри — по блоку на режим коллекции.
 */
export function toCss(model, config) {
  const files = {};

  const ordered = [...model.collections].sort(
    (a, b) => (config[a.name]?.order ?? 0) - (config[b.name]?.order ?? 0)
  );

  for (const collection of ordered) {
    const rules = config[collection.name];
    if (!rules) {
      throw new Error(
        `Коллекция «${collection.name}» отсутствует в scripts/mode-selectors.json. ` +
          `Добавьте её со слоем и селекторами режимов.`
      );
    }

    const blocks = [];

    for (const mode of collection.modes) {
      const selectors = rules.modes[mode.name];
      if (!selectors) {
        throw new Error(
          `Режим «${mode.name}» коллекции «${collection.name}» отсутствует ` +
            `в scripts/mode-selectors.json.`
        );
      }
      if (mode.tokens.length === 0) continue;

      const declarations = mode.tokens
        .map((token) => `  ${token.cssVar}: ${renderValue(token)};`)
        .join('\n');

      blocks.push(`${selectors.join(',\n')} {\n${declarations}\n}`);
    }

    const header =
      `/* Слой: ${rules.layer}. Источник: коллекция ${collection.name} в Figma.\n` +
      `   Файл генерируется скриптом sync-tokens — правки руками будут стёрты. */\n\n`;

    files[`${rules.layer}.css`] = header + blocks.join('\n\n') + '\n';
  }

  return files;
}

function renderValue(token) {
  if (token.ref) return `var(${token.ref})`;
  if (typeof token.value === 'number') {
    const unitless = [...UNITLESS].some((prefix) => token.cssVar.startsWith(prefix));
    return unitless ? String(token.value) : `${token.value}px`;
  }
  return String(token.value);
}
```

- [ ] **Шаг 5: Убедиться, что тесты проходят**

Выполнить: `npx vitest run scripts/lib/to-css.test.mjs`
Ожидается: PASS, 7 тестов.

- [ ] **Шаг 6: Зафиксировать**

```bash
git add scripts/mode-selectors.json scripts/lib/to-css.mjs scripts/lib/to-css.test.mjs
git commit -m "Генерация слоёв CSS из режимов коллекций Figma"
```

---

### Задача 6: Типы TypeScript и карта соответствия именам Figma

**Файлы:**
- Создать: `scripts/lib/to-ts.mjs`
- Тест: `scripts/lib/to-ts.test.mjs`

- [ ] **Шаг 1: Написать падающие тесты**

Создать `scripts/lib/to-ts.test.mjs`:

```js
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseExport } from './parse-export.mjs';
import { toTs, toMap } from './to-ts.mjs';

const raw = JSON.parse(
  readFileSync(new URL('../../tests/fixtures/figma-export.sample.json', import.meta.url))
);
const model = parseExport(raw);

describe('toTs', () => {
  it('объявляет тип со всеми именами токенов', () => {
    const ts = toTs(model);
    expect(ts).toContain("'--palette-blue-default'");
    expect(ts).toContain("'--button-height'");
    expect(ts).toContain('export type TokenName =');
  });

  it('перечисляет каждое имя ровно один раз', () => {
    const ts = toTs(model);
    const matches = ts.match(/'--palette-blue-default'/g);
    expect(matches).toHaveLength(1);
  });
});

describe('toMap', () => {
  it('связывает имя CSS с исходным именем Figma', () => {
    const map = toMap(model);
    expect(map['--theme-accent-default']).toBe('Accent/theme_accent_default');
  });
});
```

- [ ] **Шаг 2: Убедиться, что тесты падают**

Выполнить: `npx vitest run scripts/lib/to-ts.test.mjs`
Ожидается: FAIL, модуль не найден.

- [ ] **Шаг 3: Написать реализацию**

Создать `scripts/lib/to-ts.mjs`:

```js
function allTokens(model) {
  return model.collections.flatMap((c) => c.modes.flatMap((m) => m.tokens));
}

/** Объявление типа: подсказки в редакторе и ошибка на опечатке в имени токена. */
export function toTs(model) {
  const names = [...new Set(allTokens(model).map((t) => t.cssVar))].sort();
  const union = names.map((n) => `  | '${n}'`).join('\n');

  return (
    '// Файл генерируется скриптом sync-tokens — правки руками будут стёрты.\n\n' +
    'export type TokenName =\n' +
    union +
    ';\n\n' +
    'export const tokenNames: readonly TokenName[] = [\n' +
    names.map((n) => `  '${n}'`).join(',\n') +
    '\n] as const;\n'
  );
}

/** Обратное соответствие: по имени CSS понять, что это было в Figma. */
export function toMap(model) {
  const map = {};
  for (const token of allTokens(model)) {
    map[token.cssVar] = token.figmaName;
  }
  return Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
}
```

- [ ] **Шаг 4: Убедиться, что тесты проходят**

Выполнить: `npx vitest run scripts/lib/to-ts.test.mjs`
Ожидается: PASS, 3 теста.

- [ ] **Шаг 5: Зафиксировать**

```bash
git add scripts/lib/to-ts.mjs scripts/lib/to-ts.test.mjs
git commit -m "Генерация типов токенов и карты соответствия именам Figma"
```

---

### Задача 7: Точка входа sync-tokens

**Файлы:**
- Создать: `scripts/sync-tokens.mjs`
- Тест: `scripts/sync-tokens.test.mjs`

- [ ] **Шаг 1: Написать падающий тест**

Создать `scripts/sync-tokens.test.mjs`:

```js
import { describe, it, expect, beforeAll } from 'vitest';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generate } from './sync-tokens.mjs';

describe('generate', () => {
  let outDir;

  beforeAll(() => {
    outDir = mkdtempSync(join(tmpdir(), 'tokens-'));
    generate({
      exportPath: new URL('../tests/fixtures/figma-export.sample.json', import.meta.url).pathname,
      configPath: new URL('./mode-selectors.json', import.meta.url).pathname,
      outDir
    });
  });

  it('пишет четыре слоя, типы и карту', () => {
    expect(readdirSync(outDir).sort()).toEqual([
      'palette.css',
      'scale.css',
      'state.css',
      'theme.css',
      'tokens.map.json',
      'tokens.ts'
    ]);
  });

  it('сохраняет ссылки между слоями', () => {
    const theme = readFileSync(join(outDir, 'theme.css'), 'utf8');
    expect(theme).toContain('var(--palette-blue-default)');
  });
});
```

- [ ] **Шаг 2: Убедиться, что тест падает**

Выполнить: `npx vitest run scripts/sync-tokens.test.mjs`
Ожидается: FAIL, модуль не найден.

- [ ] **Шаг 3: Написать реализацию**

Создать `scripts/sync-tokens.mjs`:

```js
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseExport } from './lib/parse-export.mjs';
import { toCss } from './lib/to-css.mjs';
import { toTs, toMap } from './lib/to-ts.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function generate({ exportPath, configPath, outDir }) {
  const raw = JSON.parse(readFileSync(exportPath, 'utf8'));
  const config = JSON.parse(readFileSync(configPath, 'utf8'));

  const model = parseExport(raw);
  const files = toCss(model, config);

  mkdirSync(outDir, { recursive: true });

  const written = [];
  for (const [name, contents] of Object.entries(files)) {
    written.push(write(join(outDir, name), contents));
  }
  written.push(write(join(outDir, 'tokens.ts'), toTs(model)));
  written.push(write(join(outDir, 'tokens.map.json'), JSON.stringify(toMap(model), null, 2) + '\n'));

  return written;
}

function write(path, contents) {
  const before = existsSync(path) ? readFileSync(path, 'utf8') : null;
  writeFileSync(path, contents);
  return { path, changed: before !== contents, isNew: before === null };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const written = generate({
    exportPath: join(root, 'figma-export.json'),
    configPath: join(root, 'scripts', 'mode-selectors.json'),
    outDir: join(root, 'ds', 'src', 'tokens')
  });

  for (const file of written) {
    const mark = file.isNew ? 'новый' : file.changed ? 'изменён' : 'без изменений';
    console.log(`  ${mark.padEnd(14)} ${file.path.replace(root + '/', '')}`);
  }
}
```

- [ ] **Шаг 4: Убедиться, что тест проходит**

Выполнить: `npx vitest run scripts/sync-tokens.test.mjs`
Ожидается: PASS, 2 теста.

- [ ] **Шаг 5: Прогнать весь набор тестов**

Выполнить: `npm test`
Ожидается: PASS, 18 тестов в 5 файлах.

- [ ] **Шаг 6: Зафиксировать**

```bash
git add scripts/sync-tokens.mjs scripts/sync-tokens.test.mjs
git commit -m "Точка входа генерации токенов из выгрузки Figma"
```

---

### Задача 8: Первая генерация на настоящих данных

Здесь конвейер впервые встречается с реальной выгрузкой. Ожидаемо всплывут расхождения в именах коллекций и режимов — генератор сообщит о каждом.

**Файлы:**
- Изменить: `scripts/mode-selectors.json`
- Создать: `ds/src/tokens/*` (генерируется)

- [ ] **Шаг 1: Запустить генерацию**

Выполнить: `npm run sync-tokens`

Ожидается один из двух исходов:
- ошибка вида «Коллекция «…» отсутствует в scripts/mode-selectors.json» — перейти к шагу 2;
- список записанных файлов — перейти к шагу 3.

- [ ] **Шаг 2: Привести соответствие в порядок**

Посмотреть фактические имена:

```bash
node -e "const d=require('./figma-export.json');for(const c of d.collections)console.log(c.name,'→',c.modes.map(m=>m.name).join(', '))"
```

Дописать в `scripts/mode-selectors.json` недостающие коллекции и режимы, придерживаясь правил:
- слой определяется тем, на что коллекция ссылается: палитра ни на что, тема на палитру, состояния на тему, размеры отдельно;
- режим по умолчанию получает `:root` плюс свой атрибут;
- каждое интерактивное состояние получает пару «псевдокласс, атрибут».

Повторять шаги 1–2, пока генерация не пройдёт целиком.

- [ ] **Шаг 3: Проверить результат глазами**

Выполнить: `head -30 ds/src/tokens/theme.css`

Ожидается: объявления вида `--theme-accent-default: var(--palette-blue-default);`. Если вместо `var(...)` стоят шестнадцатеричные значения — ссылки потерялись, надо возвращаться к плагину.

- [ ] **Шаг 4: Проверить, что палитра не размножилась**

```bash
grep -c '#' ds/src/tokens/theme.css
```

Ожидается: 0. Все цвета в слое темы обязаны быть ссылками.

- [ ] **Шаг 5: Зафиксировать**

```bash
git add scripts/mode-selectors.json ds/src/tokens/
git commit -m "Первая генерация токенов из настоящей выгрузки дизайн-системы"
```

---

## Что выяснилось на настоящей дизайн-системе

Задачи 1–8 выполнены, конвейер отработал на реальной выгрузке. Ниже — всё, в чём действительность разошлась с планом. **Читать до начала задачи 9:** без этого задачи 9–14 будут сделаны под несуществующую дизайн-систему.

Итог первой генерации: **552 переменные Figma → 1250 токенов, 5 файлов CSS, 63 теста.**

### Переключателей шесть, а не три

| Коллекция | Режимы | Селектор | Уровень применения |
|---|---|---|---|
| ColorsPalette | Mode 1 | `:root` | — |
| ColorsAccent | Blue, Sky, Purple, Red | `[data-accent="…"]` | корень или контейнер |
| ColorsTheme | Light, Dark | `[data-theme="…"]` | корень или контейнер |
| ColorsState | Default, Hover, Pressed, Disabled | `.ds-interactive:hover` и `[data-state="…"]` | элемент |
| ColorsMessage | Info, Success, Warning, Error | `[data-message="…"]` | контейнер |
| ColorsOnAccent | Default, onAccent | `[data-on-accent]` | контейнер |
| ColorsElement | Value | `:root` | — |
| Scales, Typography | Mode 1 | `:root` | — |
| ComponentSize | L, M, S | `[data-size="…"]` | элемент или контейнер |

Слоёв CSS пять: `palette`, `theme` (акценты и темы), `state` (состояния, сообщения, onAccent), `element`, `scale` (шкалы, типографика, размеры).

Порядок зависимостей, выведенный из настоящих ссылок: палитра ← акцент ← тема ← состояния ← сообщения ← onAccent ← element. Отдельная ветка: шкалы ← типографика ← размеры компонентов.

### Производные слои переизлучаются

Самое неочевидное место архитектуры. Переменные CSS наследуют **вычисленное** значение, а не текст объявления. Слой, объявленный только на `:root`, застывает: `--element-bg-action-accent: var(--state-bg-accent)` посчитается один раз на корне и не отреагирует на наведение, хотя `--state-bg-accent` на кнопке переопределится.

Поэтому генератор выдаёт объявления производного слоя **дополнительно внутри каждого селектора, где переопределяется любой его вход** (транзитивно). Текст объявлений при этом побайтово тот же, поэтому неважно, какой блок победит по специфичности.

Цена — повторяющийся CSS: `element.css` вырос с 36 до 416 строк, 22 КБ, которые сжимаются до 983 байт. Взамен тему и акцент можно включать не только на `<html>`, но и на куске страницы.

Вариант «объявить слой на селекторе `*`» рассматривался и отвергнут: `*` применяется и к потомкам контейнера, из-за чего сбрасывал бы контейнерные переключатели.

**Порядок блоков внутри слоя решает исход каскада.** Обнаружено при сборке витрины в задаче 9. Переизлучённый блок несёт объявления умолчательного режима, и его селектор (`[data-theme="dark"]`) по специфичности равен селектору неосновного режима той же коллекции (`[data-state="hover"]`) — оба `(0,1,0)`. На элементе, попадающем под оба, побеждает тот, что ниже в файле. Изначально переизлучения печатались последними и затирали осознанно включённый режим: в тёмной теме принудительное наведение возвращало умолчательный цвет, а `[data-message="error"]` в тёмной теме давало оттенок info. Настоящее наведение при этом работало — у `.ds-interactive:hover` специфичность `(0,2,0)`, она перебивает переизлучение независимо от порядка, — поэтому дефект был виден только через переключатели витрины.

Порядок внутри коллекции зафиксирован: блок `:root`, затем переизлучения, затем собственные неосновные режимы. Оба соседства обязательны — выше `:root` переизлучение не переопределит корневые значения для темы на контейнере, ниже собственных режимов затрёт их.

### Компоненты читают `--element-*`

Слой element — верхний, для компонентов. Благодаря переизлучению он реагирует и на наведение, и на onAccent, и на смену темы. Отдельные значения (`--state-*`, `--theme-*`) компоненты напрямую не берут, кроме случаев, когда нужного токена в слое element нет.

### Ловушки в данных

**`Font weight/Italic` — это `font-style`, а не `font-weight`.** В Figma стили и веса лежат в одной группе. Генератор выводит `--font-weight-italic: italic`, и потреблять его надо в `font-style`, иначе объявление молча отбросится. Известные веса переводятся в числа (`Medium` → `500`).

**Межстрочный интервал.** Значение вне диапазона 0.5–3 у `--line-height-*` роняет генератор: в Figma такие часто хранятся в процентах, а безразмерный `line-height` в CSS означает кратность.

**Коллизии имён.** Правило перевода схлопывает повторяющиеся слова пути, поэтому две разные переменные Figma могут дать одно имя CSS. Есть аварийный люк `scripts/name-overrides.json` (описан в `scripts/name-overrides.md`), но правильное решение — переименовать в Figma. Одна такая коллизия встретилась и была закрыта именно так.

### Тестовый конфиг отдельно от боевого

`scripts/mode-selectors.json` описывает настоящую дизайн-систему. Тесты используют `tests/fixtures/mode-selectors.sample.json` вместе с `tests/fixtures/figma-export.sample.json`. Связывать тесты с боевым конфигом нельзя — он меняется вместе с ДС.

### Плагин выгружает больше, чем переменные

Кроме `collections` выгрузка содержит `textStyles` (23 текстовых стиля с привязками к переменным) и `stats` с диагностикой. Разбор их игнорирует. Типографские композиты (`Body M/Regular`, `Heading/XL`) — это текстовые стили Figma, а не переменные; когда дойдут руки до типографики, брать их надо оттуда.

---

### Задача 9: Пакет и каркас Storybook

**Файлы:**
- Создать: `ds/package.json`, `ds/tsconfig.json`
- Создать: `ds/.storybook/main.ts`, `ds/.storybook/preview.ts`
- Создать: `ds/src/index.ts`, `ds/src/tokens/index.css`

- [ ] **Шаг 1: Создать package.json пакета**

`ds/package.json`:

```json
{
  "name": "@ds/design-system",
  "version": "0.1.0",
  "type": "module",
  "main": "./src/index.ts",
  "scripts": {
    "storybook": "storybook dev -p 6006 --no-open",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@storybook/react-vite": "^9.1.10",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.0.4",
    "storybook": "^9.1.10",
    "typescript": "^5.9.3",
    "vite": "^7.1.9"
  }
}
```

- [ ] **Шаг 2: Установить зависимости**

Выполнить: `npm install`
Ожидается: установка проходит без ошибок, появляется `ds/node_modules` или общие пакеты в корне.

- [ ] **Шаг 3: Создать tsconfig**

`ds/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src", ".storybook"]
}
```

- [ ] **Шаг 4: Собрать слои токенов в один вход**

`ds/src/tokens/index.css`:

```css
@import '../assets/fonts/fonts.css';

/* Порядок подключения важен: каждый слой ссылается только на предыдущий. */
@import './palette.css';
@import './theme.css';
@import './state.css';
@import './element.css';
@import './scale.css';
```

Слоёв пять, а не четыре: на настоящих данных появился `element.css`. Шрифты подключаются первыми — см. раздел «Что выяснилось на настоящей дизайн-системе» выше.

- [ ] **Шаг 5: Настроить Storybook**

`ds/.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: { name: '@storybook/react-vite', options: {} }
};

export default config;
```

`ds/.storybook/preview.ts`:

```ts
import type { Preview } from '@storybook/react-vite';
import '../src/tokens/index.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Тема оформления',
      toolbar: {
        title: 'Тема',
        items: [
          { value: 'light', title: 'Светлая' },
          { value: 'dark', title: 'Тёмная' }
        ]
      }
    },
    accent: {
      description: 'Акцентный цвет',
      toolbar: {
        title: 'Акцент',
        items: [
          { value: 'blue', title: 'Синий' },
          { value: 'sky', title: 'Голубой' },
          { value: 'purple', title: 'Фиолетовый' },
          { value: 'red', title: 'Красный' }
        ]
      }
    },
    state: {
      description: 'Принудительное состояние',
      toolbar: {
        title: 'Состояние',
        items: [
          { value: '', title: 'Обычное' },
          { value: 'hover', title: 'Наведение' },
          { value: 'pressed', title: 'Нажатие' },
          { value: 'disabled', title: 'Недоступно' }
        ]
      }
    },
    size: {
      description: 'Размер компонентов',
      toolbar: {
        title: 'Размер',
        items: [
          { value: 'l', title: 'L' },
          { value: 'm', title: 'M' },
          { value: 's', title: 'S' }
        ]
      }
    }
  },
  initialGlobals: { theme: 'light', accent: 'blue', state: '', size: 'l' },
  decorators: [
    (Story, context) => {
      const root = document.documentElement;
      root.dataset.theme = context.globals.theme;
      root.dataset.accent = context.globals.accent;
      root.dataset.size = context.globals.size;
      if (context.globals.state) root.dataset.state = context.globals.state;
      else delete root.dataset.state;
      return Story();
    }
  ]
};

export default preview;
```

- [ ] **Шаг 6: Создать точку входа пакета**

`ds/src/index.ts`:

```ts
import './tokens/index.css';

export type { TokenName } from './tokens/tokens';
export { tokenNames } from './tokens/tokens';
```

- [ ] **Шаг 7: Положить шрифты в пакет**

Без этого у разработчика без установленных шрифтов витрина отрисуется системным и вся типографика поедет. Оба шрифта под SIL Open Font License, класть в репозиторий можно.

Скачать переменные начертания и положить в `ds/src/assets/fonts/`:

```bash
mkdir -p ds/src/assets/fonts
curl -sL -o ds/src/assets/fonts/InterTight.woff2 \
  "https://github.com/google/fonts/raw/main/ofl/intertight/InterTight%5Bwght%5D.woff2"
curl -sL -o ds/src/assets/fonts/IBMPlexMono-Regular.woff2 \
  "https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf"
ls -la ds/src/assets/fonts/
```

Ожидается: два непустых файла. Если по ссылке пришёл HTML или файл нулевого размера — скачать шрифты вручную с fonts.google.com и положить туда же под теми же именами.

Создать `ds/src/assets/fonts/fonts.css`:

```css
@font-face {
  font-family: 'Inter Tight';
  src: url('./InterTight.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'IBM Plex Mono';
  src: url('./IBMPlexMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

Дописать первой строкой в `ds/src/tokens/index.css`:

```css
@import '../assets/fonts/fonts.css';
```

- [ ] **Шаг 8: Запустить Storybook**

Выполнить: `npm run storybook`
Ожидается: сборка проходит, страница на `http://localhost:6006` открывается. Историй пока нет — это нормально, сообщение об их отсутствии ожидаемо.

Остановить сервер после проверки.

- [ ] **Шаг 9: Зафиксировать**

```bash
git add ds/package.json ds/tsconfig.json ds/.storybook/ ds/src/index.ts ds/src/tokens/index.css ds/src/assets/ package-lock.json
git commit -m "Каркас пакета дизайн-системы, шрифты и Storybook с переключателями"
```

---

### Задача 10: Страницы Foundations

Витрина собирается из тех же файлов, что и компоненты, поэтому разойтись с кодом не может.

> **Поправка по факту.** Слоёв больше, чем четыре в приведённом ниже `groupTokens`. На настоящих данных 552 токена делятся так: палитра 73, темы и акценты 80, состояния 54, сообщения 6, onAccent 14, element 31, шкалы и компонентные размеры 294. Разложение по слоям надо расширить под это, иначе почти три сотни токенов свалятся в `other` и на витрине окажутся в одной куче. Префиксы смотреть в `ds/src/tokens/tokens.map.json`, а не угадывать.

**Файлы:**
- Создать: `ds/src/foundations/tokens-source.ts`
- Создать: `ds/src/foundations/Colors.stories.tsx`
- Тест: `ds/src/foundations/tokens-source.test.ts`

- [ ] **Шаг 1: Написать падающий тест на чтение токенов**

Создать `ds/src/foundations/tokens-source.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { groupTokens } from './tokens-source';

describe('groupTokens', () => {
  it('раскладывает имена токенов по префиксу слоя', () => {
    const groups = groupTokens([
      '--palette-blue-default',
      '--palette-gray-900',
      '--theme-accent-default',
      '--button-height'
    ]);
    expect(groups.palette).toEqual(['--palette-blue-default', '--palette-gray-900']);
    expect(groups.theme).toEqual(['--theme-accent-default']);
    expect(groups.other).toEqual(['--button-height']);
  });
});
```

- [ ] **Шаг 2: Убедиться, что тест падает**

Выполнить: `npx vitest run ds/src/foundations/tokens-source.test.ts`
Ожидается: FAIL, модуль не найден.

- [ ] **Шаг 3: Написать реализацию**

Создать `ds/src/foundations/tokens-source.ts`:

```ts
import { tokenNames, type TokenName } from '../tokens/tokens';

export type TokenGroups = {
  palette: TokenName[];
  theme: TokenName[];
  state: TokenName[];
  other: TokenName[];
};

/** Раскладывает имена токенов по слоям — для отдельных страниц витрины. */
export function groupTokens(names: readonly TokenName[] = tokenNames): TokenGroups {
  const groups: TokenGroups = { palette: [], theme: [], state: [], other: [] };

  for (const name of names) {
    if (name.startsWith('--palette-')) groups.palette.push(name);
    else if (name.startsWith('--theme-')) groups.theme.push(name);
    else if (name.startsWith('--state-')) groups.state.push(name);
    else groups.other.push(name);
  }

  return groups;
}

/** Вычисленное значение токена в текущей теме — читается из живого документа. */
export function resolveToken(name: TokenName): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
```

- [ ] **Шаг 4: Убедиться, что тест проходит**

Выполнить: `npx vitest run ds/src/foundations/tokens-source.test.ts`
Ожидается: PASS, 1 тест.

- [ ] **Шаг 5: Написать страницу палитры**

Создать `ds/src/foundations/Colors.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { groupTokens, resolveToken } from './tokens-source';
import type { TokenName } from '../tokens/tokens';

function Swatch({ name }: { name: TokenName }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          background: `var(${name})`,
          border: '1px solid rgba(0,0,0,.1)',
          flexShrink: 0
        }}
      />
      <code style={{ fontSize: 12 }}>{name}</code>
      <span style={{ fontSize: 12, opacity: 0.6, marginLeft: 'auto' }}>{resolveToken(name)}</span>
    </div>
  );
}

function Layer({ title, names }: { title: string; names: TokenName[] }) {
  if (names.length === 0) return null;
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, marginBottom: 8 }}>
        {title} <span style={{ opacity: 0.5, fontWeight: 400 }}>({names.length})</span>
      </h2>
      {names.map((name) => (
        <Swatch key={name} name={name} />
      ))}
    </section>
  );
}

const meta: Meta = { title: 'Foundations/Цвета' };
export default meta;

export const Все: StoryObj = {
  render: () => {
    const groups = groupTokens();
    return (
      <div style={{ maxWidth: 640, padding: 16 }}>
        <Layer title="Палитра" names={groups.palette} />
        <Layer title="Тема" names={groups.theme} />
        <Layer title="Состояния" names={groups.state} />
      </div>
    );
  }
};
```

- [ ] **Шаг 6: Написать страницу типографики**

Создать `ds/src/foundations/Typography.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokenNames } from '../tokens/tokens';
import { resolveToken } from './tokens-source';

const sizeTokens = tokenNames.filter((name) => name.startsWith('--font-size-'));

const meta: Meta = { title: 'Foundations/Типографика' };
export default meta;

export const Размеры: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 720, padding: 16 }}>
      {sizeTokens.map((name) => (
        <div key={name} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>
            <code>{name}</code> — {resolveToken(name)}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-family-main)',
              fontSize: `var(${name})`,
              lineHeight: 1.2
            }}
          >
            Съешь ещё этих мягких булок
          </div>
        </div>
      ))}
    </div>
  )
};

export const Шрифты: StoryObj = {
  render: () => (
    <div style={{ padding: 16, display: 'grid', gap: 16 }}>
      <div style={{ fontFamily: 'var(--font-family-main)', fontSize: 20 }}>
        Основной — Inter Tight. Съешь ещё этих мягких булок 0123456789
      </div>
      <div style={{ fontFamily: 'var(--font-family-code)', fontSize: 20 }}>
        Моноширинный — IBM Plex Mono. const value = 0123456789;
      </div>
    </div>
  )
};
```

Если `--font-family-code` в выгрузке назван иначе, посмотреть фактическое имя в `ds/src/tokens/tokens.map.json` и подставить его.

- [ ] **Шаг 7: Написать страницу шкал**

Создать `ds/src/foundations/Scales.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokenNames } from '../tokens/tokens';
import { resolveToken } from './tokens-source';

function Ruler({ prefix, label }: { prefix: string; label: string }) {
  const names = tokenNames.filter((name) => name.startsWith(prefix));
  if (names.length === 0) return null;

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, marginBottom: 8 }}>
        {label} <span style={{ opacity: 0.5, fontWeight: 400 }}>({names.length})</span>
      </h2>
      {names.map((name) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '3px 0' }}>
          <div
            style={{
              width: `var(${name})`,
              minWidth: 2,
              height: 16,
              background: 'var(--theme-accent-default, #2936cc)',
              borderRadius: 2
            }}
          />
          <code style={{ fontSize: 12 }}>{name}</code>
          <span style={{ fontSize: 12, opacity: 0.6, marginLeft: 'auto' }}>
            {resolveToken(name)}
          </span>
        </div>
      ))}
    </section>
  );
}

const meta: Meta = { title: 'Foundations/Шкалы' };
export default meta;

export const Все: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 640, padding: 16 }}>
      <Ruler prefix="--padding-" label="Отступы" />
      <Ruler prefix="--radius-" label="Радиусы" />
    </div>
  )
};
```

- [ ] **Шаг 8: Проверить страницы в Storybook**

Выполнить: `npm run storybook`

Ожидается:
- «Цвета» — образцы всех цветов с именами и вычисленными значениями, переключатель темы меняет колонку значений;
- «Типографика» — размеры от самого мелкого до заголовочного, оба шрифта отрисованы своими начертаниями, а не системным;
- «Шкалы» — полоски отступов и радиусов в порядке возрастания.

Пустая страница означает, что префикс имён не совпал с фактическим: посмотреть `ds/src/tokens/tokens.map.json` и поправить фильтр.

- [ ] **Шаг 9: Зафиксировать**

```bash
git add ds/src/foundations/
git commit -m "Витрина Foundations: цвета, типографика и шкалы из токенов"
```

---

### Задача 11: Компонент Button

> **Поправка по факту.** Стили ниже написаны на токенах `--state-*`. Теперь это неверно: после переизлучения производных слоёв компоненты читают **`--element-*`** — верхний слой, который реагирует и на наведение, и на onAccent, и на смену темы. К `--state-*` и `--theme-*` обращаться только там, где нужного токена в слое element нет.
>
> Все имена токенов в стилях обязательно сверить с `ds/src/tokens/tokens.map.json` — приведённые ниже писались до первой генерации и часть из них не существует. Шаг с проверкой имён по карте (он есть в конце задачи) выполнять не в конце, а перед написанием стилей.
>
> Компонентные токены кнопки в ДС есть, имена уточнить по карте. Класс `ds-interactive` на корне кнопки обязателен — на него завязаны селекторы состояний.

**Файлы:**
- Создать: `ds/src/components/Button/Button.tsx`
- Создать: `ds/src/components/Button/Button.module.css`
- Создать: `ds/src/components/Button/index.ts`
- Тест: `ds/src/components/Button/Button.test.tsx`

- [ ] **Шаг 1: Поставить окружение для тестов компонентов**

Выполнить:

```bash
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @vitejs/plugin-react
```

Ставится в корень, а не в рабочее пространство `ds`: тесты запускает корневой Vitest, и разрешать зависимости он будет от корня.

Создать `vitest.config.ts` в корне:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts']
  }
});
```

Окружение `jsdom` ставится для всех тестов сразу. Тесты скриптов от этого не страдают — они работают с файловой системой, а она в jsdom доступна как обычно. Отдельная настройка окружения по маскам (`environmentMatchGlobs`) в Vitest 3 объявлена устаревшей, поэтому не используется.

Создать `vitest.setup.ts` в корне:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Шаг 2: Написать падающие тесты**

Создать `ds/src/components/Button/Button.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('рисует настоящую кнопку, а не div', () => {
    render(<Button>Отправить</Button>);
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeInTheDocument();
  });

  it('по умолчанию берёт вид accent и размер l', () => {
    render(<Button>Метка</Button>);
    const button = screen.getByRole('button');
    expect(button.dataset.view).toBe('accent');
    expect(button.dataset.size).toBe('l');
  });

  it('переносит размер в data-атрибут, а не в класс', () => {
    render(<Button size="s">Метка</Button>);
    expect(screen.getByRole('button').dataset.size).toBe('s');
  });

  it('считает кнопку иконочной, когда текста нет', () => {
    render(<Button iconLeft={<svg />} aria-label="Закрыть" />);
    expect(screen.getByRole('button').dataset.iconOnly).toBe('true');
  });

  it('не считает иконочной кнопку с текстом и иконкой', () => {
    render(<Button iconLeft={<svg />}>Сохранить</Button>);
    expect(screen.getByRole('button').dataset.iconOnly).toBeUndefined();
  });

  it('вызывает обработчик по щелчку', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Жми</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('не вызывает обработчик, когда недоступна', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Жми
      </Button>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('пропускает наружу произвольные атрибуты кнопки', () => {
    render(<Button type="submit">Отправить</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
```

- [ ] **Шаг 3: Убедиться, что тесты падают**

Выполнить: `npx vitest run ds/src/components/Button/Button.test.tsx`
Ожидается: FAIL, модуль `./Button` не найден.

- [ ] **Шаг 4: Написать компонент**

Создать `ds/src/components/Button/Button.tsx`:

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonOwnProps = {
  /** Вид кнопки. Соответствует свойству View в Figma. */
  view?: 'accent' | 'primary' | 'secondary';
  /** Размер. Соответствует режимам коллекции ComponentSize. */
  size?: 'l' | 'm' | 's';
  /** Прозрачная кнопка без заливки. */
  ghost?: boolean;
  /** Опасное действие: удаление, отмена, отключение. */
  danger?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
};

export type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

/**
 * Кнопка дизайн-системы.
 *
 * Свойства Figma переносятся не один в один: `Icon only` не проп, а следствие —
 * кнопка без текста, но с иконкой считается иконочной. Это убирает
 * противоречивое состояние «iconOnly включён, но текст передан».
 *
 * О темах, состояниях и размерах компонент не знает: значения приходят
 * из слоёв токенов, переключаемых выше по дереву.
 */
export function Button({
  view = 'accent',
  size = 'l',
  ghost = false,
  danger = false,
  iconLeft,
  iconRight,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const hasLabel = children !== undefined && children !== null && children !== false;
  const isIconOnly = !hasLabel && Boolean(iconLeft || iconRight);

  return (
    <button
      {...rest}
      type={type}
      className={[styles.button, 'ds-interactive', className].filter(Boolean).join(' ')}
      data-view={view}
      data-size={size}
      data-ghost={ghost || undefined}
      data-danger={danger || undefined}
      data-icon-only={isIconOnly || undefined}
    >
      {iconLeft && (
        <span className={styles.addon} aria-hidden="true">
          {iconLeft}
        </span>
      )}
      {hasLabel && <span className={styles.label}>{children}</span>}
      {iconRight && (
        <span className={styles.addon} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
}
```

- [ ] **Шаг 5: Написать стили на токенах**

Создать `ds/src/components/Button/Button.module.css`:

```css
/* Ни одного числа: всё приходит из токенов, сгенерированных из Figma. */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  height: var(--button-height);
  min-width: var(--button-min-width);
  padding-inline: var(--button-padding-hor);
  gap: var(--button-gap);
  border-radius: var(--button-radius);
  border: 1px solid transparent;

  font-family: var(--font-family-main);
  font-size: var(--button-label-font-size);
  font-weight: 500;
  line-height: 1;

  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}

.button[data-icon-only='true'] {
  min-width: auto;
  width: var(--button-height);
  padding-inline: 0;
}

.button:focus-visible {
  outline: 2px solid var(--element-border-focus);
  outline-offset: 2px;
}

.button:disabled {
  cursor: not-allowed;
}

.button[data-view='accent'] {
  background: var(--state-bg-accent);
  color: var(--state-text-on-accent);
}

.button[data-view='primary'] {
  background: var(--state-bg-primary);
  color: var(--state-text-on-accent);
}

.button[data-view='secondary'] {
  background: transparent;
  border-color: var(--state-border-secondary);
  color: var(--state-text-primary);
}

.button[data-ghost] {
  background: transparent;
  border-color: transparent;
  color: var(--state-text-accent);
}

.button[data-danger] {
  background: var(--state-bg-error-secondary);
  color: var(--state-text-error);
}

.button[data-ghost][data-danger] {
  background: transparent;
  color: var(--state-text-error);
}

.addon {
  display: inline-flex;
  flex-shrink: 0;
  width: var(--addon-size);
  height: var(--addon-size);
}

.addon > * {
  width: 100%;
  height: 100%;
}

.label {
  white-space: nowrap;
}
```

Создать `ds/src/components/Button/index.ts`:

```ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

- [ ] **Шаг 6: Убедиться, что тесты проходят**

Выполнить: `npx vitest run ds/src/components/Button/Button.test.tsx`
Ожидается: PASS, 8 тестов.

- [ ] **Шаг 7: Проверить, что имена токенов существуют**

```bash
node -e "
const fs=require('fs');
const css=fs.readFileSync('ds/src/components/Button/Button.module.css','utf8');
const map=require('./ds/src/tokens/tokens.map.json');
const used=[...css.matchAll(/var\((--[a-z0-9-]+)\)/g)].map(m=>m[1]);
const missing=[...new Set(used)].filter(n=>!(n in map));
console.log(missing.length ? 'НЕТ В ТОКЕНАХ: '+missing.join(', ') : 'все токены на месте');
"
```

Ожидается: «все токены на месте». Если что-то перечислено — имя в стилях не совпадает с фактическим именем из выгрузки; править стили по `tokens.map.json`, не наоборот.

- [ ] **Шаг 8: Экспортировать компонент из пакета**

Дописать в `ds/src/index.ts`:

```ts
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';
```

- [ ] **Шаг 9: Зафиксировать**

```bash
git add ds/src/components/Button/ ds/src/index.ts vitest.config.ts vitest.setup.ts package.json package-lock.json
git commit -m "Компонент Button на токенах дизайн-системы"
```

---

### Задача 12: Истории Button и матрица вариантов

**Файлы:**
- Создать: `ds/src/components/Button/Button.stories.tsx`

- [ ] **Шаг 1: Написать истории**

Создать `ds/src/components/Button/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Label' }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Обычная: Story = {};

export const СИконками: Story = {
  args: { iconLeft: <PlusIcon />, iconRight: <PlusIcon /> }
};

export const ТолькоИконка: Story = {
  args: { children: undefined, iconLeft: <PlusIcon />, 'aria-label': 'Добавить' }
};

/** Полная матрица для сверки с макетом: 3 вида × ghost × danger. */
export const Матрица: Story = {
  render: () => (
    <table style={{ borderSpacing: 12 }}>
      <thead>
        <tr>
          <th />
          {(['accent', 'primary', 'secondary'] as const).map((view) => (
            <th key={view} style={{ fontSize: 12, textAlign: 'left' }}>
              {view}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(
          [
            ['обычная', {}],
            ['ghost', { ghost: true }],
            ['danger', { danger: true }],
            ['ghost + danger', { ghost: true, danger: true }]
          ] as const
        ).map(([label, props]) => (
          <tr key={label}>
            <td style={{ fontSize: 12, opacity: 0.6 }}>{label}</td>
            {(['accent', 'primary', 'secondary'] as const).map((view) => (
              <td key={view}>
                <Button view={view} {...props}>
                  Label
                </Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
};

/** Три размера рядом — проверка режимов ComponentSize. */
export const Размеры: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button size="l">Large</Button>
      <Button size="m">Medium</Button>
      <Button size="s">Small</Button>
    </div>
  )
};
```

- [ ] **Шаг 2: Проверить в Storybook**

Выполнить: `npm run storybook`

Ожидается:
- история «Матрица» показывает 12 кнопок;
- история «Размеры» — три кнопки высотой 56, 40 и 32;
- переключатель состояния в панели меняет вид кнопок без наведения мыши;
- переключатель темы меняет цвета.

- [ ] **Шаг 3: Зафиксировать**

```bash
git add ds/src/components/Button/Button.stories.tsx
git commit -m "Истории Button: матрица вариантов и размеры"
```

---

### Задача 13: Числовая сверка с Figma

**Файлы:**
- Создать: `scripts/check-tokens.mjs`
- Тест: `scripts/check-tokens.test.mjs`

- [ ] **Шаг 1: Написать падающий тест**

Создать `scripts/check-tokens.test.mjs`:

```js
import { describe, it, expect } from 'vitest';
import { diffTokens } from './check-tokens.mjs';

const generated = {
  '--palette-blue-default': '#2936cc',
  '--button-height': '56px'
};

describe('diffTokens', () => {
  it('молчит, когда всё совпадает', () => {
    expect(diffTokens(generated, { ...generated })).toEqual([]);
  });

  it('сообщает о разошедшемся значении', () => {
    const drift = diffTokens(generated, { ...generated, '--button-height': '48px' });
    expect(drift).toEqual([
      { token: '--button-height', inCode: '56px', inFigma: '48px', kind: 'изменился' }
    ]);
  });

  it('сообщает о токене, появившемся в Figma', () => {
    const drift = diffTokens(generated, { ...generated, '--button-gap': '8px' });
    expect(drift).toEqual([
      { token: '--button-gap', inCode: undefined, inFigma: '8px', kind: 'добавлен' }
    ]);
  });

  it('сообщает о токене, исчезнувшем из Figma', () => {
    const drift = diffTokens(generated, { '--palette-blue-default': '#2936cc' });
    expect(drift).toEqual([
      { token: '--button-height', inCode: '56px', inFigma: undefined, kind: 'удалён' }
    ]);
  });
});
```

- [ ] **Шаг 2: Убедиться, что тест падает**

Выполнить: `npx vitest run scripts/check-tokens.test.mjs`
Ожидается: FAIL, модуль не найден.

- [ ] **Шаг 3: Написать реализацию**

Создать `scripts/check-tokens.mjs`:

```js
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseExport } from './lib/parse-export.mjs';
import { toCss } from './lib/to-css.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Сравнивает два плоских набора «токен → значение». */
export function diffTokens(inCode, inFigma) {
  const names = [...new Set([...Object.keys(inCode), ...Object.keys(inFigma)])].sort();
  const drift = [];

  for (const token of names) {
    const a = inCode[token];
    const b = inFigma[token];
    if (a === b) continue;
    const kind = a === undefined ? 'добавлен' : b === undefined ? 'удалён' : 'изменился';
    drift.push({ token, inCode: a, inFigma: b, kind });
  }

  return drift;
}

/** Вытаскивает объявления вида «--имя: значение;» из текста CSS. */
export function readDeclarations(css) {
  const found = {};
  for (const match of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    found[match[1]] = match[2].trim();
  }
  return found;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const tokensDir = join(root, 'ds', 'src', 'tokens');
  const inCode = {};
  for (const file of readdirSync(tokensDir).filter((f) => f.endsWith('.css'))) {
    Object.assign(inCode, readDeclarations(readFileSync(join(tokensDir, file), 'utf8')));
  }

  const raw = JSON.parse(readFileSync(join(root, 'figma-export.json'), 'utf8'));
  const config = JSON.parse(readFileSync(join(root, 'scripts', 'mode-selectors.json'), 'utf8'));
  const fresh = toCss(parseExport(raw), config);

  const inFigma = {};
  for (const css of Object.values(fresh)) Object.assign(inFigma, readDeclarations(css));

  const drift = diffTokens(inCode, inFigma);

  if (drift.length === 0) {
    console.log('Расхождений нет: код совпадает с выгрузкой Figma.');
    process.exit(0);
  }

  console.log(`Расхождений: ${drift.length}\n`);
  for (const item of drift) {
    console.log(`  ${item.kind.padEnd(10)} ${item.token}`);
    console.log(`             в коде: ${item.inCode ?? '—'}`);
    console.log(`             в Figma: ${item.inFigma ?? '—'}\n`);
  }
  process.exit(1);
}
```

- [ ] **Шаг 4: Убедиться, что тесты проходят**

Выполнить: `npx vitest run scripts/check-tokens.test.mjs`
Ожидается: PASS, 4 теста.

- [ ] **Шаг 5: Прогнать сверку на настоящих данных**

Выполнить: `npm run check-tokens`
Ожидается: «Расхождений нет» — токены только что сгенерированы из этой же выгрузки.

- [ ] **Шаг 6: Зафиксировать**

```bash
git add scripts/check-tokens.mjs scripts/check-tokens.test.mjs
git commit -m "Числовая сверка токенов в коде с выгрузкой Figma"
```

---

### Задача 14: Визуальная сверка и описание конвейера

**Файлы:**
- Создать: `docs/synchronization.md`
- Изменить: `README.md`

- [ ] **Шаг 1: Снять эталон из Figma**

Через Figma MCP получить снимок компонента Button (node `80:2169`, страница со всеми 24 вариантами) и снимок фрейма с размерами (node `284:22705`).

- [ ] **Шаг 2: Снять то же самое из Storybook**

Выполнить: `npm run storybook`, открыть истории «Матрица» и «Размеры», снять экран.

- [ ] **Шаг 3: Сравнить и перечислить расхождения**

Сверять построчно: высоты, отступы по горизонтали, промежутки, радиусы, размеры иконок, цвета заливки и текста в каждом виде.

Ожидается: список расхождений либо подтверждение совпадения. Каждое расхождение разбирается по правилу из спецификации — значения правятся в Figma и перевыгружаются, поведение правится в коде.

- [ ] **Шаг 4: Записать порядок синхронизации**

Создать `docs/synchronization.md`:

```markdown
# Синхронизация с Figma

Повторяется при каждом изменении дизайн-системы.

1. Открыть файл дизайн-системы в десктопном Figma.
2. Plugins → Development → DS Variables Export → «Выгрузить переменные».
3. Положить скачанный `figma-export.json` в корень репозитория.
4. `npm run sync-tokens` — перегенерирует токены и покажет, что изменилось.
5. `npm run check-tokens` — убедиться, что расхождений не осталось.
6. `npm test` — проверить, что компоненты не сломались.
7. `npm run storybook` — посмотреть глазами.
8. Зафиксировать: `git add ds/src/tokens figma-export.json && git commit`.

## Что скрипт не делает

Компоненты не трогаются никогда. Если в Figma изменилась структура компонента,
`sync-tokens` об этом не узнает и не сообщит — правки в разметку вносятся руками.

## При расхождении

- Значения (цвета, размеры, отступы) — правда в Figma.
- Поведение (фокус, клавиатура, семантика, ARIA) — правда в коде.

## Новая коллекция режимов в Figma

`sync-tokens` упадёт с сообщением о незнакомой коллекции. Дописать её
в `scripts/mode-selectors.json`: слой, порядок и селектор для каждого режима.
```

- [ ] **Шаг 5: Обновить README**

Дописать в `README.md` после таблицы состояния:

```markdown
## Дизайн-система в коде

Пакет лежит в `ds/`, токены генерируются из Figma и правятся только через выгрузку.

| Команда | Что делает |
|---|---|
| `npm run storybook` | витрина на http://localhost:6006 |
| `npm run build-storybook` | статическая сборка для передачи разработчикам |
| `npm run sync-tokens` | перегенерировать токены из `figma-export.json` |
| `npm run check-tokens` | сверить токены в коде с Figma |
| `npm test` | прогнать тесты |

Порядок синхронизации с Figma описан в [docs/synchronization.md](docs/synchronization.md).
```

- [ ] **Шаг 6: Прогнать всё целиком**

Выполнить: `npm test && npm run check-tokens && npm run build-storybook`
Ожидается: тесты проходят, расхождений нет, статическая сборка собирается в `ds/storybook-static`.

- [ ] **Шаг 7: Зафиксировать и отправить**

```bash
git add docs/synchronization.md README.md
git commit -m "Описание конвейера синхронизации и команд"
git push
```

---

## Что дальше

Конвейер проверен на одном компоненте. Дальше — остальные 49, пачками по 5–7 родственных, каждая отдельным планом. Порядок разумно взять такой: сначала формы (Input, Checkbox, Switch, Select), затем оповещения (Badge, Tag, Alert), затем слои (Card, Modal, Tooltip). Отдельным заходом — иконки: выгрузка SVG в репозиторий и сборка в компонент.
