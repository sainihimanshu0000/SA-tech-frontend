import API from './axios';

// Get reviews for a product
export const getProductReviews = async (productId, page = 1, limit = 10, sortBy = 'recent') => {
  try {
    const res = await API.get(`/reviews/product/${productId}`, {
      params: { page, limit, sortBy }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get review statistics for a product
export const getReviewStats = async (productId) => {
  try {
    const res = await API.get(`/reviews/product/${productId}/stats`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Add a review to a product
export const addReview = async (productId, reviewData) => {
  try {
    const res = await API.post(`/reviews/product/${productId}`, reviewData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Update a review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const res = await API.put(`/reviews/${reviewId}`, reviewData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const res = await API.delete(`/reviews/${reviewId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Mark review as helpful/unhelpful
export const markReviewHelpful = async (reviewId, isHelpful) => {
  try {
    const res = await API.patch(`/reviews/${reviewId}/helpful`, { isHelpful });
    return res.data;
  } catch (error) {
    throw error;
  }
};
