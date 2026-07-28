import axios from '../api/axios'

export const getAdminStats = async () => {
  const response = await axios.get('/admin')
  return response.data
}
