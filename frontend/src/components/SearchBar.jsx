import { FiSearch, FiX } from 'react-icons/fi'

export default function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  return (
    <div className="relative">
      <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
