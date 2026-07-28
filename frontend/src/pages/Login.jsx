import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { FiPackage, FiEye, FiEyeOff } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      navigate(from, { replace: true })
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || err.response.data?.error || 'Login failed')
      } else if (err.request) {
        toast.error('Cannot reach server. Is the backend running on port 5000?')
      } else {
        toast.error('Login failed: ' + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card-hover p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
              <FiPackage className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-dark-900">Welcome back</h1>
            <p className="mt-1 text-sm text-dark-500">Sign in to your VYSTA account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-dark-700">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-dark-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400"
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>
            </form>

          <div className="mt-6 text-center text-sm text-dark-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Create one
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
