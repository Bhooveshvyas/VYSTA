import axios from '../api/axios'

export const getProducts = async () => {
  const response = await axios.get('/product')
  return response.data
}

export const getProductById = async (id) => {
  const response = await axios.get(`/product/${id}`)
  return response.data
}

export const createProduct = async (formData) => {
  const response = await axios.post('/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const updateProduct = async (id, formData) => {
  const response = await axios.put(`/product/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const deleteProduct = async (id) => {
  const response = await axios.delete(`/product/${id}`)
  return response.data
}
