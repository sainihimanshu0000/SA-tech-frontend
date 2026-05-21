import React, { createContext, useState, useCallback } from 'react';
import axios from '../api/axios';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch reviews for a product
  const fetchReviews = useCallback(async (productId, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/products/${productId}/reviews`, {
        params: { page, limit }
      });
      setReviews(response.data.reviews);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reviews');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit a review
  const submitReview = useCallback(async (productId, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/api/products/${productId}/reviews`, reviewData);
      setReviews(prev => [response.data.review, ...prev]);
      return response.data.review;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update review
  const updateReview = useCallback(async (reviewId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/reviews/${reviewId}`, updateData);
      setReviews(prev =>
        prev.map(review =>
          review._id === reviewId ? response.data.review : review
        )
      );
      return response.data.review;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete review
  const deleteReview = useCallback(async (reviewId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      setReviews(prev => prev.filter(review => review._id !== reviewId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark review as helpful
  const markHelpful = useCallback(async (reviewId, helpful = true) => {
    try {
      const response = await axios.patch(`/api/reviews/${reviewId}/helpful`, { helpful });
      setReviews(prev =>
        prev.map(review =>
          review._id === reviewId ? response.data.review : review
        )
      );
      return response.data.review;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark review');
      throw err;
    }
  }, []);

  // Get average rating
  const getAverageRating = useCallback(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // Get rating distribution
  const getRatingDistribution = useCallback(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  }, [reviews]);

  const value = {
    reviews,
    loading,
    error,
    fetchReviews,
    submitReview,
    updateReview,
    deleteReview,
    markHelpful,
    getAverageRating,
    getRatingDistribution
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};
