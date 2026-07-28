import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiArrowLeft,
  FiMenu,
  FiX,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const sidebarLinks = [
    { label: 'Dashboard', href: '/admin', icon: FiGrid },
  { label: 'Products', href: '/admin/products', icon: FiPackage },
  { label: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
  { label: 'Users', href: '/admin/users', icon: FiUsers },
]

export default function AdminLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-20 z-40 rounded-lg border border-dark-200 bg-white p-2 shadow-md lg:hidden"
      >
        {sidebarOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 transform border-r border-dark-200 bg-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <Link
            to="/"
            className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-dark-500 hover:bg-dark-50"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-dark-600 hover:bg-dark-50'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      <div className="flex-1 overflow-auto p-4 lg:p-8">
        <Outlet />
      </div>
    </div>
  )
}
