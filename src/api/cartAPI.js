import api from './axios';

// Get all blog posts (public)
export const getAllBlogPosts = async (params = {}) => {
  try {
    const response = await api.get('/blog', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

// Get single blog post by slug (public)
export const getBlogPostBySlug = async (slug) => {
  try {
    const response = await api.get(`/blog/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
};

// Get related posts (public)
export const getRelatedPosts = async (postId) => {
  try {
    const response = await api.get(`/blog/${postId}/related`);
    return response.data;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    throw error;
  }
};

// Create blog post (admin only)
export const createBlogPost = async (postData) => {
  try {
    const response = await api.post('/blog', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

// Update blog post (admin only)
export const updateBlogPost = async (id, postData) => {
  try {
    const response = await api.put(`/blog/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

// Delete blog post (admin only)
export const deleteBlogPost = async (id) => {
  try {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// Add comment to blog post (authenticated users)
export const addBlogComment = async (postId, commentData) => {
  try {
    const response = await api.post(`/blog/${postId}/comment`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Like blog post (authenticated users)
export const likeBlogPost = async (postId) => {
  try {
    const response = await api.post(`/blog/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};