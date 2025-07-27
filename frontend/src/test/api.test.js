import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authAPI, sweetsAPI, inventoryAPI } from '../services/api'

// Mock the entire api module
vi.mock('../services/api', () => {
    const mockApi = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }

    return {
        authAPI: {
            register: vi.fn(),
            login: vi.fn(),
        },
        sweetsAPI: {
            getAllSweets: vi.fn(),
            searchSweets: vi.fn(),
            addSweet: vi.fn(),
            updateSweet: vi.fn(),
            deleteSweet: vi.fn(),
        },
        inventoryAPI: {
            purchaseSweet: vi.fn(),
            restockSweet: vi.fn(),
        },
    }
})



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

    describe('Sweets API', () => {
        it('should fetch all sweets', async () => {
            const mockSweets = [
                { id: 1, name: 'Chocolate Truffle', category: 'Chocolate', price: 2.50, quantity: 50 }
            ]
            sweetsAPI.getAllSweets.mockResolvedValue(mockSweets)

            const result = await sweetsAPI.getAllSweets()

            expect(sweetsAPI.getAllSweets).toHaveBeenCalled()
            expect(result).toEqual(mockSweets)
        })

        it('should search sweets with filters', async () => {
            const filters = { search: 'chocolate', category: 'Chocolate', price_min: 1, price_max: 5 }
            const mockResponse = [{ id: 1, name: 'Chocolate Truffle' }]
            sweetsAPI.searchSweets.mockResolvedValue(mockResponse)

            const result = await sweetsAPI.searchSweets(filters)

            expect(sweetsAPI.searchSweets).toHaveBeenCalledWith(filters)
            expect(result).toEqual(mockResponse)
        })

        it('should add a new sweet', async () => {
            const sweetData = { name: 'New Sweet', category: 'Candy', price: 1.50, quantity: 100 }
            const mockResponse = { message: 'Sweet added successfully' }
            sweetsAPI.addSweet.mockResolvedValue(mockResponse)

            const result = await sweetsAPI.addSweet(sweetData)

            expect(sweetsAPI.addSweet).toHaveBeenCalledWith(sweetData)
            expect(result).toEqual(mockResponse)
        })

        it('should update a sweet', async () => {
            const sweetId = 1
            const updateData = { price: 3.00, quantity: 75 }
            const mockResponse = { message: 'Sweet updated' }
            sweetsAPI.updateSweet.mockResolvedValue(mockResponse)

            const result = await sweetsAPI.updateSweet(sweetId, updateData)

            expect(sweetsAPI.updateSweet).toHaveBeenCalledWith(sweetId, updateData)
            expect(result).toEqual(mockResponse)
        })

        it('should delete a sweet', async () => {
            const sweetId = 1
            const mockResponse = { message: 'Sweet deleted successfully' }
            sweetsAPI.deleteSweet.mockResolvedValue(mockResponse)

            const result = await sweetsAPI.deleteSweet(sweetId)

            expect(sweetsAPI.deleteSweet).toHaveBeenCalledWith(sweetId)
            expect(result).toEqual(mockResponse)
        })
    })



})