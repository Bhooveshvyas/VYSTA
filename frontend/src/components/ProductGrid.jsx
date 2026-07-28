import ProductCard from './ProductCard'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'
import { ProductGridSkeleton } from './SkeletonLoader'
import { FiPackage } from 'react-icons/fi'

export default function ProductGrid({ products, loading, error, onRetry }) {
  if (loading) return <ProductGridSkeleton />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={FiPackage}
        title="No products found"
        message="Try adjusting your search or filter criteria."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
