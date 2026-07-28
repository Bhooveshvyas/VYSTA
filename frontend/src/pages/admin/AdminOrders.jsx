import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import { getOrders, updateOrderStatus, deleteOrder } from '../../services/orderService'
import Modal from '../../components/Modal'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { ORDER_STATUSES } from '../../constants'
import { formatCurrency, formatDate } from '../../utils'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, order: null })
  const [submitting, setSubmitting] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getOrders()
      setOrders(data.orders || [])
    } catch (err) {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusChange = async (orderId, status) => {
    setSubmitting(true)
    try {
      await updateOrderStatus(orderId, status)
      toast.success('Order status updated')
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status } : prev)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.order) return
    setSubmitting(true)
    try {
      await deleteOrder(deleteDialog.order.id)
      toast.success('Order deleted')
      setDeleteDialog({ open: false, order: null })
      if (selectedOrder?.id === deleteDialog.order.id) {
        setDetailsOpen(false)
        setSelectedOrder(null)
      }
      fetchOrders()
    } catch (err) {
      toast.error('Failed to delete order')
    } finally {
      setSubmitting(false)
    }
  }

  const openDetails = async (order) => {
    setSelectedOrder(order)
    setDetailsOpen(true)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={fetchOrders} />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-900">Orders</h1>
      </div>

      {orders.length === 0 ? (
        <EmptyState icon={FiShoppingBag} title="No orders" message="No orders have been placed yet." />
      ) : (
        <div className="card-hover overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-dark-50 text-dark-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-dark-50">
                    <td className="px-6 py-4 font-medium text-dark-900">#{order.id}</td>
                    <td className="px-6 py-4 text-dark-600">{order.fullName || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium text-dark-900">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={submitting}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${
                          order.status === 'Delivered' ? 'border-green-200 bg-green-50 text-green-700' :
                          order.status === 'Cancelled' ? 'border-red-200 bg-red-50 text-red-700' :
                          'border-amber-200 bg-amber-50 text-amber-700'
                        }`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-dark-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openDetails(order)} className="btn-ghost text-xs !px-3 !py-1">
                          View
                        </button>
                        <button onClick={() => setDeleteDialog({ open: true, order })} className="rounded-lg p-1.5 text-dark-400 hover:bg-red-50 hover:text-red-600">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={detailsOpen} onClose={() => { setDetailsOpen(false); setSelectedOrder(null) }} title={`Order #${selectedOrder?.id}`} size="lg">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-dark-500">Customer</p>
                <p className="font-medium text-dark-900">{selectedOrder.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Status</p>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  selectedOrder.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                  selectedOrder.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                  'bg-amber-50 text-amber-700'
                }`}>{selectedOrder.status}</span>
              </div>
              <div>
                <p className="text-xs text-dark-500">Total</p>
                <p className="font-medium text-dark-900">{formatCurrency(selectedOrder.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Date</p>
                <p className="font-medium text-dark-900">{formatDate(selectedOrder.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs text-dark-500">Shipping Address</p>
              <p className="text-sm text-dark-700">
                {selectedOrder.fullName}, {selectedOrder.street}, {selectedOrder.city}, {selectedOrder.postalCode}, {selectedOrder.country}
              </p>
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-dark-500">Items</p>
                <div className="space-y-1">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between rounded-lg bg-dark-50 px-3 py-2 text-sm">
                      <span className="text-dark-700">{item.product?.name || `Product #${item.productId}`} x{item.qty}</span>
                      <span className="font-medium text-dark-900">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedOrder.paymentId && (
              <div>
                <p className="text-xs text-dark-500">Payment ID</p>
                <p className="text-sm font-mono text-dark-600">{selectedOrder.paymentId}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmationDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, order: null })}
        onConfirm={handleDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order #${deleteDialog.order?.id}?`}
        loading={submitting}
      />
    </div>
  )
}
