import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="btn-ghost rounded-lg p-2 disabled:opacity-30"
      >
        <FiChevronLeft className="h-5 w-5" />
      </button>
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dot-${i}`} className="px-2 text-dark-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
              page === currentPage
                ? 'bg-primary-600 text-white'
                : 'text-dark-600 hover:bg-dark-100'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="btn-ghost rounded-lg p-2 disabled:opacity-30"
      >
        <FiChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
