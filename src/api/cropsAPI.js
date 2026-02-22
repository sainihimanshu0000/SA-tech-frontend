import API from './axios';

// Create crop query
export const createCropQuery = async (queryData) => {
  try {
    const res = await API.post('/crops', queryData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get user's crop queries
export const getMyCropQueries = async (page = 1, limit = 10) => {
  try {
    const res = await API.get('/crops/my-queries', {
      params: { page, limit }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get all crop queries (admin only)
export const getAllCropQueries = async (page = 1, limit = 10) => {
  try {
    const res = await API.get('/crops', {
      params: { page, limit }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Respond to crop query (admin only)
export const respondToCropQuery = async (queryId, response) => {
  try {
    const res = await API.put(`/crops/${queryId}/respond`, { response });
    return res.data;
  } catch (error) {
    throw error;
  }
};
