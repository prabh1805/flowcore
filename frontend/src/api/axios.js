import axios from 'axios'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/token'

// Public endpoints that should never send Authorization header
const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/logout']

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token only for protected routes
api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_PATHS.some((path) => config.url?.includes(path))
  if (!isPublic) {
    const token = getAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle 401 with token refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Don't try to refresh if the failing request was itself a public auth route
    const isPublic = PUBLIC_PATHS.some((path) => originalRequest.url?.includes(path))
    if (isPublic) return Promise.reject(error)

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = getRefreshToken()
      // Use raw axios (not `api`) so the interceptor doesn't attach the expired token
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        { refreshToken }
      )
      setTokens(data.accessToken, data.refreshToken)
      processQueue(null, data.accessToken)
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      return api(originalRequest)
    } catch (err) {
      processQueue(err, null)
      clearTokens()
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
