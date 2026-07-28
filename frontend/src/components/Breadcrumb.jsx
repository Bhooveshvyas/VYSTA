import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

export default function Breadcrumb({ items }) {
  return (
    <nav className="mb-6 flex items-center gap-1 text-sm text-dark-500">
      <Link to="/" className="hover:text-primary-600 transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <FiChevronRight className="h-3.5 w-3.5" />
          {item.href ? (
            <Link to={item.href} className="hover:text-primary-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-dark-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
