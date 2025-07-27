import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import { sweetsAPI, inventoryAPI } from '../services/api'
import toast from 'react-hot-toast'
import {
  Candy,
  Search,
  Filter,
  Plus,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import SweetCard from '../components/SweetCard'
import SearchFilter from '../components/SearchFilter'
import AddSweetModal from '../components/AddSweetModal'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [searchFilters, setSearchFilters] = useState({
    search: '',
    category: '',
    price_min: '',
    price_max: '',
  })
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch all sweets
  const {
    data: sweets = [],
    isLoading,
    error,
    refetch,
  } = useQuery('sweets', sweetsAPI.getAllSweets, {
    retry: 1,
  })

  // Search sweets with filters
  const {
    data: searchResults,
    isLoading: isSearching,
  } = useQuery(
    ['sweets', 'search', searchFilters],
    () => sweetsAPI.searchSweets(searchFilters),
    {
      enabled: Object.values(searchFilters).some(value => value !== ''),
      retry: 1,
    }
  )

  // Purchase mutation
  const purchaseMutation = useMutation(
    (sweetId) => inventoryAPI.purchaseSweet(sweetId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sweets')
        toast.success('Sweet purchased successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.msg || 'Purchase failed')
      },
    }
  )

  // Restock mutation
  const restockMutation = useMutation(
    (sweetId) => inventoryAPI.restockSweet(sweetId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sweets')
        toast.success('Sweet restocked successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.msg || 'Restock failed')
      },
    }
  )

  const displaySweets = searchResults || sweets
  const hasActiveFilters = Object.values(searchFilters).some(value => value !== '')

  // Calculate statistics
  const stats = {
    totalSweets: sweets.length,
    lowStock: sweets.filter(sweet => sweet.quantity <= 5 && sweet.quantity > 0).length,
    outOfStock: sweets.filter(sweet => sweet.quantity === 0).length,
    categories: [...new Set(sweets.map(sweet => sweet.category))].length,
  }

  const handlePurchase = (sweetId) => {
    purchaseMutation.mutate(sweetId)
  }

  const handleRestock = (sweetId) => {
    restockMutation.mutate(sweetId)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Failed to load sweets
        </h3>
        <p className="text-gray-600 mb-4">
          {error.response?.data?.msg || 'Something went wrong'}
        </p>
        <button
          onClick={() => refetch()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="sweet-gradient rounded-2xl p-8 text-white text-center">
        <div className="animate-float">
          <Candy className="w-16 h-16 mx-auto mb-4" />
        </div>
        <h1 className="text-4xl font-bold mb-2">
          Welcome to Sweet Shop
        </h1>
        <p className="text-xl opacity-90">
          Discover our delicious collection of handcrafted sweets
        </p>
      </div>

      {/* Admin Stats */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Sweets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSweets}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <Candy className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Categories</p>
                <p className="text-2xl font-bold text-purple-600">{stats.categories}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <SearchFilter
        filters={searchFilters}
        onFiltersChange={setSearchFilters}
        onClearFilters={() => setSearchFilters({
          search: '',
          category: '',
          price_min: '',
          price_max: '',
        })}
      />

      {/* Sweets Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Sweets
            {hasActiveFilters && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({displaySweets.length} results)
              </span>
            )}
          </h2>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Sweet</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="text-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Sweets Grid */}
        {!isSearching && displaySweets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displaySweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onPurchase={handlePurchase}
                onRestock={handleRestock}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isSearching && displaySweets.length === 0 && (
          <div className="text-center py-12">
            <Candy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {hasActiveFilters ? 'No sweets found' : 'No sweets available'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters
                ? 'Try adjusting your search criteria'
                : 'Check back later for new additions'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => setSearchFilters({
                  search: '',
                  category: '',
                  price_min: '',
                  price_max: '',
                })}
                className="btn-outline"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Sweet Modal */}
      {showAddModal && (
        <AddSweetModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            queryClient.invalidateQueries('sweets')
          }}
        />
      )}
    </div>
  )
}

export default Dashboard 