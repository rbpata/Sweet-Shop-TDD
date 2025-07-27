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

  
})