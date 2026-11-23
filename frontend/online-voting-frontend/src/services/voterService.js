import axiosInstance from '../api/axiosInstance'

const voterService = {
  getDashboard: async () => {
    const response = await axiosInstance.get('/voter/dashboard')
    return response.data
  },

  castVote: async (electionId, electionCandidateId) => {
    const response = await axiosInstance.post(`/voter/elections/${electionId}/vote`, {
      electionCandidateId,
    })
    return response.data
  },

  getHistory: async ({ page = 0, size = 10 } = {}) => {
    const response = await axiosInstance.get('/voter/history', { params: { page, size } })
    return response.data
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/voter/profile')
    return response.data
  },

  updateProfile: async (payload) => {
    const response = await axiosInstance.put('/voter/profile', payload)
    return response.data
  },
}

export default voterService