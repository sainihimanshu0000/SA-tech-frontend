import API from './axios'

// Get all products with pagination and filters
export const getAllProducts = async (page = 1, limit = 12, filters = {}) => {
  try {
    const response = await API.get('/products', {
      params: { page, limit, ...filters }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Get featured products

export const getFeaturedProducts = async (limit = 6) => {
  try {
    const response = await API.get(`/products/featured?limit=${limit}`);
    // Handle both response formats (direct array or nested in data property)
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Get bestseller products
export const getBestsellerProducts = async (limit = 6) => {
  try {
    const response = await API.get('/products/bestseller', {
      params: { limit }
    })
    return response.data.data || response.data.products || response.data
  } catch (error) {
    throw error
  }
}

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await API.get(`/products/id/${id}`)
    return response.data.product || response.data.data || response.data
  } catch (error) {
    throw error
  }
}

// Search products
export const searchProducts = async (query, page = 1, limit = 12) => {
  try {
    const response = await API.get('/products', {
      params: { search: query, page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Get filtered products
export const getFilteredProducts = async (filters, page = 1, limit = 12) => {
  try {
    const response = await API.get('/products', {
      params: { ...filters, page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Create product (admin only)
export const createProduct = async (productData) => {
  try {
    const response = await API.post('/products', productData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update product (admin only)
export const updateProduct = async (id, productData) => {
  try {
    const response = await API.put(`/products/${id}`, productData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Delete product (admin only)
export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/products/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
