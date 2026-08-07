import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiChevronRight } from 'react-icons/fi'
import { getMyOrders } from '../services/orderService'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { formatCurrency, formatDate, getImageUrl } from '../utils'

const statusConfig = {
  Pending: {
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Order Placed',
  },
  Processing: {
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Processing',
  },
  Shipped: {
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    label: 'Shipped',
  },
  Delivered: {
    color: 'bg-green-50 text-green-700 border-green-200',
    label: 'Delivered',
  },
  Cancelled: {
    color: 'bg-red-50 text-red-700 border-red-200',
    label: 'Cancelled',
  },
}

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyOrders()
      setOrders(data.orders || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) return <div className="page-container py-16"><LoadingSpinner /></div>
  if (error) return <div className="page-container py-16"><ErrorState message={error} onRetry={fetchOrders} /></div>

  if (orders.length === 0) {
    return (
      <div className="page-container py-16">
        <EmptyState
          icon={FiPackage}
          title="No orders yet"
          message="You haven't placed any orders yet."
          action={
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="page-container py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="section-title">My Orders</h1>
        <p className="mt-2 text-sm text-dark-500">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
        </p>
      </motion.div>

      <div className="space-y-6">
        {orders.map((order, idx) => {
          const orderStatus = statusConfig[order.status] || statusConfig.Pending
          const displayItems = order.items?.slice(0, 4) || []
          const remainingCount = (order.items?.length || 0) - 4
          const isPaid = order.paymentId && order.paymentId.trim() !== ''

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="overflow-hidden rounded-xl border border-dark-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-3 border-b border-dark-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-dark-500">
                    Order #{order.id} · Placed on {formatDate(order.createdAt)}
                  </span>
                  <span className="text-xl font-bold text-dark-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${orderStatus.color}`}>
                    {orderStatus.label}
                  </span>
                  <Link
                    to={`/my-orders/${order.id}`}
                    className="rounded-lg p-2 text-dark-400 opacity-0 transition-opacity hover:text-primary-600 hover:opacity-100 group-hover:opacity-100 sm:opacity-100"
                  >
                    <FiChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div className="px-4 py-4 sm:px-6">
                  <div className="space-y-3">
                    {displayItems.map((item) => {
                      const product = item.product
                      return (
                        <div key={item.id} className="flex items-start gap-3">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-dark-200 bg-dark-50">
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
                            {item.qty > 1 && (
                              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary-600 text-[10px] font-bold text-white">
                                {item.qty}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-dark-900 line-clamp-2">
                              {product?.name || `Product #${item.productId}`}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                              <span className="text-xs text-dark-500">
                                Qty: {item.qty}
                              </span>
                              <span className="text-xs text-dark-500">
                                ₹{item.price} each
                              </span>
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

                    {remainingCount > 0 && (
                      <div className="flex items-center justify-center rounded-lg bg-dark-25 py-2 text-xs text-dark-500">
                        +{remainingCount} more {remainingCount === 1 ? 'item' : 'items'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Footer */}
              <div className="flex flex-col gap-2 border-t border-dark-200 bg-dark-25 px-4 py-3 text-xs text-dark-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Payment:</span>
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                      Unpaid
                    </span>
                  )}
                </div>
                <Link
                  to={`/my-orders/${order.id}`}
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  View Order Details
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
