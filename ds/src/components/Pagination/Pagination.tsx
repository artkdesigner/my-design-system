import type { HTMLAttributes } from 'react';
import { PageButton } from '../PageButton';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import styles from './Pagination.module.css';

type PaginationItem = number | 'ellipsis';

function getPaginationItems(page: number, totalPages: number, siblingCount: number, boundaryCount: number): PaginationItem[] {
  const maxVisible = boundaryCount * 2 + siblingCount * 2 + 3;
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  for (let i = 1; i <= boundaryCount; i++) pages.add(i);
  for (let i = totalPages - boundaryCount + 1; i <= totalPages; i++) pages.add(i);
  for (let i = page - siblingCount; i <= page + siblingCount; i++) pages.add(i);

  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const items: PaginationItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push('ellipsis');
    items.push(p);
    prev = p;
  }
  return items;
}

type PaginationOwnProps = {
  /** default — построчный список номеров страниц; perPage — компактный
   * вид «‹ N из NN страниц ›» без отдельных кнопок номеров. Соответствует
   * View в Figma (узел 205:6137). */
  view?: 'default' | 'perPage';
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  /** Сколько номеров показывать по обе стороны от текущей страницы,
   * прежде чем свернуть остаток в «…». */
  siblingCount?: number;
  /** Сколько номеров всегда показывать у самого начала и у самого конца
   * списка, вне зависимости от текущей страницы. */
  boundaryCount?: number;
  pageText?: (page: number, totalPages: number) => string;
  prevLabel?: string;
  nextLabel?: string;
};

export type PaginationProps = PaginationOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof PaginationOwnProps>;

/**
 * Пагинация. Узел 205:6137 в Figma, сверен через MCP-мост: там
 * последовательность номеров (1,2,3,4,5,6,…,34) — статичная иллюстрация
 * в макете, не формула. Здесь вместо неё обычный алгоритм пагинации
 * (siblingCount + boundaryCount, схлопывание пропусков в «…») — те же
 * сборки, что у большинства пагинаций, дают содержательный результат при
 * любых page/totalPages, а не только для чисел из макета.
 */
export function Pagination({
  view = 'default',
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  pageText = (current, total) => `${current} из ${total} страниц`,
  prevLabel = 'Предыдущая страница',
  nextLabel = 'Следующая страница',
  className,
  ...rest
}: PaginationProps) {
  const items = view === 'default' ? getPaginationItems(page, totalPages, siblingCount, boundaryCount) : [];

  return (
    <div {...rest} className={[styles.pagination, className].filter(Boolean).join(' ')}>
      <IconButton
        view="secondary"
        icon={<Icon name="chevron-left" />}
        aria-label={prevLabel}
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
      />

      {view === 'default' &&
        items.map((item, index) =>
          item === 'ellipsis' ? (
            <PageButton key={`ellipsis-${index}`} page={0} hidden />
          ) : (
            <PageButton key={item} page={item} selected={item === page} onClick={() => onPageChange?.(item)} />
          )
        )}

      {view === 'perPage' && <span className={styles.text}>{pageText(page, totalPages)}</span>}

      <IconButton
        view="secondary"
        icon={<Icon name="chevron-right" />}
        aria-label={nextLabel}
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(page + 1)}
      />
    </div>
  );
}
