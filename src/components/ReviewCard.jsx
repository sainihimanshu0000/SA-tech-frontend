import React, { useState } from 'react';
import { Button, Badge } from './UI';

export default function ReviewCard({ review, onMarkHelpful, currentUserId, onDelete, onEdit }) {
  const [showHelpful, setShowHelpful] = useState(false);

  const isOwner = currentUserId === review.user?._id;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-yellow-400">
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </div>
            <span className="text-sm text-gray-600">{review.rating} out of 5</span>
          </div>
        </div>
        {review.verified && (
          <Badge text="✓ Verified Purchase" color="green" />
        )}
      </div>

      {/* Review Title */}
      {review.title && (
        <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
      )}

      {/* Review Comment */}
      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4">
          {review.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Review ${idx + 1}`}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4">
          {/* Helpful Counter */}
          <button
            onClick={() => onMarkHelpful && onMarkHelpful(review._id, true)}
            className="text-sm text-gray-600 hover:text-green-600 flex items-center gap-1"
          >
            👍 Helpful ({review.helpful || 0})
          </button>

          {/* Not Helpful Counter */}
          <button
            onClick={() => onMarkHelpful && onMarkHelpful(review._id, false)}
            className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1"
          >
            👎 Not Helpful ({review.notHelpful || 0})
          </button>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit && onEdit(review._id)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this review?')) {
                  onDelete && onDelete(review._id);
                }
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Date */}
      <p className="text-xs text-gray-500 mt-3">
        {new Date(review.createdAt).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </p>
    </div>
  );
}
