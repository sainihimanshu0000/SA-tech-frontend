import API from './axios'

// Create order
export const createOrder = async (orderData) => {
  try {
    const response = await API.post('/orders', orderData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get my orders
export const getOrders = async (page = 1, limit = 10) => {
  try {
    const response = await API.get('/orders', {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Get order by ID
export const getOrderById = async (id) => {
  try {
    const response = await API.get(`/orders/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Cancel order
export const cancelOrder = async (id, reason = '') => {
  try {
    const response = await API.patch(`/orders/${id}/cancel`, { reason })
    return response.data
  } catch (error) {
    throw error
  }
}

// Track order
export const trackOrder = async (id) => {
  try {
    const response = await API.get(`/orders/${id}/track`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update order status (admin only)
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await API.patch(`/orders/${id}/status`, { status })
    return response.data
  } catch (error) {
    throw error
  }
}
