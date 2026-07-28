import axios from '../api/axios'

export const registerUser = async (userData) => {
  const response = await axios.post('/auth/register', userData)
  return response.data
}

export const loginUser = async (credentials) => {
  const response = await axios.post('/auth/login', credentials)
  return response.data
}

export const logoutUser = async () => {
  const response = await axios.post('/auth/logout')
  return response.data
}

export const getProfile = async () => {
  const response = await axios.get('/auth/profile')
  return response.data
}

export const getUsers = async () => {
  const response = await axios.get('/auth/users')
  return response.data
}
