import axiosInstance from '../api/axiosInstance'

const adminService = {
  getDashboard: async () => {
    const response = await axiosInstance.get('/admin/dashboard')
    return response.data
  },

  // Elections
  getElections: async ({ status, page = 0, size = 10 } = {}) => {
    const params = { page, size }
    if (status) params.status = status
    const response = await axiosInstance.get('/admin/elections', { params })
    return response.data
  },

  createElection: async (payload) => {
    const response = await axiosInstance.post('/admin/elections', payload)
    return response.data
  },

  updateElection: async (id, payload) => {
    const response = await axiosInstance.put(`/admin/elections/${id}`, payload)
    return response.data
  },

  deleteElection: async (id) => {
    const response = await axiosInstance.delete(`/admin/elections/${id}`)
    return response.data
  },

  closeElection: async (id) => {
    const response = await axiosInstance.patch(`/admin/elections/${id}/close`)
    return response.data
  },

  publishResults: async (id) => {
    const response = await axiosInstance.patch(`/admin/elections/${id}/publish`)
    return response.data
  },

  // Candidate Applications
  getApplications: async ({ status, electionId, page = 0, size = 10 } = {}) => {
    const params = { page, size }
    if (status) params.status = status
    if (electionId) params.electionId = electionId
    const response = await axiosInstance.get('/admin/applications', { params })
    return response.data
  },

  approveApplication: async (id) => {
    const response = await axiosInstance.patch(`/admin/applications/${id}/approve`)
    return response.data
  },

  rejectApplication: async (id) => {
    const response = await axiosInstance.patch(`/admin/applications/${id}/reject`)
    return response.data
  },

  // Voters & Candidates
  getVoters: async ({ search, page = 0, size = 10 } = {}) => {
    const params = { page, size }
    if (search) params.search = search
    const response = await axiosInstance.get('/admin/voters', { params })
    return response.data
  },

  getCandidates: async ({ search, page = 0, size = 10 } = {}) => {
    const params = { page, size }
    if (search) params.search = search
    const response = await axiosInstance.get('/admin/candidates', { params })
    return response.data
  },

  toggleUserBlock: async (userId) => {
    const response = await axiosInstance.patch(`/admin/users/${userId}/toggle-block`)
    return response.data
  },

  // Audit Logs
  getAuditLogs: async ({ search, page = 0, size = 15 } = {}) => {
    const params = { page, size }
    if (search) params.search = search
    const response = await axiosInstance.get('/admin/audit-logs', { params })
    return response.data
  },
}

export default adminService