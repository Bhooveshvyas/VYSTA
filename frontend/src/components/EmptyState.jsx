import { motion } from 'framer-motion'
import { FiInbox } from 'react-icons/fi'

export default function EmptyState({ icon: Icon = FiInbox, title, message, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 rounded-full bg-dark-100 p-4">
        <Icon className="h-8 w-8 text-dark-400" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-dark-900">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-dark-500">{message}</p>
      {action}
    </motion.div>
  )
}
