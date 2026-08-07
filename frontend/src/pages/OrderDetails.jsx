import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiChevronLeft, FiMapPin } from 'react-icons/fi'
import { getMyOrderById } from '../services/orderService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'
import { formatCurrency, formatDate, getImageUrl } from '../utils'

const statusConfig = {
  Pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Order Placed' },
  Processing: { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Processing' },
  Shipped: { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Shipped' },
  Delivered: { color: 'bg-green-50 text-green-700 border-green-200', label: 'Delivered' },
  Cancelled: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Cancelled' },
}

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrder = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyOrderById(id)
      setOrder(data.order || data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
    window.scrollTo(0, 0)
  }, [id])

  if (loading) return <div className="page-container py-16"><LoadingSpinner /></div>
  if (error) return <div className="page-container py-16"><ErrorState message={error} onRetry={fetchOrder} /></div>
  if (!order) return <div className="page-container py-16"><ErrorState message="Order not found" /></div>

  const orderStatus = statusConfig[order.status] || statusConfig.Pending
  const isPaid = order.paymentId && order.paymentId.trim() !== ''

  return (
    <div className="page-container py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/my-orders" className="mb-4 inline-flex items-center text-sm text-dark-500 hover:text-dark-900">
          <FiChevronLeft className="mr-1 h-4 w-4" />
          Back to My Orders
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="section-title">Order #{order.id}</h1>
      </motion.div>

      <div className="rounded-xl border border-dark-200 bg-white shadow-sm">
        {/* Order Header */}
        <div className="border-b border-dark-200 px-6 py-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-dark-500">
                Placed on {formatDate(order.createdAt)}
              </p>
              <p className="text-xl font-bold text-dark-900">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${orderStatus.color}`}>
                {orderStatus.label}
              </span>
              {isPaid ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                  Paid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                  Unpaid
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="px-6 py-4">
            <h2 className="mb-4 text-sm font-medium text-dark-700">Items Ordered</h2>
            <div className="space-y-3">
              {order.items.map((item) => {
                const product = item.product
                return (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-dark-200 bg-dark-50">
                      {product?.imageUrl ? (
                        <img
                          src={getImageUrl(product.imageUrl)}
                          alt={product?.name || 'Product'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-dark-100 text-dark-300">
                          <FiPackage className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.productId}`} className="text-sm font-medium text-dark-900 hover:text-primary-600">
                        {product?.name || `Product #${item.productId}`}
                      </Link>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-xs text-dark-500">Qty: {item.qty}</span>
                        <span className="text-xs text-dark-500">₹{item.price} each</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-dark-900">
                        {formatCurrency(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Shipping Address */}
        <div className="border-t border-dark-200 px-6 py-4">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-medium text-dark-700">
            <FiMapPin className="h-4 w-4" />
            Shipping Address
          </h2>
          <p className="text-sm text-dark-600">
            {order.fullName}, {order.street}, {order.city}, {order.postalCode}, {order.country}
          </p>
        </div>

        {/* Order Summary */}
        <div className="border-t border-dark-200 bg-dark-25 px-6 py-4">
          <div className="flex justify-between text-sm">
            <span className="text-dark-500">Subtotal</span>
            <span className="font-medium text-dark-900">{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dark-500">Shipping</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-dark-200 pt-2 text-lg font-bold text-dark-900">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
