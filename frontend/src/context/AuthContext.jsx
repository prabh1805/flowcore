import { createContext, useState, useEffect } from 'react'
import api from '@/api/axios'
import { getAccessToken, setTokens, clearTokens } from '@/utils/token'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      setUser({ token })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    console.log('[FlowCore] Login response:', data)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    setUser(data)
    return data
  }

  const register = async ({ name, email, countryCode, phone, password }) => {
    const { data } = await api.post('/auth/register', { name, email, countryCode, phone, password })
    console.log('[FlowCore] Register response:', data)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    setUser(data)
    return data
  }

  const logout = () => {
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
