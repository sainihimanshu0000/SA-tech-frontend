import API from './axios';

// Create or update farmer profile
export const createFarmerProfile = async (profileData) => {
  try {
    const res = await API.post('/farmers/profile', profileData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get current farmer's profile
export const getMyFarmerProfile = async () => {
  try {
    const res = await API.get('/farmers/profile');
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get farmer recommendations
export const getFarmerRecommendations = async () => {
  try {
    const res = await API.get('/farmers/recommendations');
    return res.data;
  } catch (error) {
    throw error;
  }
};
