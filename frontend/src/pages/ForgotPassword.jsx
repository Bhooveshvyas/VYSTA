import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiMail, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import axios from '../api/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    setLoading(true)
    try {
      await axios.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('OTP sent to your email')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card-hover p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
              <FiPackage className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-dark-900">Forgot Password</h1>
            <p className="mt-1 text-sm text-dark-500">
              {sent ? 'OTP has been sent to your email' : 'Enter your email to receive an OTP'}
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <FiMail className="h-8 w-8 text-green-500" />
              </div>
              <p className="mb-2 font-medium text-dark-900">Check your inbox</p>
              <p className="mb-6 text-sm text-dark-500">
                We sent a 6-digit OTP to <strong>{email}</strong>. It expires in 10 minutes.
              </p>
              <Link to={`/reset-password?email=${encodeURIComponent(email)}`} className="btn-primary w-full">
                Enter OTP
              </Link>
              <button onClick={() => setSent(false)} className="btn-ghost mt-2 w-full">
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-dark-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-dark-500">
            <Link to="/login" className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700">
              <FiArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
