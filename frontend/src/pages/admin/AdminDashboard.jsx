import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi'
import { getAdminStats } from '../../services/adminService'
import { getOrders } from '../../services/orderService'
import { getProducts } from '../../services/productService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import { formatCurrency } from '../../utils'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsData, ordersData] = await Promise.all([
        getAdminStats(),
        getOrders(),
      ])
      setStats(statsData)
      setRecentOrders((ordersData.orders || []).slice(0, 5))
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={fetchData} />

  const cards = [
    { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: FiDollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: FiShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: FiPackage, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-8 text-2xl font-bold text-dark-900">Admin Dashboard</h1>
      </motion.div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-hover p-6"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-dark-500">{card.label}</span>
              <div className={`rounded-lg p-2 ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-dark-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="card-hover overflow-hidden">
        <div className="border-b border-dark-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-dark-900">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-6 text-center text-sm text-dark-500">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-dark-50 text-dark-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-dark-50">
                    <td className="px-6 py-4 font-medium text-dark-900">#{order.id}</td>
                    <td className="px-6 py-4 text-dark-600">{order.fullName || 'N/A'}</td>
                    <td className="px-6 py-4 text-dark-900">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
