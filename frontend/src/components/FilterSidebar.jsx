import { PRODUCT_CATEGORIES } from '../constants'
import { FiX } from 'react-icons/fi'

export default function FilterSidebar({ selectedCategory, onCategoryChange, onClose, isOpen }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white p-6 shadow-lg transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <h3 className="font-semibold text-dark-900">Filters</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-dark-400 hover:bg-dark-100">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-dark-500">
            Categories
          </h3>
          <div className="space-y-1">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  (cat === 'All' && !selectedCategory) || selectedCategory === cat
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-dark-600 hover:bg-dark-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
