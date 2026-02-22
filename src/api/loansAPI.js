import API from './axios'

// Create loan application
export const createLoanApplication = async (loanData) => {
  try {
    const response = await API.post('/api/loans', loanData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get my loan applications
export const getMyLoanApplications = async () => {
  try {
    const response = await API.get('/api/loans/my-applications')
    return response.data
  } catch (error) {
    throw error
  }
}

// Get loan application by ID
export const getLoanApplicationById = async (id) => {
  try {
    const response = await API.get(`/api/loans/application/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get all loan applications (admin only)
export const getAllLoanApplications = async (status, page = 1, limit = 10) => {
  try {
    const params = { page, limit }
    if (status) params.status = status
    const response = await API.get('/api/loans/admin/all', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// Update loan application status (admin only)
export const updateLoanApplicationStatus = async (id, updateData) => {
  try {
    const response = await API.patch(`/api/loans/admin/${id}`, updateData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get loan statistics (admin only)
export const getLoanStatistics = async () => {
  try {
    const response = await API.get('/api/loans/admin/statistics')
    return response.data
  } catch (error) {
    throw error
  }
}
