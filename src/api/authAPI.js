import API from './axios'

// Login
export const login = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
    }
    return response.data
  } catch (error) {
    throw error
  }
}

// Register
export const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
    }
    return response.data
  } catch (error) {
    throw error
  }
}

// Logout
export const logout = async () => {
  try {
    const response = await API.post('/auth/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
    return response.data
  } catch (error) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
    throw error
  }
}

// Get profile
export const getProfile = async () => {
  try {
    const response = await API.get('/auth/profile')
    return response.data
  } catch (error) {
    throw error
  }
}

// Update profile
export const updateProfile = async (profileData) => {
  try {
    const response = await API.patch('/auth/profile', profileData)
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  } catch (error) {
    throw error
  }
}

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await API.put('/auth/change-password', { currentPassword, newPassword })
    return response.data
  } catch (error) {
    throw error
  }
}

// Refresh token
export const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken')
    const response = await API.post('/auth/refresh-token', {
      refreshToken: refreshTokenValue
    })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  } catch (error) {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    throw error
  }
}
