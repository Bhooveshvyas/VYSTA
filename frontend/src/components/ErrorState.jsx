import { motion } from 'framer-motion'
import { FiAlertCircle } from 'react-icons/fi'

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 rounded-full bg-red-50 p-4">
        <FiAlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-dark-900">Oops!</h3>
      <p className="mb-6 text-sm text-dark-500">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </motion.div>
  )
}
