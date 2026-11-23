import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

const getPages = (current, total) => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i)
  }

  const pages = new Set([0, total - 1, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b)

  const result = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push('...')
    }
    result.push(page)
  })

  return result
}

function Pagination({ page, totalPages, onPageChange, className }) {
  if (!totalPages || totalPages <= 1) return null

  const pages = getPages(page, totalPages)

  const baseBtn =
    'flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors'

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1.5', className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="Previous page"
        className={cn(
          baseBtn,
          'text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800',
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, index) =>
        p === '...' ? (
          <span key={`dots-${index}`} className="px-1 text-slate-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              baseBtn,
              p === page
                ? 'gradient-bg text-white shadow-glow'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
            )}
          >
            {p + 1}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Next page"
        className={cn(
          baseBtn,
          'text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800',
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

export default Pagination