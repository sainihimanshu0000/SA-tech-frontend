import API from './axios';

// Get user's wishlist
export const getWishlist = async (page = 1, limit = 20) => {
  try {
    const res = await API.get('/wishlist', {
      params: { page, limit }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Check if product is in wishlist
export const isProductInWishlist = async (productId) => {
  try {
    const res = await API.get(`/wishlist/check/${productId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  try {
    const res = await API.post(`/wishlist/${productId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const res = await API.delete(`/wishlist/${productId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Clear entire wishlist
export const clearWishlist = async () => {
  try {
    const res = await API.delete('/wishlist');
    return res.data;
  } catch (error) {
    throw error;
  }
};
