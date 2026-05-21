import API from './axios'

// Create loan application
export const createLoanApplication = async (loanData) => {
  try {
    const response = await API.post('/loans', loanData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get my loan applications
export const getMyLoanApplications = async () => {
  try {
    const response = await API.get('/loans/my-applications')
    return response.data
  } catch (error) {
    throw error
  }
}

// Get loan application by ID
export const getLoanApplicationById = async (id) => {
  try {
    const response = await API.get(`/loans/application/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get all loan applications (admin only)
export const getAllLoanApplications = async (status, page = 1, limit = 10, search = '') => {
  try {
    const params = { page, limit }
    if (status) params.status = status
    if (search) params.search = search
    const response = await API.get('/loans/admin/all', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// Update loan application status (admin only)
export const updateLoanApplicationStatus = async (id, updateData) => {
  try {
    const response = await API.patch(`/loans/admin/${id}`, updateData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get loan statistics (admin only)
export const getLoanStatistics = async () => {
  try {
    const response = await API.get('/loans/admin/statistics')
    return response.data
  } catch (error) {
    throw error
  }
}
