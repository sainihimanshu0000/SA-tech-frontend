import { useState, useCallback } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const addToWishlist = useCallback((product) => {
    setWishlist(prevList => {
      if (prevList.find(item => item.productId === product.productId)) {
        return prevList;
      }
      const updated = [...prevList, product];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist(prevList => {
      const updated = prevList.filter(item => item.productId !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item.productId === productId);
  }, [wishlist]);

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount: wishlist.length,
  };
};
