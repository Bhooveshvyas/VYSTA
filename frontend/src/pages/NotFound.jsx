import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 text-8xl font-bold text-primary-600">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-dark-900">Page Not Found</h2>
        <p className="mb-8 text-dark-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          <FiArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
