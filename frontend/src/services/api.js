import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
}

// Sweets API
export const sweetsAPI = {
  getAllSweets: async () => {
    const response = await api.get('/sweets')
    return response.data
  },

  searchSweets: async (filters) => {
    const response = await api.get('/sweets/search', { params: filters })
    return response.data
  },

  addSweet: async (sweetData) => {
    const response = await api.post('/sweets', sweetData)
    return response.data
  },

  updateSweet: async (id, updateData) => {
    const response = await api.put(`/sweets/${id}`, updateData)
    return response.data
  },

  deleteSweet: async (id) => {
    const response = await api.delete(`/sweets/${id}`)
    return response.data
  },
}

// Inventory API
export const inventoryAPI = {
  purchaseSweet: async (id) => {
    const response = await api.post(`/inventory/${id}/purchase`)
    return response.data
  },

  restockSweet: async (id) => {
    const response = await api.post(`/inventory/${id}/restock`)
    return response.data
  },
}

export default api 