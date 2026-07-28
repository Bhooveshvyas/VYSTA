import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmClass = 'btn-danger', loading = false }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-50 p-2">
                <FiAlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-dark-900">{title}</h3>
            </div>
            <p className="mb-6 text-sm text-dark-600">{message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="btn-secondary" disabled={loading}>
                Cancel
              </button>
              <button onClick={onConfirm} className={confirmClass} disabled={loading}>
                {loading ? 'Processing...' : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
