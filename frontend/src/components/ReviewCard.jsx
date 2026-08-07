import { FiStar, FiTrash2 } from 'react-icons/fi'
import { formatDate } from '../utils'
import ConfirmationDialog from './ConfirmationDialog'
import { useState } from 'react'

export default function ReviewCard({ review, isOwnReview, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(review.id)
      setShowConfirm(false)
    }
  }

  const confirmDelete = () => {
    setShowConfirm(true)
  }

  return (
    <>
      <div className="rounded-xl border border-dark-200 p-4 transition-shadow hover:shadow-sm">
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

        {isOwnReview && (
          <div className="mt-3 flex justify-end gap-2 border-t border-dark-200 pt-2">
            <button
              onClick={confirmDelete}
              className="rounded-lg p-1.5 text-xs text-red-600 hover:bg-red-50"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
      />
    </>
  )
}
