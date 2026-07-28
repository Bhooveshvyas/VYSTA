import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiShield } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'
import { getProfile } from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile()
        setProfile(data.data?.user || null)
      } catch {
        setProfile(user)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  if (loading) return <div className="page-container py-16"><LoadingSpinner /></div>
  if (!profile) return <div className="page-container py-16"><p>Profile not found.</p></div>

  return (
    <div className="page-container py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title mb-8">My Profile</h1>

        <div className="mx-auto max-w-2xl">
          <div className="card-hover p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <FiUser className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-dark-900">{profile.name}</h2>
                <p className="text-sm text-dark-500 capitalize">{profile.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-dark-200 p-4">
                <FiMail className="h-5 w-5 text-dark-400" />
                <div>
                  <p className="text-xs text-dark-500">Email</p>
                  <p className="font-medium text-dark-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-dark-200 p-4">
                <FiShield className="h-5 w-5 text-dark-400" />
                <div>
                  <p className="text-xs text-dark-500">Role</p>
                  <p className="font-medium capitalize text-dark-900">{profile.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
