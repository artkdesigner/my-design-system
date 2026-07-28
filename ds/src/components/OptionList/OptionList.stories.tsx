import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OptionList } from './OptionList';
import { OptionListHeader } from '../OptionListHeader';
import { OptionListCell } from '../OptionListCell';
import { OptionListFooter } from '../OptionListFooter';
import { Button } from '../Button';

const meta: Meta<typeof OptionList> = {
  title: 'Components/OptionList/OptionList'
};

export default meta;
type Story = StoryObj<typeof OptionList>;

const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-2)',
  fontFamily: 'var(--font-family-main)'
};

const OPTIONS = ['Первая опция', 'Вторая опция', 'Третья опция', 'Четвёртая опция', 'Пятая опция'];

/**
 * Узел 120:9328 в Figma — Header, ряд ячеек и Footer собраны из отдельных
 * компонентов через children, не зашиты внутри OptionList.
 *
 * Поиск — не встроенная логика ни одного из компонентов (Header просто
 * поле ввода, Cell просто пункт), а обычная фильтрация списка в коде
 * вызывающей стороны по value из OptionListHeader: OptionList ничего не
 * знает про query, просто получает уже отфильтрованный набор children.
 */
export const ВПокое: Story = {
  name: 'В покое',
  render: () => {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(OPTIONS[0]);
    const found = OPTIONS.filter((option) => option.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

    return (
      <div style={{ ...page, width: '320px' }}>
        <OptionList>
          <OptionListHeader value={query} onChange={(e) => setQuery(e.target.value)} />
          {found.length > 0 ? (
            found.map((option) => (
              <OptionListCell key={option} label={option} selected={selected === option} onClick={() => setSelected(option)} />
            ))
          ) : (
            <div
              style={{
                padding: 'var(--optionlist-emptystate-padding-vert) var(--optionlist-emptystate-padding-hor)',
                color: 'var(--element-text-secondary)',
                fontSize: 'var(--optionlist-emptystate-font-size)'
              }}
            >
              Ничего не найдено
            </div>
          )}
          <OptionListFooter>
            <Button view="primary">Применить</Button>
            <Button view="primary" ghost>
              Сбросить
            </Button>
          </OptionListFooter>
        </OptionList>
      </div>
    );
  }
};

/**
 * Preset SelectAll у OptionListHeader (узел 120:4175) — тот же приём, что
 * у поиска: чекбокс ничего не знает про список, вся логика «выбрать всё» —
 * в коде вызывающей стороны. Отмечен = выбраны все опции, снят = ни одна,
 * indeterminate — часть опций выбрана вручную по одной.
 */
export const ВыбратьВсё: Story = {
  name: 'Выбрать всё',
  render: () => {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const allSelected = selected.size === OPTIONS.length;
    const someSelected = selected.size > 0 && !allSelected;
    const state = allSelected ? 'checked' : someSelected ? 'indeterminate' : 'unchecked';

    const toggleAll = () => setSelected(allSelected ? new Set() : new Set(OPTIONS));

    const toggleOne = (option: string) =>
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(option)) next.delete(option);
        else next.add(option);
        return next;
      });

    return (
      <div style={{ ...page, width: '320px' }}>
        <OptionList>
          <OptionListHeader preset="selectAll" state={state} onClick={toggleAll} />
          {OPTIONS.map((option) => (
            <OptionListCell key={option} label={option} selected={selected.has(option)} onClick={() => toggleOne(option)} />
          ))}
        </OptionList>
      </div>
    );
  }
};

export const БезHeaderИFooter: Story = {
  name: 'Без Header и Footer',
  render: () => (
    <div style={{ ...page, width: '320px' }}>
      <OptionList>
        {OPTIONS.slice(0, 3).map((option, i) => (
          <OptionListCell key={option} label={option} selected={i === 0} />
        ))}
      </OptionList>
    </div>
  )
};

export const Размеры: Story = {
  render: () => (
    <div style={{ ...page, display: 'flex', flexWrap: 'wrap', gap: 'var(--margin-16)', alignItems: 'flex-start' }}>
      {(['l', 'm', 's'] as const).map((size) => (
        <div key={size} style={{ width: '260px' }}>
          <OptionList size={size}>
            <OptionListHeader size={size} />
            {OPTIONS.slice(0, 3).map((option, i) => (
              <OptionListCell key={option} label={option} size={size} selected={i === 0} />
            ))}
          </OptionList>
        </div>
      ))}
    </div>
  )
};
