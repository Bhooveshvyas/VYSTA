export function ProductCardSkeleton() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="aspect-square bg-dark-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-dark-200" />
        <div className="h-3 w-1/2 rounded bg-dark-200" />
        <div className="h-4 w-1/4 rounded bg-dark-200" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 flex-1 rounded bg-dark-200" />
          ))}
        </div>
      ))}
    </div>
  )
}
