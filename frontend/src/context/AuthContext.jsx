import { createContext, useState, useEffect, useCallback } from 'react'
import { loginUser, registerUser, logoutUser, getProfile } from '../services/authService'
import toast from 'react-hot-toast'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const data = await getProfile()
      setUser(data.data?.user || null)
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const fetchProfileAndSetUser = async () => {
    try {
      const data = await getProfile()
      const userData = data.data?.user || null
      if (userData) {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
      }
      return userData
    } catch {
      return null
    }
  }

  const login = async (email, password) => {
    const data = await loginUser({ email, password })
    localStorage.setItem('token', data.data.token)
    toast.success(data.message || 'Login successful')
    const profile = await fetchProfileAndSetUser()
    if (!profile) {
      setUser({ id: data.data.id, email: data.data.email, name: data.data.email.split('@')[0], role: 'user' })
    }
    return data
  }

  const register = async (name, email, password) => {
    const data = await registerUser({ name, email, password })
    localStorage.setItem('token', data.data.token)
    toast.success(data.message || 'Registration successful')
    const profile = await fetchProfileAndSetUser()
    if (!profile) {
      setUser({ id: data.data.id, email: data.data.email, name: data.data.name || name, role: 'user' })
    }
    return data
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch {
      // proceed with local logout even if API fails
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  )
}
