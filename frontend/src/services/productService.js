import axios from '../api/axios'

export const getProducts = async () => {
  const response = await axios.get('/product')
  return response.data
}

export const getProductById = async (id) => {
  const response = await axios.get(`/product/${id}`)
  return response.data
}

export const getReviews = async (productId) => {
  const response = await axios.get(`/product/${productId}/reviews`)
  return response.data
}

export const addReview = async (productId, reviewData) => {
  const response = await axios.post(`/product/${productId}/reviews`, reviewData)
  return response.data
}

export const deleteReview = async (productId, reviewId) => {
  const response = await axios.delete(`/product/${productId}/reviews`, { data: { reviewId } })
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
