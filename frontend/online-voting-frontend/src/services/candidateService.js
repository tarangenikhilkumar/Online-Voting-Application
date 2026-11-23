import axiosInstance from '../api/axiosInstance'

const candidateService = {
  getDashboard: async () => {
    const response = await axiosInstance.get('/candidate/dashboard')
    return response.data
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/candidate/profile')
    return response.data
  },

  updateProfile: async (payload) => {
    const response = await axiosInstance.put('/candidate/profile', payload)
    return response.data
  },

  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosInstance.post('/candidate/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  getApplications: async () => {
    const response = await axiosInstance.get('/candidate/applications')
    return response.data
  },

  apply: async (electionId) => {
    const response = await axiosInstance.post('/candidate/applications', { electionId })
    return response.data
  },

  withdraw: async (applicationId) => {
    const response = await axiosInstance.delete(`/candidate/applications/${applicationId}`)
    return response.data
  },
}

export default candidateService