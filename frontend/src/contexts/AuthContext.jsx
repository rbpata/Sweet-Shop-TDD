import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Decode JWT token to get user info
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        username: payload.sub,
        isAdmin: payload.is_admin || false,
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  // Check if token is valid
  const isTokenValid = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch (error) {
      return false
    }
  }

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && isTokenValid(token)) {
      const userInfo = decodeToken(token)
      if (userInfo) {
        setUser(userInfo)
      } else {
        localStorage.removeItem('token')
      }
    } else if (token) {
      localStorage.removeItem('token')
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password })
      const { access_token } = response

      localStorage.setItem('token', access_token)
      const userInfo = decodeToken(access_token)
      setUser(userInfo)

      toast.success('Welcome back!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.msg || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      await authAPI.register(userData)
      toast.success('Account created successfully! Please log in.')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.msg || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 