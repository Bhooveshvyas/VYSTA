import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi'
import { CartContext } from '../context/CartContext'
import EmptyState from '../components/EmptyState'
import { formatCurrency, getImageUrl } from '../utils'

export default function Cart() {
  const { cartItems, updateQty, removeFromCart, cartTotal } = useContext(CartContext)

  if (cartItems.length === 0) {
    return (
      <div className="page-container py-16">
        <EmptyState
          icon={FiShoppingCart}
          title="Your cart is empty"
          message="Looks like you haven't added anything to your cart yet."
          action={
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="page-container py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title mb-8">Shopping Cart</h1>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card-hover flex gap-4 p-4"
            >
              <Link to={`/products/${item.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-dark-100">
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link to={`/products/${item.id}`}>
                    <h3 className="font-semibold text-dark-900 hover:text-primary-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-dark-500">{item.category}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="rounded-lg border border-dark-300 p-1.5 transition-colors hover:bg-dark-50"
                    >
                      <FiMinus className="h-3.5 w-3.5" />
                    </button>
                    <span className="flex h-8 w-10 items-center justify-center text-sm font-medium">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      disabled={item.qty >= item.stock}
                      className="rounded-lg border border-dark-300 p-1.5 transition-colors hover:bg-dark-50 disabled:opacity-30"
                    >
                      <FiPlus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-dark-900">
                      {formatCurrency(item.price * item.qty)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-lg p-1.5 text-dark-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card-hover p-6">
            <h2 className="mb-4 text-lg font-semibold text-dark-900">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-dark-600">
                <span>Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-dark-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <hr className="border-dark-200" />
              <div className="flex justify-between text-lg font-bold text-dark-900">
                <span>Total</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary mt-6 w-full">
              Proceed to Checkout
              <FiArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/products" className="btn-secondary mt-3 w-full">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
