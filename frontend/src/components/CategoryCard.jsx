import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const categoryIcons = {
  'Cleaning Supplies': '🧹',
  'Home Essentials': '🏠',
  'Personal Care': '🧴',
  Kitchen: '🍳',
  Laundry: '🧺',
  Disinfectants: '🧪',
  'Paper Products': '📄',
  'Eco-Friendly': '🌿',
}

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/products?category=${category}`}
        className="card-hover flex flex-col items-center gap-3 p-6 text-center"
      >
        <span className="text-3xl">{categoryIcons[category] || '📦'}</span>
        <span className="text-sm font-semibold text-dark-700">{category}</span>
      </Link>
    </motion.div>
  )
}
