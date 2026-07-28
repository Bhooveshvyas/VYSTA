export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const getImageUrl = (url) => {
  if (!url) return '/placeholder.svg'
  if (url.startsWith('http') || url.startsWith('data:')) return url
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`
}

export const classNames = (...classes) => classes.filter(Boolean).join(' ')

export const getStockStatus = (stock) => {
  if (stock <= 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' }
  if (stock <= 5) return { label: 'Low Stock', color: 'text-amber-600 bg-amber-50' }
  return { label: 'In Stock', color: 'text-green-600 bg-green-50' }
}
