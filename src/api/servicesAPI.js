import API from './axios';

// Create service request
export const createServiceRequest = async (requestData) => {
  try {
    const res = await API.post('/services', requestData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get user's service requests
export const getMyServiceRequests = async (page = 1, limit = 10) => {
  try {
    const res = await API.get('/services/my-requests', {
      params: { page, limit }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Update service request status
export const updateServiceStatus = async (requestId, status) => {
  try {
    const res = await API.put(`/services/${requestId}`, { status });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get all service requests (admin only)
export const getServiceRequests = async (page = 1, limit = 10, status = '') => {
  try {
    const res = await API.get('/services', {
      params: { page, limit, status }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
