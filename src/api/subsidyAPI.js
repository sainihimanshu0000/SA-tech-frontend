import api from './axios';

export const getSubsidySchemes = async (params = {}) => {
  try {
    const response = await api.get('/subsidy/schemes', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching schemes:', error);
    throw error;
  }
};

export const checkEligibility = async (schemeId) => {
  try {
    const response = await api.post('/subsidy/check-eligibility', { schemeId });
    return response.data;
  } catch (error) {
    console.error('Error checking eligibility:', error);
    throw error;
  }
};

export const applyForSubsidy = async (applicationData) => {
  try {
    const response = await api.post('/subsidy/apply', applicationData);
    return response.data;
  } catch (error) {
    console.error('Error applying for subsidy:', error);
    throw error;
  }
};

export const getUserSubsidyApplications = async () => {
  try {
    const response = await api.get('/subsidy/my-applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};