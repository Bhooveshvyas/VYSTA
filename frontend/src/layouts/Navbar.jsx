import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiPackage,
  FiLogOut,
  FiChevronDown,
  FiGrid,
} from 'react-icons/fi'
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { cartCount } = useContext(CartContext)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="sticky top-0 z-30 border-b border-dark-200 bg-white/80 backdrop-blur-lg">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <FiPackage className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-dark-900">
              VYSTA
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-dark-600 transition-colors hover:bg-dark-100 hover:text-dark-900"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative rounded-lg p-2 text-dark-600 transition-colors hover:bg-dark-100"
            >
              <FiShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-lg p-2 text-dark-600 transition-colors hover:bg-dark-100"
                >
                  <FiUser className="h-5 w-5" />
                  <span className="hidden text-sm font-medium md:inline">
                    {user.name || user.email}
                  </span>
                  <FiChevronDown className="hidden h-4 w-4 md:block" />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-dark-200 bg-white p-1 shadow-lg"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-dark-600 hover:bg-dark-50"
                      >
                        <FiUser className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        to="/my-orders"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-dark-600 hover:bg-dark-50"
                      >
                        <FiPackage className="h-4 w-4" />
                        My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-dark-600 hover:bg-dark-50"
                        >
                          <FiGrid className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-1 border-dark-200" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm !px-4 !py-2">
                Sign In
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-dark-600 md:hidden"
            >
              {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-dark-200 md:hidden"
          >
            <div className="page-container space-y-1 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-dark-600 hover:bg-dark-100"
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-dark-600 hover:bg-dark-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-dark-600 hover:bg-dark-100"
                  >
                    My Orders
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
