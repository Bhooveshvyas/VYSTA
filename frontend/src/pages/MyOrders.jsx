import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiChevronRight } from 'react-icons/fi'
import { getMyOrders } from '../services/orderService'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { formatCurrency, formatDate } from '../utils'

const statusColors = {
  Pending: 'bg-amber-50 text-amber-700',
  Processing: 'bg-blue-50 text-blue-700',
  Shipped: 'bg-purple-50 text-purple-700',
  Delivered: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700',
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title mb-8">My Orders</h1>
      </motion.div>

      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-hover overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-dark-500">
                    Order #{order.id} • {formatDate(order.createdAt)}
                  </p>
                  <p className="text-lg font-bold text-dark-900">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status] || 'bg-dark-50 text-dark-700'}`}>
                  {order.status}
                </span>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {order.items.slice(0, 3).map((item) => (
                    <span key={item.id} className="rounded-lg bg-dark-50 px-3 py-1.5 text-xs text-dark-600">
                      {item.product?.name || `Product #${item.productId}`} x{item.qty}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="rounded-lg bg-dark-50 px-3 py-1.5 text-xs text-dark-400">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
