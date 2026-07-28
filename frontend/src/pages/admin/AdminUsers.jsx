import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers } from 'react-icons/fi'
import { getUsers } from '../../services/authService'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { formatDate } from '../../utils'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getUsers()
      setUsers(data.data?.users || [])
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={fetchUsers} />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-900">Users</h1>
      </div>

      {users.length === 0 ? (
        <EmptyState icon={FiUsers} title="No users" message="No users have registered yet." />
      ) : (
        <div className="card-hover overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-dark-50 text-dark-500">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-dark-50">
                    <td className="px-6 py-4 font-medium text-dark-900">{user.id}</td>
                    <td className="px-6 py-4 font-medium text-dark-900">{user.name}</td>
                    <td className="px-6 py-4 text-dark-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-500">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
