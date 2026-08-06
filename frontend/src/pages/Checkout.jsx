import { useContext, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiArrowLeft, FiSmartphone, FiCreditCard } from 'react-icons/fi'
import { CartContext } from '../context/CartContext'
import { createOrder } from '../services/orderService'
import { createPaymentOrder, verifyPayment } from '../services/paymentService'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { formatCurrency, getImageUrl } from '../utils'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [paymentOrder, setPaymentOrder] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const paymentResolver = useRef(null)
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  if (cartItems.length === 0) {
    return (
      <div className="page-container py-16">
        <EmptyState
          icon={FiShoppingCart}
          title="Your cart is empty"
          message="Add some products before checking out."
          action={
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          }
        />
      </div>
    )
  }

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }, [])

  const openRazorpayCheckout = useCallback(async (orderData, order) => {
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      toast.error('Failed to load payment gateway. Please refresh and try again.')
      return
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'VYSTA',
        description: `Payment for ${orderData.items.length} items`,
        order_id: order.id,
        method: { upi: true },
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            resolve(response.razorpay_payment_id)
          } catch {
            reject(new Error('Payment verification failed'))
          }
        },
        prefill: {
          name: orderData.address.fullName,
          email: '',
          contact: '',
        },
        theme: { color: '#52525b' },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled')),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => reject(new Error('Payment failed')))
      rzp.open()
    })
  }, [keyId, loadRazorpayScript])

  const handlePayment = useCallback(async (orderData) => {
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      toast.error('Failed to load payment gateway. Please refresh and try again.')
      return
    }

    const order = await createPaymentOrder(orderData.totalAmount)
    setPaymentOrder(order)

    if (order.qrCode) {
      setQrCode(order.qrCode)
      setShowPaymentModal(true)
      return new Promise((resolve, reject) => {
        paymentResolver.current = { resolve, reject, orderData, order }
      })
    }

    return await openRazorpayCheckout(orderData, order)
  }, [loadRazorpayScript, openRazorpayCheckout])

  const handlePayWithRazorpay = async () => {
    if (!paymentResolver.current) return
    const { resolve, reject, orderData, order } = paymentResolver.current
    setShowPaymentModal(false)
    try {
      const paymentId = await openRazorpayCheckout(orderData, order)
      resolve(paymentId)
    } catch (err) {
      reject(err)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          qty: item.qty,
          price: item.price,
        })),
        totalAmount: cartTotal,
        address: {
          fullName: data.fullName,
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
      }

      const paymentId = await handlePayment(orderData)
      await createOrder({ ...orderData, paymentId })
      clearCart()
      toast.success('Payment successful! Order placed.')
      navigate('/my-orders')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to place order'
      if (msg !== 'Payment cancelled') toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title mb-8">Checkout</h1>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
          <div className="card-hover p-6">
            <h2 className="mb-4 text-lg font-semibold text-dark-900">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-dark-700">Full Name *</label>
                <input
                  type="text"
                  {...register('fullName', { required: 'Full name is required' })}
                  className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark-700">Street Address *</label>
                <input
                  type="text"
                  {...register('street', { required: 'Street address is required' })}
                  className={`input-field ${errors.street ? 'border-red-500' : ''}`}
                />
                {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-700">City *</label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-700">Postal Code *</label>
                  <input
                    type="text"
                    {...register('postalCode', { required: 'Postal code is required' })}
                    className={`input-field ${errors.postalCode ? 'border-red-500' : ''}`}
                  />
                  {errors.postalCode && <p className="mt-1 text-xs text-red-500">{errors.postalCode.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-700">Country *</label>
                  <input
                    type="text"
                    {...register('country', { required: 'Country is required' })}
                    className={`input-field ${errors.country ? 'border-red-500' : ''}`}
                    defaultValue="India"
                  />
                  {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link to="/cart" className="btn-ghost">
              <FiArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <LoadingSpinner size="sm" text="" /> : 'Place Order & Pay'}
            </button>
          </div>
        </form>

        <div>
          <div className="card-hover p-6">
            <h2 className="mb-4 text-lg font-semibold text-dark-900">Order Summary</h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-dark-100">
                    <img src={getImageUrl(item.imageUrl)} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-dark-900">{item.name}</p>
                    <p className="text-xs text-dark-500">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-medium text-dark-900">
                    {formatCurrency(item.price * item.qty)}
                  </span>
                </div>
              ))}
              <hr className="border-dark-200" />
              <div className="flex justify-between text-lg font-bold text-dark-900">
                <span>Total</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showPaymentModal} onClose={() => {
        setShowPaymentModal(false)
        paymentResolver.current?.reject(new Error('Payment cancelled'))
      }} title="Scan to Pay" size="md">
        <div className="space-y-6 py-2">
          <div className="rounded-xl bg-dark-50 p-3 text-center text-sm text-dark-600">
            Pay <strong>{formatCurrency(cartTotal)}</strong> via UPI or payment gateway
          </div>

          <div className="mx-auto w-fit rounded-xl bg-white p-4 shadow-inner">
            {qrCode?.qr_data ? (
              <img src={qrCode.qr_data} alt="UPI QR Code" className="mx-auto h-56 w-56 object-contain" />
            ) : (
              <div className="flex h-56 w-56 items-center justify-center text-dark-300">
                <FiSmartphone className="h-16 w-16" />
              </div>
            )}
          </div>

          <p className="text-center text-xs text-dark-400">
            Scan with any UPI app (GPay, PhonePe, Paytm) to pay instantly
          </p>
          {qrCode?.upi_link && (
            <p className="text-center text-[10px] text-dark-300 break-all">
              UPI ID: {qrCode.upi_link.split('pa=')[1]?.split('&')[0] || 'Not configured'}
            </p>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-dark-400">or</span>
            </div>
          </div>

          <button onClick={handlePayWithRazorpay} className="btn-primary w-full">
            <FiCreditCard className="h-4 w-4" />
            Pay with Cards / Net Banking / UPI
          </button>
        </div>
      </Modal>
    </div>
  )
}
