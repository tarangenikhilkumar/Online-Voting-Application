import axiosInstance from '../api/axiosInstance'

const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials)
    return response.data
  },

  register: async (payload) => {
    const response = await axiosInstance.post('/auth/register', payload)
    return response.data
  },

  forgotPassword: async (payload) => {
    const response = await axiosInstance.post('/auth/forgot-password', payload)
    return response.data
  },

  resetPassword: async (payload) => {
    const response = await axiosInstance.post('/auth/reset-password', payload)
    return response.data
  },
}

export default authService