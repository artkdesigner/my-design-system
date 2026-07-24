import type { CSSProperties, ReactNode } from 'react';
import { resolveToken } from './tokens-source';
import type { TokenName } from '../tokens/tokens';

/**
 * Общая обвязка страниц витрины. Собственное оформление тоже берётся из
 * токенов, а не прибивается значениями: страница цветов, набранная
 * системным шрифтом и захардкоженным серым, врала бы о дизайн-системе,
 * которую показывает. Побочная выгода — витрина сама следует переключателям
 * темы, а если переключатель состояния выкручен в «недоступно», то и её
 * текст гаснет: видно, что слой состояний правда работает.
 */
export const page: CSSProperties = {
  padding: 'var(--padding-24)',
  background: 'var(--element-bg-lvl-1)',
  color: 'var(--element-text-primary)',
  fontFamily: 'var(--font-family-main)',
  fontSize: 'var(--font-size-body-s)',
  minHeight: '100vh'
};

const code: CSSProperties = {
  fontFamily: 'var(--font-family-code)',
  fontSize: 'var(--font-size-hint-m)'
};

const muted: CSSProperties = {
  ...code,
  color: 'var(--element-text-secondary)'
};

export function Section({
  title,
  count,
  hint,
  children
}: {
  title: string;
  count?: number;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: 'var(--margin-36)' }}>
      <h2
        style={{
          fontSize: 'var(--font-size-heading-s)',
          fontWeight: 'var(--font-weight-medium)',
          margin: '0 0 var(--margin-4)'
        }}
      >
        {title}
        {count !== undefined && (
          <span style={{ color: 'var(--element-text-secondary)', fontWeight: 'var(--font-weight-regular)' }}>
            {' '}
            {count}
          </span>
        )}
      </h2>
      {hint && <p style={{ ...muted, margin: '0 0 var(--margin-12)' }}>{hint}</p>}
      {children}
    </section>
  );
}

/** Сетка образцов: столбцов столько, сколько влезает по ширине окна. */
export function Grid({ children, min = '280px' }: { children: ReactNode; min?: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}, 1fr))`,
        gap: 'var(--margin-8) var(--margin-16)'
      }}
    >
      {children}
    </div>
  );
}

/** Образец цвета: плашка, имя токена и вычисленное значение. */
export function Swatch({ name }: { name: TokenName }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--margin-8)', minWidth: 0 }}>
      <div
        style={{
          width: 'var(--scales-32)',
          height: 'var(--scales-32)',
          flexShrink: 0,
          borderRadius: 'var(--radius-6)',
          background: `var(${name})`,
          border: 'var(--stroke-1) solid var(--element-border-secondary)'
        }}
      />
      <code style={{ ...code, overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</code>
      <span style={{ ...muted, marginLeft: 'auto', flexShrink: 0 }}>{resolveToken(name)}</span>
    </div>
  );
}

/** Строка «имя токена — вычисленное значение» с произвольной иллюстрацией. */
export function Row({ name, children }: { name: TokenName; children?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--margin-8)', minWidth: 0 }}>
      {children}
      <code style={{ ...code, overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</code>
      <span style={{ ...muted, marginLeft: 'auto', flexShrink: 0 }}>{resolveToken(name)}</span>
    </div>
  );
}
