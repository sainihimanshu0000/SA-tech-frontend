import API from './axios';

// Get all blog posts with pagination and filtering
export const getAllBlogPosts = async (params = {}) => {
  console.log('📚 Fetching all blog posts with params:', params);
  
  try {
    const startTime = performance.now();
    const res = await API.get('/blog', { params });
    const endTime = performance.now();
    
    console.log('✅ Blog posts fetched successfully:', {
      status: res.status,
      count: res.data?.data?.length || 0,
      total: res.data?.pagination?.total,
      time: `${(endTime - startTime).toFixed(2)}ms`
    });
    
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching blog posts:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    throw error;
  }
};

// Get single blog post by slug
export const getBlogPostBySlug = async (slug) => {
  console.log('📖 Fetching blog post with slug:', slug);
  
  try {
    const startTime = performance.now();
    const res = await API.get(`/blog/${slug}`);
    const endTime = performance.now();
    
    console.log('✅ Blog post fetched successfully:', {
      status: res.status,
      title: res.data?.data?.title,
      time: `${(endTime - startTime).toFixed(2)}ms`
    });
    
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching blog post:', {
      slug: slug,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    throw error;
  }
};

// Get related blog posts
export const getRelatedPosts = async (postId) => {
  console.log('🔗 Fetching related posts for post ID:', postId);
  
  try {
    const res = await API.get(`/blog/${postId}/related`);
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching related posts:', error.response?.data || error.message);
    throw error;
  }
};

// Create blog post (admin only)
export const createBlogPost = async (postData) => {
  console.log('✍️ Creating new blog post:', {
    title: postData.title,
    category: postData.category,
    isPublished: postData.isPublished
  });
  
  try {
    const res = await API.post('/blog', postData);
    console.log('✅ Blog post created:', res.data?.data?._id);
    return res.data;
  } catch (error) {
    console.error('❌ Error creating blog post:', error.response?.data || error.message);
    throw error;
  }
};

// Update blog post (admin only)
export const updateBlogPost = async (postId, postData) => {
  console.log('🔄 Updating blog post:', postId);
  
  try {
    const res = await API.put(`/blog/${postId}`, postData);
    console.log('✅ Blog post updated:', postId);
    return res.data;
  } catch (error) {
    console.error('❌ Error updating blog post:', error.response?.data || error.message);
    throw error;
  }
};

// Delete blog post (admin only)
export const deleteBlogPost = async (postId) => {
  console.log('🗑️ Deleting blog post:', postId);
  
  try {
    const res = await API.delete(`/blog/${postId}`);
    console.log('✅ Blog post deleted:', postId);
    return res.data;
  } catch (error) {
    console.error('❌ Error deleting blog post:', error.response?.data || error.message);
    throw error;
  }
};

// Add comment to blog post
export const addBlogComment = async (postId, commentData) => {
  console.log('💬 Adding comment to post:', postId);
  
  try {
    const res = await API.post(`/blog/${postId}/comment`, commentData);
    return res.data;
  } catch (error) {
    console.error('❌ Error adding comment:', error.response?.data || error.message);
    throw error;
  }
};

// Like blog post
export const likeBlogPost = async (postId) => {
  console.log('❤️ Liking blog post:', postId);
  
  try {
    const res = await API.post(`/blog/${postId}/like`);
    return res.data;
  } catch (error) {
    console.error('❌ Error liking blog post:', error.response?.data || error.message);
    throw error;
  }
};