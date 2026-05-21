import React, { createContext, useState, useCallback, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('agromart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('agromart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1, variant = null) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item._id === product._id && JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id && JSON.stringify(item.variant) === JSON.stringify(variant)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity, variant }];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId, variant = null) => {
    setCartItems(prevItems =>
      prevItems.filter(
        item => !(item._id === productId && JSON.stringify(item.variant) === JSON.stringify(variant))
      )
    );
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId, quantity, variant = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === productId && JSON.stringify(item.variant) === JSON.stringify(variant)
            ? { ...item, quantity }
            : item
        )
      );
    }
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCoupon(null);
    setDiscountAmount(0);
  }, []);

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const subtotal = cartItems.reduce((acc, item) => {
      const price = item.variant?.price || item.price;
      return acc + price * item.quantity;
    }, 0);

    return {
      subtotal,
      discount: discountAmount,
      tax: subtotal * 0.18, // 18% GST
      total: subtotal - discountAmount + (subtotal * 0.18)
    };
  }, [cartItems, discountAmount]);

  // Apply coupon
  const applyCoupon = useCallback((couponCode, subtotal) => {
    // This will be called from checkout page with API validation
    // For now, it's a placeholder
    setCoupon(couponCode);
  }, []);

  // Remove coupon
  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setDiscountAmount(0);
  }, []);

  // Get cart summary
  const getCartSummary = useCallback(() => {
    const totals = calculateTotals();
    return {
      itemCount: cartItems.length,
      totalQuantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      ...totals
    };
  }, [cartItems, calculateTotals]);

  const value = {
    cartItems,
    coupon,
    discountAmount,
    setDiscountAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    calculateTotals,
    getCartSummary
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
