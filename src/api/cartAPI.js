import API from './axios';

export const getCart = async () => {
  const response = await API.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await API.post('/cart', { productId, quantity });
  return response.data;
};

export const updateCartItem = async (cartId, productId, quantity) => {
  const response = await API.put(`/cart/${cartId}`, { productId, quantity });
  return response.data;
};

export const batchUpdateCart = async (cartId, updates) => {
  const response = await API.put(`/cart/${cartId}/batch`, { updates });
  return response.data;
};

export const removeCartItem = async (cartId, productId) => {
  const response = await API.delete(`/cart/${cartId}/items/${productId}`);
  return response.data;
};