import React, { useState } from 'react';
import { Button, Input, Card } from './UI';

export default function ReviewForm({ productId, onSubmit, loading = false, initialData = null }) {
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [title, setTitle] = useState(initialData?.title || '');
  const [comment, setComment] = useState(initialData?.comment || '');
  const [images, setImages] = useState(initialData?.images || []);
  const [imagePreview, setImagePreview] = useState(initialData?.images || []);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 3) {
      setError('You can only upload up to 3 images');
      return;
    }

    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(previews => {
      setImagePreview(prev => [...prev, ...previews]);
      setImages(prev => [...prev, ...files]);
      setError('');
    });
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    if (comment.length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    if (comment.length > 500) {
      setError('Review cannot exceed 500 characters');
      return;
    }

    try {
      await onSubmit({
        rating: parseInt(rating),
        title: title.trim() || 'No title',
        comment: comment.trim(),
        images: imagePreview
      });
      
      // Reset form
      setRating(5);
      setTitle('');
      setComment('');
      setImages([]);
      setImagePreview([]);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    }
  };

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">{rating} out of 5 stars</p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title (optional)
          </label>
          <Input
            type="text"
            placeholder="Summarize your experience"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/60 characters</p>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell other customers about this product. What did you like or dislike about it?"
            maxLength={500}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (optional - up to 3)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            disabled={images.length >= 3}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100
              disabled:file:bg-gray-100
              disabled:file:text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {images.length}/3 images uploaded
          </p>

          {/* Image Preview */}
          {imagePreview.length > 0 && (
            <div className="flex gap-3 mt-4">
              {imagePreview.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="submit"
            text={initialData ? 'Update Review' : 'Submit Review'}
            loading={loading}
            className="flex-1"
          />
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Tips for a helpful review:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Be specific and honest</li>
            <li>✓ Share your actual experience with the product</li>
            <li>✓ Include relevant details (quality, durability, value for money)</li>
            <li>✓ Add photos if you have them</li>
            <li>✓ Avoid personal comments about other reviewers</li>
          </ul>
        </div>
      </form>
    </Card>
  );
}
