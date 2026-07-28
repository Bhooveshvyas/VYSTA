import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import axios from '../api/axios'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await axios.post('/auth/reset-password', { email, otp, password })
      toast.success('Password reset successful! Please login.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password'
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
            <h1 className="text-2xl font-bold text-dark-900">Reset Password</h1>
            <p className="mt-1 text-sm text-dark-500">
              Enter the OTP sent to {email || 'your email'} and your new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-dark-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-lg tracking-[8px]"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark-700">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400"
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-dark-500">
            <Link to="/forgot-password" className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700">
              <FiArrowLeft className="h-4 w-4" /> Request new OTP
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
