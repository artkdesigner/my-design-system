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

  it('не разворачивает цепочку ссылок до конечного значения', () => {
    // Двухуровневая цепочка state → theme → palette обязана остаться
    // цепочкой ссылок. Реализация, которая резолвит алиасы до значения,
    // прошла бы предыдущий тест (там ссылка только на один уровень),
    // но не должна проходить этот.
    const model = parseExport(raw);
    const state = model.collections.find((c) => c.name === 'ColorsState');
    expect(state.modes[0].tokens[0].ref).toBe('--theme-accent-default');
    expect(state.modes[0].tokens[0].value).toBeUndefined();
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

  it('падает при совпадении CSS-имён у переменных с разными путями в Figma', () => {
    // Раньше тест задавал буквально одинаковое имя — Figma такое и не
    // позволит создать в одной группе, и проверка прошла бы даже при
    // полностью выброшенном правиле схлопывания слов. Здесь пути разные
    // («Blue/...» и «Palette/...»), а схлопывание в naming.mjs даёт им
    // одно и то же CSS-имя — вот что должно ловиться.
    const clashing = structuredClone(raw);
    clashing.collections[0].variables[1].name = 'Palette/palette_blue_default';
    expect(() => parseExport(clashing)).toThrow(/--palette-blue-default/);
  });

  it('падает, если у переменной нет значения в одном из режимов коллекции', () => {
    const broken = structuredClone(raw);
    delete broken.collections[3].variables[0].valuesByMode.m6; // ComponentSize, режим S
    expect(() => parseExport(broken)).toThrow(/Button\/Button\/Button_height/);
    expect(() => parseExport(broken)).toThrow(/режиме «S»/);
    expect(() => parseExport(broken)).toThrow(/ComponentSize/);
  });

  it('падает, если запись значения пуста — нет ни value, ни ссылки', () => {
    const broken = structuredClone(raw);
    broken.collections[3].variables[0].valuesByMode.m6 = { type: 'VALUE' };
    expect(() => parseExport(broken)).toThrow(/Button\/Button\/Button_height/);
  });

  it('копит все нарушения и сообщает их одной ошибкой', () => {
    const broken = structuredClone(raw);
    // Нарушение 1: висячая ссылка в ColorsState, режим Hover.
    broken.collections[2].variables[0].valuesByMode.m4 = { type: 'ALIAS', id: 'V:404' };
    // Нарушение 2: нет значения в режиме S у ComponentSize.
    delete broken.collections[3].variables[0].valuesByMode.m6;

    let error;
    try {
      parseExport(broken);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.message).toMatch(/V:404/);
    expect(error.message).toMatch(/Button\/Button\/Button_height/);
  });

  it('сообщает об одинаковом тексте ошибки при повторном запуске (стабильный порядок)', () => {
    const broken = structuredClone(raw);
    broken.collections[2].variables[0].valuesByMode.m4 = { type: 'ALIAS', id: 'V:404' };
    delete broken.collections[3].variables[0].valuesByMode.m6;

    let messageA;
    let messageB;
    try {
      parseExport(broken);
    } catch (e) {
      messageA = e.message;
    }
    try {
      parseExport(structuredClone(broken));
    } catch (e) {
      messageB = e.message;
    }

    expect(messageA).toBe(messageB);
  });

  it('падает с понятным сообщением, если в объекте нет раздела collections', () => {
    expect(() => parseExport({})).toThrow(/не похоже на выгрузку плагина/);
  });

  describe('nameOverrides', () => {
    it('без переопределений (или с пустым объектом) поведение прежнее', () => {
      const withoutArg = parseExport(raw);
      const withUndefinedOptions = parseExport(raw, undefined);
      const withEmptyOverrides = parseExport(raw, { nameOverrides: {} });
      expect(withUndefinedOptions).toEqual(withoutArg);
      expect(withEmptyOverrides).toEqual(withoutArg);
    });

    it('переопределение подменяет имя токена', () => {
      const model = parseExport(raw, {
        nameOverrides: { 'Blue/palette_blue_default': '--palette-blue-primary' }
      });
      const palette = model.collections.find((c) => c.name === 'ColorsPalette');
      expect(palette.modes[0].tokens[0].cssVar).toBe('--palette-blue-primary');

      // Всё, что ссылается на эту переменную по id, обязано подхватить
      // переопределённое имя, а не старое переведённое.
      const theme = model.collections.find((c) => c.name === 'ColorsTheme');
      const accent = theme.modes[0].tokens.find(
        (t) => t.figmaName === 'Accent/theme_accent_default'
      );
      expect(accent.ref).toBe('--palette-blue-primary');
    });

    it('переопределение разводит коллизию имён', () => {
      // Тот же трюк, что и в тесте на коллизию выше: делаем так, чтобы
      // «Blue/palette_blue_default» и вторая переменная схлопывались в одно
      // и то же имя CSS. Без переопределения parseExport бросил бы ошибку —
      // проверяем это отдельно, а затем убеждаемся, что с переопределением
      // для одного из двух путей разбор проходит и оба токена остаются
      // различимыми.
      const clashing = structuredClone(raw);
      clashing.collections[0].variables[1].name = 'Palette/palette_blue_default';
      expect(() => parseExport(clashing)).toThrow(/--palette-blue-default/);

      const model = parseExport(clashing, {
        nameOverrides: { 'Palette/palette_blue_default': '--palette-blue-default-alt' }
      });
      const palette = model.collections.find((c) => c.name === 'ColorsPalette');
      expect(palette.modes[0].tokens.map((t) => t.cssVar)).toEqual([
        '--palette-blue-default',
        '--palette-blue-default-alt'
      ]);
    });

    it('падает, если переопределение задаёт имя, непригодное для CSS', () => {
      expect(() =>
        parseExport(raw, {
          nameOverrides: { 'Blue/palette_blue_default': '--Не Годится!' }
        })
      ).toThrow(/так в CSS нельзя/);
    });

    it('переопределение, не сославшееся ни на одну переменную, — тоже нарушение', () => {
      expect(() =>
        parseExport(raw, {
          nameOverrides: { 'Давно/переименованный_путь': '--irrelevant-name' }
        })
      ).toThrow(/не сослалось ни на одну переменную/);
    });
  });
});
