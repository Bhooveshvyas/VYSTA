import axios from '../api/axios'

export const createOrder = async (orderData) => {
  const response = await axios.post('/order', orderData)
  return response.data
}

export const getOrders = async () => {
  const response = await axios.get('/order')
  return response.data
}

export const getMyOrders = async () => {
  const response = await axios.get('/order/myorders')
  return response.data
}

export const getOrderById = async (id) => {
  const response = await axios.get(`/order/${id}`)
  return response.data
}

export const getMyOrderById = async (id) => {
  const response = await axios.get(`/order/myorders/${id}`)
  return response.data
}

export const updateOrder = async (id, orderData) => {
  const response = await axios.put(`/order/${id}`, orderData)
  return response.data
}

export const updateOrderStatus = async (id, status) => {
  const response = await axios.put(`/order/${id}/status`, { status })
  return response.data
}

export const deleteOrder = async (id) => {
  const response = await axios.delete(`/order/${id}`)
  return response.data
}

export const checkHasPurchasedProduct = async (productId) => {
  const response = await axios.get(`/order/product-check/${productId}`)
  return response.data
}
