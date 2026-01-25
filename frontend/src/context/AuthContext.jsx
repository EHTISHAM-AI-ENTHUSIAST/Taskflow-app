import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

/**
 * Authentication Provider Component
 * Manages user state and provides auth functions
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])
  
  // Fetch current user profile
  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }
  
  // Login function
  const login = async (email, password) => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    
    const response = await api.post('/auth/login', formData)
    const { access_token } = response.data
    
    localStorage.setItem('token', access_token)
    await fetchUser()
    
    return response.data
  }
  
  // Register function
  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password
    })
    
    // Auto-login after registration
    await login(email, password)
    
    return response.data
  }
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }
  
  const value = {
    user,
    loading,
    login,
    register,
    logout
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
