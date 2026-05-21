import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from '../api/axios';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/wishlist');
      setWishlistItems(response.data.wishlist || []);
      return response.data.wishlist;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wishlist');
      // Fallback to localStorage
      const saved = localStorage.getItem('agromart_wishlist');
      setWishlistItems(saved ? JSON.parse(saved) : []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('agromart_wishlist');
    if (saved) {
      setWishlistItems(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('agromart_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add to wishlist
  const addToWishlist = useCallback(async (productId) => {
    try {
      const response = await axios.post(`/wishlist/${productId}`);
      setWishlistItems(prev => [...prev, response.data.product]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to wishlist');
      // Fallback: add to localStorage
      setWishlistItems(prev => [...prev, { _id: productId }]);
      throw err;
    }
  }, []);

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (productId) => {
    try {
      await axios.delete(`/wishlist/${productId}`);
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove from wishlist');
      // Fallback: remove from localStorage
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      throw err;
    }
  }, []);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item._id === productId);
  }, [wishlistItems]);

  // Toggle wishlist
  const toggleWishlist = useCallback(async (product) => {
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  // Clear wishlist
  const clearWishlist = useCallback(async () => {
    try {
      await axios.delete('/wishlist');
      setWishlistItems([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear wishlist');
      setWishlistItems([]);
    }
  }, []);

  const value = {
    wishlistItems,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    count: wishlistItems.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
