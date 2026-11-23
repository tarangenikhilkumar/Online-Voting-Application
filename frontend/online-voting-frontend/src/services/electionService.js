import axiosInstance from '../api/axiosInstance'

const electionService = {
  getAll: async ({ status, page = 0, size = 6 } = {}) => {
    const params = { page, size }
    if (status) params.status = status

    const response = await axiosInstance.get('/elections', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/elections/${id}`)
    return response.data
  },

  getCandidates: async (id) => {
    const response = await axiosInstance.get(`/elections/${id}/candidates`)
    return response.data
  },
}

export default electionService