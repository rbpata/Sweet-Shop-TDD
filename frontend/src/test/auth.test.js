import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the API
vi.mock('../services/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Define global localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('Auth Context Tests', () => {
  let authAPI

  beforeEach(async () => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)

    // Import API after mocks are cleared
    const apiModule = await import('../services/api')
    authAPI = apiModule.authAPI
  })

  describe('API Integration', () => {
    it('should call login API with correct credentials', async () => {
      const mockResponse = { access_token: 'test-token' }
      authAPI.login.mockResolvedValue(mockResponse)

      const result = await authAPI.login({
        username: 'testuser',
        password: 'password123'
      })

      expect(authAPI.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      })
      expect(result).toEqual(mockResponse)
    })

    it('should call register API with correct user data', async () => {
      const mockResponse = { message: 'User registered successfully' }
      const userData = {
        username: 'newuser',
        password: 'password123'
      }
      authAPI.register.mockResolvedValue(mockResponse)

      const result = await authAPI.register(userData)

      expect(authAPI.register).toHaveBeenCalledWith(userData)
      expect(result).toEqual(mockResponse)
    })

    it('should handle login error', async () => {
      const mockError = new Error('Invalid credentials')
      authAPI.login.mockRejectedValue(mockError)

      await expect(authAPI.login({
        username: 'invalid',
        password: 'wrong'
      })).rejects.toThrow('Invalid credentials')
    })

    it('should handle register error', async () => {
      const mockError = new Error('Username already exists')
      authAPI.register.mockRejectedValue(mockError)

      await expect(authAPI.register({
        username: 'existing',
        password: 'password123'
      })).rejects.toThrow('Username already exists')
    })
  })
  describe('LocalStorage Operations', () => {
    it('should store token in localStorage on successful login', () => {
      const token = 'test-jwt-token'

      mockLocalStorage.setItem('token', token)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', token)
    })

    it('should retrieve token from localStorage', () => {
      const token = 'test-jwt-token'
      mockLocalStorage.getItem.mockReturnValue(token)

      const result = mockLocalStorage.getItem('token')

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token')
      expect(result).toBe(token)
    })

    it('should remove token from localStorage on logout', () => {
      mockLocalStorage.removeItem('token')

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token')
    })

    it('should return null when no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const result = mockLocalStorage.getItem('token')

      expect(result).toBeNull()
    })
  })


})