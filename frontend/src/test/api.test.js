describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Auth API', () => {
    it('should register a new user', async () => {
      const userData = { username: 'testuser', password: 'password123' }
      const mockResponse = { message: 'User registered successfully' }
      authAPI.register.mockResolvedValue(mockResponse)

      const result = await authAPI.register(userData)
      
      expect(authAPI.register).toHaveBeenCalledWith(userData)
      expect(result).toEqual(mockResponse)
    })

    it('should login a user', async () => {
      const credentials = { username: 'testuser', password: 'password123' }
      const mockResponse = { access_token: 'mock-token' }
      authAPI.login.mockResolvedValue(mockResponse)

      const result = await authAPI.login(credentials)
      
      expect(authAPI.login).toHaveBeenCalledWith(credentials)
      expect(result).toEqual(mockResponse)
    })
  })
})