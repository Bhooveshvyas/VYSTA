import { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiChevronLeft, FiPackage, FiCheck } from 'react-icons/fi'
import { getProductById } from '../services/productService'
import { CartContext } from '../context/CartContext'
import Breadcrumb from '../components/Breadcrumb'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'
import ReviewCard from '../components/ReviewCard'
import { formatCurrency, getImageUrl, getStockStatus } from '../utils'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const { addToCart } = useContext(CartContext)

  const fetchProduct = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProductById(id)
      setProduct(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  if (loading) return <div className="page-container py-16"><LoadingSpinner /></div>
  if (error) return <div className="page-container py-16"><ErrorState message={error} onRetry={fetchProduct} /></div>
  if (!product) return <div className="page-container py-16"><ErrorState message="Product not found" /></div>

  const stockStatus = getStockStatus(product.stock)
  const { reviews } = product

  return (
    <div className="page-container py-8">
      <Breadcrumb items={[{ label: 'Products', href: '/products' }, { label: product.name }]} />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="overflow-hidden rounded-xl bg-dark-50"
        >
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-600">
            {product.category}
          </p>
          <h1 className="mb-3 text-2xl font-bold text-dark-900 md:text-3xl">{product.name}</h1>

          <div className="mb-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FiStar className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-dark-700">{product.ratings || 0}</span>
            </div>
            <span className="text-sm text-dark-400">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          <p className="mb-6 text-3xl font-bold text-dark-900">
            {formatCurrency(product.price)}
          </p>

          <p className="mb-6 leading-relaxed text-dark-600">{product.description}</p>

          <div className="mb-6 flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stockStatus.color}`}>
              {stockStatus.label}
            </span>
            {product.stock > 0 && (
              <span className="text-sm text-dark-500">{product.stock} units available</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="mb-6 flex items-center gap-4">
              <span className="text-sm font-medium text-dark-700">Quantity:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="rounded-lg border border-dark-300 p-2 transition-colors hover:bg-dark-50"
                >
                  <FiMinus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center text-sm font-medium">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="rounded-lg border border-dark-300 p-2 transition-colors hover:bg-dark-50"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => addToCart(product, qty)}
            disabled={product.stock <= 0}
            className="btn-primary w-full md:w-auto"
          >
            <FiShoppingCart className="h-5 w-5" />
            Add to Cart — {formatCurrency(product.price * qty)}
          </button>

          {/* Features */}
          <div className="mt-8 space-y-3 border-t border-dark-200 pt-6">
            <div className="flex items-center gap-2 text-sm text-dark-600">
              <FiCheck className="h-4 w-4 text-green-500" />
              Free delivery on orders above ₹499
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-600">
              <FiCheck className="h-4 w-4 text-green-500" />
              30-day easy returns
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-600">
              <FiCheck className="h-4 w-4 text-green-500" />
              Secure checkout with Razorpay
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <section className="mt-12 border-t border-dark-200 pt-8">
          <h2 className="mb-6 text-xl font-bold text-dark-900">
            Customer Reviews ({reviews.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
