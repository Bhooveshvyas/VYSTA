import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiStar } from 'react-icons/fi'
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { formatCurrency, getImageUrl, getStockStatus } from '../utils'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useContext(CartContext)
  const stockStatus = getStockStatus(product.stock)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card-hover group overflow-hidden"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-dark-100">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-dark-900">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary-600">
          {product.category}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="mb-1 font-semibold text-dark-900 transition-colors group-hover:text-primary-600">
            {product.name}
          </h3>
        </Link>

        <div className="mb-2 flex items-center gap-1">
          <FiStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-dark-700">{product.ratings || 0}</span>
          <span className="text-xs text-dark-400">({product.numReviews || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-dark-900">{formatCurrency(product.price)}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stockStatus.color}`}>
            {stockStatus.label}
          </span>
        </div>

        <button
          onClick={() => addToCart(product, 1)}
          disabled={product.stock <= 0}
          className="btn-primary mt-3 w-full"
        >
          <FiShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}
