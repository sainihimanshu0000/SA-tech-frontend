import API from './axios'

// ============ STATISTICS & DASHBOARD ============

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await API.get('/admin/stats')
    return response.data
  } catch (error) {
    throw error
  }
}

// Get sales data for charts
export const getSalesData = async (period = 'monthly') => {
  try {
    const response = await API.get('/admin/sales', {
      params: { period }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ ORDERS MANAGEMENT ============

// Get all orders (admin view)
export const getAllOrders = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = typeof page === 'object' ? page : { page, limit, ...filters }
    const response = await API.get('/admin/orders', {
      params
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Get order details
export const getOrderDetails = async (orderId) => {
  try {
    const response = await API.get(`/admin/orders/${orderId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const nextStatus = typeof status === 'object' ? status.status : status
    const response = await API.put(`/orders/${orderId}/status`, { status: nextStatus })
    return response.data
  } catch (error) {
    throw error
  }
}

// Bulk update orders
export const bulkUpdateOrders = async (orderIds, action) => {
  try {
    const payload = Array.isArray(orderIds) ? { orderIds, action } : orderIds
    const response = await API.post('/admin/orders/bulk-update', {
      ...payload
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Export orders
export const exportOrders = async (filters = {}) => {
  try {
    const response = await API.get('/admin/orders/export', {
      params: filters,
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    throw error
  }
}


// ============ PRODUCTS MANAGEMENT ============

// Get all products (admin view with all fields)


// Get product details

// Create product


// Update product

// Delete product


// Bulk delete products

// Update product stock


// Mark product as featured


// Mark product as bestseller


// Get low stock products


// Export products
export const exportProducts = async (filters = {}) => {
  try {
    const response = await API.get('/admin/products/export', {
      params: filters,
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ USERS MANAGEMENT ============

// Get all users
export const getAllUsers = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = typeof page === 'object' ? page : { page, limit, ...filters }
    const response = await API.get('/admin/users', {
      params
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Get user details
export const getUserDetails = async (userId) => {
  try {
    const response = await API.get(`/admin/users/${userId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Create admin user
export const createAdminUser = async (adminData) => {
  try {
    const response = await API.post('/admin/users/admin', adminData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const response = await API.put(`/admin/users/${userId}/role`, { role })
    return response.data
  } catch (error) {
    throw error
  }
}

// Ban/Unban user
export const toggleUserStatus = async (userId, isActive) => {
  try {
    const response = await API.put(`/admin/users/${userId}/status`, { isActive })
    return response.data
  } catch (error) {
    throw error
  }
}

// Delete user
export const deleteUserAdmin = async (userId) => {
  try {
    const response = await API.delete(`/admin/users/${userId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get user orders
export const getUserOrders = async (userId, page = 1, limit = 10) => {
  try {
    const response = await API.get(`/admin/users/${userId}/orders`, {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ CATEGORIES MANAGEMENT ============

// Get all categories
export const getAllCategoriesAdmin = async () => {
  try {
    const response = await API.get('/admin/categories')
    return response.data
  } catch (error) {
    throw error
  }
}

// Create category
export const createCategoryAdmin = async (categoryData) => {
  try {
    const response = await API.post('/admin/categories', categoryData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update category
export const updateCategoryAdmin = async (categoryId, categoryData) => {
  try {
    const response = await API.put(`/admin/categories/${categoryId}`, categoryData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Delete category
export const deleteCategoryAdmin = async (categoryId) => {
  try {
    const response = await API.delete(`/admin/categories/${categoryId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ PAYMENTS & TRANSACTIONS ============

// Get all transactions
export const getAllTransactions = async (page = 1, limit = 10, filters = {}) => {
  try {
    const response = await API.get('/admin/transactions', {
      params: { page, limit, ...filters }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Get payment statistics
export const getPaymentStats = async () => {
  try {
    const response = await API.get('/admin/payments/stats')
    return response.data
  } catch (error) {
    throw error
  }
}

// Refund order
export const refundOrder = async (orderId, reason = '') => {
  try {
    const response = await API.post(`/admin/refunds`, {
      orderId,
      reason
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ REVIEWS & RATINGS ============

// Get all reviews (admin)
export const getAllReviewsAdmin = async (page = 1, limit = 10) => {
  try {
    const response = await API.get('/admin/reviews', {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Approve/Reject review
export const updateReviewStatus = async (reviewId, status) => {
  try {
    const response = await API.patch(`/admin/reviews/${reviewId}`, { status })
    return response.data
  } catch (error) {
    throw error
  }
}

// Delete review
export const deleteReviewAdmin = async (reviewId) => {
  try {
    const response = await API.delete(`/admin/reviews/${reviewId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ COUPONS & PROMOTIONS ============

// Get all coupons
export const getAllCoupons = async (page = 1, limit = 10) => {
  try {
    const response = await API.get('/admin/coupons', {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Create coupon
export const createCoupon = async (couponData) => {
  try {
    const response = await API.post('/admin/coupons', couponData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update coupon
export const updateCoupon = async (couponId, couponData) => {
  try {
    const response = await API.put(`/admin/coupons/${couponId}`, couponData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Delete coupon
export const deleteCoupon = async (couponId) => {
  try {
    const response = await API.delete(`/admin/coupons/${couponId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ LOAN APPLICATIONS ============

// Get all loan applications
export const getAllLoanApplicationsAdmin = async (page = 1, limit = 10, filters = {}) => {
  try {
    const response = await API.get('/admin/loans', {
      params: { page, limit, ...filters }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Get loan application details
export const getLoanApplicationDetailsAdmin = async (loanId) => {
  try {
    const response = await API.get(`/admin/loans/${loanId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update loan application status
export const updateLoanStatus = async (loanId, status, notes = '') => {
  try {
    const response = await API.patch(`/admin/loans/${loanId}`, { status, notes })
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ SERVICE REQUESTS ============

// Get all service requests
export const getAllServiceRequests = async (page = 1, limit = 10, filters = {}) => {
  try {
    const response = await API.get('/admin/services', {
      params: { page, limit, ...filters }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Update service request status
export const updateServiceRequestStatus = async (serviceId, status) => {
  try {
    const response = await API.patch(`/admin/services/${serviceId}`, { status })
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ SUBSIDY APPLICATIONS ============

// Get all subsidy applications
export const getAllSubsidyApplications = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = typeof page === 'object' ? page : { page, limit, ...filters }
    const response = await API.get('/admin/subsidy-applications', {
      params
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Update subsidy application status
export const updateSubsidyApplicationStatus = async (applicationId, status, notes = '') => {
  try {
    const response = await API.patch(`/admin/subsidy-applications/${applicationId}`, {
      status,
      notes
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ REPORTS & ANALYTICS ============

// Get revenue report
export const getRevenueReport = async (startDate, endDate) => {
  try {
    const response = await API.get('/admin/reports/revenue', {
      params: { startDate, endDate }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Get sales report
export const getSalesReport = async (startDate, endDate) => {
  try {
    const response = await API.get('/admin/reports/sales', {
      params: { startDate, endDate }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Get customer analytics
export const getCustomerAnalytics = async () => {
  try {
    const response = await API.get('/admin/analytics/customers')
    return response.data
  } catch (error) {
    throw error
  }
}

// Get product analytics
export const getProductAnalytics = async () => {
  try {
    const response = await API.get('/admin/analytics/products')
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ NOTIFICATIONS & MESSAGES ============

// Send notification to user
export const sendNotification = async (userId, message, type = 'info') => {
  try {
    const response = await API.post('/admin/notifications/send', {
      userId,
      message,
      type
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Send bulk notification
export const sendBulkNotification = async (userIds, message, type = 'info') => {
  try {
    const response = await API.post('/admin/notifications/bulk', {
      userIds,
      message,
      type
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ SYSTEM SETTINGS ============

// Get system settings
export const getSystemSettings = async () => {
  try {
    const response = await API.get('/admin/settings')
    return response.data
  } catch (error) {
    throw error
  }
}

// Update system settings
export const updateSystemSettings = async (settings) => {
  try {
    const response = await API.patch('/admin/settings', settings)
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ SOLAR INQUIRIES ============

// Get all solar inquiries
export const getAllSolarInquiries = async (params = {}) => {
  try {
    const response = await API.get('/admin/solar-inquiries', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// Update solar inquiry status
export const updateSolarInquiryStatus = async (inquiryId, status) => {
  try {
    const payload = typeof status === 'object' ? status : { status }
    const response = await API.put(`/admin/solar-inquiries/${inquiryId}`, payload)
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ SUBSIDY STATUS ============

// Update subsidy status
export const updateSubsidyStatus = async (subsidyId, status) => {
  try {
    const payload = typeof status === 'object' ? status : { status }
    const response = await API.patch(`/admin/subsidy-applications/${subsidyId}`, payload)
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ EXPORT FUNCTIONS ============

// Export orders to CSV
export const exportOrdersToCSV = async (filters = {}) => {
  try {
    const response = await API.get('/admin/export/orders', {
      params: filters,
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Export products to CSV
export const exportProductsToCSV = async (filters = {}) => {
  try {
    const response = await API.get('/admin/export/products', {
      params: filters,
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// ============ ANALYTICS ============

// Get revenue analytics
export const getRevenueAnalytics = async (filters = {}) => {
  try {
    const params = typeof filters === 'string' ? { period: filters } : filters
    const response = await API.get('/admin/analytics/revenue', {
      params
    })
    return response.data
  } catch (error) {
    throw error
  }
}


// In adminAPI.js - UPDATE THE PRODUCT ENDPOINTS

// Get all products (admin view with all fields)
export const getAllProductsAdmin = async (page = 1, limit = 12, filters = {}) => {
  try {
    const params = typeof page === 'object' ? page : { page, limit, ...filters }
    const response = await API.get('/products', {  // Changed from '/admin/products'
      params
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Get product details
export const getProductDetailsAdmin = async (productId) => {
  try {
    const response = await API.get(`/products/id/${productId}`)  // Changed
    return response.data
  } catch (error) {
    throw error
  }
}

// Create product
export const createProductAdmin = async (productData) => {
  try {
    const response = await API.post('/products', productData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update product
export const updateProductAdmin = async (productId, productData) => {
  try {
    const response = await API.put(`/products/${productId}`, productData)  // Changed
    return response.data
  } catch (error) {
    throw error
  }
}

// Delete product
export const deleteProductAdmin = async (productId) => {
  try {
    const response = await API.delete(`/products/${productId}`)  // Changed
    return response.data
  } catch (error) {
    throw error
  }
}

// Bulk delete products
export const bulkDeleteProducts = async (productIds) => {
  try {
    const payload = Array.isArray(productIds) ? { productIds } : productIds
    const response = await API.delete('/products/bulk', {  // Changed
      data: payload
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Update product stock
export const updateProductStock = async (productId, stock) => {
  try {
    const response = await API.patch(`/products/${productId}/stock`, { stock })  // Changed
    return response.data
  } catch (error) {
    throw error
  }
}

// Mark product as featured
export const markProductFeatured = async (productId, isFeatured) => {
  try {
    const response = await API.patch(`/products/${productId}/featured`, { isFeatured })  // Changed
    return response.data
  } catch (error) {
    throw error
  }
}

// Mark product as bestseller
export const markProductBestseller = async (productId, isBestseller) => {
  try {
    const response = await API.patch(`/products/${productId}/bestseller`, { isBestseller })  // Changed
    return response.data
  } catch (error) {
    throw error
  }
}

// Get low stock products
export const getLowStockProducts = async (threshold = 10) => {
  try {
    const response = await API.get('/products/low-stock', {  // Changed
      params: { threshold }
    })
    return response.data
  } catch (error) {
    throw error
  }
}