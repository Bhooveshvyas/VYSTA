import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <motion.div
        className={`rounded-full border-2 border-dark-200 border-t-primary-600 ${sizes[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="text-sm text-dark-500">{text}</p>}
    </div>
  )
}
