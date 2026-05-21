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

export const removeCartItem = async (cartId, productId) => {
  const response = await API.delete(`/cart/${cartId}`, { data: { productId } });
  return response.data;
};