import API from './axios';

// Get all categories
export const getAllCategories = async () => {
  try {
    // Your backend route is '/api/categories' (from app.js)
    // And in routes/categories.js, you have '/categories' endpoint
    // So the full path is '/categories' (since base URL is already /api)
    const res = await API.get('/categories');
    console.log('📥 Categories API Response:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching categories:', error.response?.data || error.message);
    throw error;
  }
};

// Get single category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const res = await API.get(`/categories/${categoryId}`);
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching category:', error.response?.data || error.message);
    throw error;
  }
};

// Create category (admin only)
export const createCategory = async (categoryData) => {
  try {
    const res = await API.post('/categories', categoryData);
    return res.data;
  } catch (error) {
    console.error('❌ Error creating category:', error.response?.data || error.message);
    throw error;
  }
};

// Update category (admin only)
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const res = await API.put(`/categories/${categoryId}`, categoryData);
    return res.data;
  } catch (error) {
    console.error('❌ Error updating category:', error.response?.data || error.message);
    throw error;
  }
};

// Delete category (admin only)
export const deleteCategory = async (categoryId) => {
  try {
    const res = await API.delete(`/categories/${categoryId}`);
    return res.data;
  } catch (error) {
    console.error('❌ Error deleting category:', error.response?.data || error.message);
    throw error;
  }
};

// Get all brands
export const getAllBrands = async () => {
  try {
    const res = await API.get('/brands');
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching brands:', error.response?.data || error.message);
    throw error;
  }
};

// Get single brand by ID
export const getBrandById = async (brandId) => {
  try {
    const res = await API.get(`/brands/${brandId}`);
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching brand:', error.response?.data || error.message);
    throw error;
  }
};

// Create brand (admin only)
export const createBrand = async (brandData) => {
  try {
    const res = await API.post('/brands', brandData);
    return res.data;
  } catch (error) {
    console.error('❌ Error creating brand:', error.response?.data || error.message);
    throw error;
  }
};

// Update brand (admin only)
export const updateBrand = async (brandId, brandData) => {
  try {
    const res = await API.put(`/brands/${brandId}`, brandData);
    return res.data;
  } catch (error) {
    console.error('❌ Error updating brand:', error.response?.data || error.message);
    throw error;
  }
};

// Delete brand (admin only)
export const deleteBrand = async (brandId) => {
  try {
    const res = await API.delete(`/brands/${brandId}`);
    return res.data;
  } catch (error) {
    console.error('❌ Error deleting brand:', error.response?.data || error.message);
    throw error;
  }
};