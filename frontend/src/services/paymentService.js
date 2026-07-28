import axios from '../api/axios'

export const createPaymentOrder = async (amount) => {
  const response = await axios.post('/payment/order', { amount })
  return response.data
}

export const verifyPayment = async (paymentData) => {
  const response = await axios.post('/payment/verify', paymentData)
  return response.data
}
