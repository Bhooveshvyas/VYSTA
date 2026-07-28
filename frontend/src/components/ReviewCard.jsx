import { FiStar } from 'react-icons/fi'
import { formatDate } from '../utils'

export default function ReviewCard({ review }) {
  return (
    <div className="rounded-lg border border-dark-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium text-dark-900">{review.name}</span>
        <span className="text-xs text-dark-400">{formatDate(review.createdAt)}</span>
      </div>
      <div className="mb-2 flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`h-4 w-4 ${
              star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-dark-300'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-dark-600">{review.comment}</p>
    </div>
  )
}
