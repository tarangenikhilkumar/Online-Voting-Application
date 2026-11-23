import axiosInstance from '../api/axiosInstance'

const resultService = {
  getElectionResults: async (electionId) => {
    const response = await axiosInstance.get(`/results/${electionId}`)
    return response.data
  },
}

export default resultService