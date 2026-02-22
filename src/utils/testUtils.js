import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a test client
const createTestClient = (token = null) => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return client;
};

// Test utilities
export const testUtils = {
  // Auth tests
  async testRegister(userData) {
    try {
      const response = await createTestClient().post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  async testLogin(email, password) {
    try {
      const response = await createTestClient().post('/auth/login', {
        email,
        password
      });
      return { success: true, data: response.data, token: response.data.token };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  async testGetProfile(token) {
    try {
      const response = createTestClient(token).get('/auth/me');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  // Product tests
  async testGetProducts(params = {}) {
    try {
      const response = await createTestClient().get('/products', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  async testGetProductById(id) {
    try {
      const response = await createTestClient().get(`/products/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  async testCreateProduct(productData, token) {
    try {
      const response = await createTestClient(token).post('/products', productData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  // Cart tests
  async testAddToCart(productId, quantity, token) {
    try {
      const response = await createTestClient(token).post('/cart', {
        productId,
        quantity
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  async testGetCart(token) {
    try {
      const response = await createTestClient(token).get('/cart');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  // Order tests
  async testCreateOrder(orderData, token) {
    try {
      const response = await createTestClient(token).post('/orders', orderData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  async testGetOrders(token) {
    try {
      const response = await createTestClient(token).get('/orders');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  // Review tests
  async testAddReview(productId, reviewData, token) {
    try {
      const response = await createTestClient(token).post(
        `/reviews/product/${productId}`,
        reviewData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  async testGetProductReviews(productId, params = {}) {
    try {
      const response = await createTestClient().get(
        `/reviews/product/${productId}`,
        { params }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  // Wishlist tests
  async testAddToWishlist(productId, token) {
    try {
      const response = await createTestClient(token).post(
        `/wishlist/${productId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  async testGetWishlist(token) {
    try {
      const response = await createTestClient(token).get('/wishlist');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  // Blog tests
  async testGetBlogPosts(params = {}) {
    try {
      const response = await createTestClient().get('/blog', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  async testGetBlogPost(slug) {
    try {
      const response = await createTestClient().get(`/blog/${slug}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  // Category tests
  async testGetCategories(params = {}) {
    try {
      const response = await createTestClient().get('/categories', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  }
};

// Test runner
export async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Get Products
  console.log('Test 1: Get Products');
  const productsTest = await testUtils.testGetProducts({ limit: 5 });
  if (productsTest.success) {
    console.log('✅ Passed\n');
    results.passed++;
  } else {
    console.log('❌ Failed:', productsTest.error?.message, '\n');
    results.failed++;
  }
  results.tests.push({
    name: 'Get Products',
    status: productsTest.success ? 'PASS' : 'FAIL'
  });

  // Test 2: Get Categories
  console.log('Test 2: Get Categories');
  const categoriesTest = await testUtils.testGetCategories();
  if (categoriesTest.success) {
    console.log('✅ Passed\n');
    results.passed++;
  } else {
    console.log('❌ Failed:', categoriesTest.error?.message, '\n');
    results.failed++;
  }
  results.tests.push({
    name: 'Get Categories',
    status: categoriesTest.success ? 'PASS' : 'FAIL'
  });

  // Test 3: Get Blog Posts
  console.log('Test 3: Get Blog Posts');
  const blogTest = await testUtils.testGetBlogPosts();
  if (blogTest.success) {
    console.log('✅ Passed\n');
    results.passed++;
  } else {
    console.log('❌ Failed:', blogTest.error?.message, '\n');
    results.failed++;
  }
  results.tests.push({
    name: 'Get Blog Posts',
    status: blogTest.success ? 'PASS' : 'FAIL'
  });

  // Summary
  console.log('\n📊 Test Summary');
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success Rate: ${(results.passed / (results.passed + results.failed) * 100).toFixed(2)}%`);

  return results;
}

// Export for use in components/pages
export default testUtils;
