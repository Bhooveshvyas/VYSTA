import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiCheck, FiEdit2, FiLogIn } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { getProductById, getReviews, addReview, deleteReview } from '../services/productService'
import { checkHasPurchasedProduct } from '../services/orderService'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import Breadcrumb from '../components/Breadcrumb'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'
import Modal from '../components/Modal'
import { formatCurrency, getImageUrl, getStockStatus } from '../utils'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [reviews, setReviews] = useState([])
  const [hasPurchased, setHasPurchased] = useState(false)
  const [userReview, setUserReview] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const { addToCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()

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

  const fetchReviews = async () => {
    try {
      const data = await getReviews(id)
      const reviewList = Array.isArray(data) ? data : (data?.reviews || []);
      setReviews(reviewList);
      if (user) {
        const existing = reviewList.find((r) => r.userId === user.id);
        setUserReview(existing || null);
      }
    } catch {
      setReviews([]);
    }
  }

  const checkPurchase = async () => {
    if (!user) {
      setHasPurchased(false);
      return;
    }
    try {
      const data = await checkHasPurchasedProduct(id)
      setHasPurchased(data.hasPurchased || false)
    } catch {
      setHasPurchased(false)
    }
  }

  useEffect(() => {
    fetchProduct()
    fetchReviews()
    checkPurchase()
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user])

  const handleReviewSubmit = async (data) => {
    setReviewLoading(true)
    try {
      const updatedProduct = await addReview(id, { rating: Number(data.rating), comment: data.comment })
      setProduct(updatedProduct)
      await fetchReviews()
      setShowReviewModal(false)
      reset()
    } catch (err) {
      // Error handled by axios interceptor toast
    } finally {
      setReviewLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(id, reviewId)
      await fetchReviews()
      fetchProduct()
    } catch {
      // Error handled by axios interceptor toast
    }
  }

  const openEditReview = () => {
    if (userReview) {
      setValue('rating', userReview.rating)
      setValue('comment', userReview.comment)
    }
    setShowReviewModal(true)
  }

  if (loading) return <div className="page-container py-16"><LoadingSpinner /></div>
  if (error) return <div className="page-container py-16"><ErrorState message={error} onRetry={fetchProduct} /></div>
  if (!product) return <div className="page-container py-16"><ErrorState message="Product not found" /></div>

  const stockStatus = getStockStatus(product.stock)

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

      {/* Reviews Section */}
      <section className="mt-12 border-t border-dark-200 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark-900">
            Customer Reviews ({product.numReviews || 0})
          </h2>
          {user && hasPurchased && (
            <button
              onClick={userReview ? openEditReview : () => setShowReviewModal(true)}
              className="btn-outline"
            >
              {userReview ? <FiEdit2 className="h-4 w-4" /> : <FiStar className="h-4 w-4" />}
              {userReview ? 'Edit Review' : 'Write a Review'}
            </button>
          )}
          {!user && (
            <button
              onClick={() => navigate('/login?redirect=' + encodeURIComponent(window.location.pathname))}
              className="btn-outline"
            >
              <FiLogIn className="h-4 w-4" />
              Login to Review
            </button>
          )}
          {user && !hasPurchased && (
            <button
              disabled
              className="btn-outline opacity-50"
            >
              Purchase to Review
            </button>
          )}
        </div>

        {/* Rating Summary */}
        {reviews.length > 0 && (
          <div className="mb-6 rounded-xl bg-dark-25 p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-3xl font-bold text-dark-900">{product.ratings || 0}</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(product.ratings || 0) ? 'fill-amber-400 text-amber-400' : 'text-dark-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-dark-500">({product.numReviews || 0} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-dark-500">
              Based on {product.numReviews || 0} customer reviews
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isOwnReview={user && review.userId === user.id}
                onDelete={handleDeleteReview}
                onEdit={userReview ? () => setShowReviewModal(true) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <FiStar className="mx-auto mb-3 h-12 w-12 text-dark-300" />
            <p className="text-sm text-dark-500">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </section>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={userReview ? 'Edit Your Review' : 'Write a Review'}
        size="md"
      >
        <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-700">Rating</label>
            <select
              {...register('rating', { required: 'Please select a rating' })}
              className={`select-field w-full ${errors.rating ? 'border-red-500' : ''}`}
              defaultValue={userReview?.rating || ''}
            >
              <option value="">Select a rating</option>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
            {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark-700">Review</label>
            <textarea
              {...register('comment', { required: 'Please write a review' })}
              rows={4}
              className={`input-field w-full resize-y ${errors.comment ? 'border-red-500' : ''}`}
              placeholder="Share your experience..."
              defaultValue={userReview?.comment || ''}
            />
            {errors.comment && <p className="mt-1 text-xs text-red-500">{errors.comment.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reviewLoading}
              className="btn-primary"
            >
              {reviewLoading ? <LoadingSpinner size="sm" text="" /> : (userReview ? 'Update Review' : 'Submit Review')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
