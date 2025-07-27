import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { sweetsAPI } from '../services/api'
import toast from 'react-hot-toast'
import {
  ShoppingCart,
  Package,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  AlertTriangle,
} from 'lucide-react'
import EditSweetModal from './EditSweetModal'

const SweetCard = ({ sweet, onPurchase, onRestock, isAdmin }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const queryClient = useQueryClient()

  // Delete mutation
  const deleteMutation = useMutation(
    () => sweetsAPI.deleteSweet(sweet.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sweets')
        toast.success('Sweet deleted successfully')
        setShowDeleteConfirm(false)
      },
      onError: (error) => {
        toast.error(error.response?.data?.msg || 'Failed to delete sweet')
      },
    }
  )

  // Function to get emoji based on sweet name or category
  const getSweetEmoji = () => {
    const name = sweet.name.toLowerCase()
    const category = sweet.category.toLowerCase()
    
    // Check by name first
    if (name.includes('chocolate')) return '🍫'
    if (name.includes('candy') || name.includes('candies')) return '🍬'
    if (name.includes('lollipop') || name.includes('sucker')) return '🍭'
    if (name.includes('gummy') || name.includes('jelly')) return '🍯'
    if (name.includes('cookie') || name.includes('biscuit')) return '🍪'
    if (name.includes('cake') || name.includes('cupcake')) return '🧁'
    if (name.includes('donut') || name.includes('doughnut')) return '🍩'
    if (name.includes('ice cream') || name.includes('icecream')) return '🍦'
    if (name.includes('pie')) return '🥧'
    if (name.includes('candy cane')) return '🎄'
    if (name.includes('marshmallow')) return '☁️'
    if (name.includes('caramel') || name.includes('toffee')) return '🟤'
    if (name.includes('mint')) return '🌿'
    if (name.includes('berry') || name.includes('fruit')) return '🍓'
    if (name.includes('honey')) return '🍯'
    if (name.includes('pretzel')) return '🥨'
    if (name.includes('popcorn')) return '🍿'
    
    // Check by category if no name match
    if (category.includes('chocolate')) return '🍫'
    if (category.includes('candy') || category.includes('hard candy')) return '🍬'
    if (category.includes('lollipop')) return '🍭'
    if (category.includes('gummy') || category.includes('jelly')) return '🐻'
    if (category.includes('cookie') || category.includes('biscuit')) return '🍪'
    if (category.includes('cake') || category.includes('pastry')) return '🧁'
    if (category.includes('donut')) return '🍩'
    if (category.includes('ice cream') || category.includes('frozen')) return '🍦'
    if (category.includes('pie') || category.includes('tart')) return '🥧'
    if (category.includes('seasonal') || category.includes('holiday')) return '🎄'
    if (category.includes('mint') || category.includes('fresh')) return '🌿'
    if (category.includes('fruit') || category.includes('berry')) return '🍓'
    if (category.includes('honey') || category.includes('natural')) return '🍯'
    if (category.includes('salty') || category.includes('pretzel')) return '🥨'
    if (category.includes('popcorn') || category.includes('corn')) return '🍿'
    if (category.includes('nuts') || category.includes('nut')) return '🥜'
    if (category.includes('coconut')) return '🥥'
    if (category.includes('banana')) return '🍌'
    if (category.includes('apple')) return '🍎'
    if (category.includes('orange') || category.includes('citrus')) return '🍊'
    if (category.includes('grape')) return '🍇'
    if (category.includes('cherry')) return '🍒'
    if (category.includes('peach')) return '🍑'
    if (category.includes('pineapple')) return '🍍'
    if (category.includes('watermelon')) return '🍉'
    if (category.includes('mango')) return '🥭'
    if (category.includes('kiwi')) return '🥝'
    if (category.includes('strawberry')) return '🍓'
    if (category.includes('blueberry')) return '🫐'
    if (category.includes('raspberry')) return '🍇'
    
    // Default emojis for different categories
    const emojiOptions = ['🍭', '🍬', '🍫', '🧁', '🍪', '🍩', '🍦', '🥧', '🍯', '🍰']
    
    // Use sweet ID to consistently pick the same emoji for the same sweet
    const index = sweet.id % emojiOptions.length
    return emojiOptions[index]
  }

  const getStockStatus = () => {
    if (sweet.quantity === 0) {
      return { label: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' }
    }
    if (sweet.quantity <= 5) {
      return { label: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    }
    return { label: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' }
  }

  const stockStatus = getStockStatus()

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  return (
    <>
      <div className="card overflow-hidden group hover:scale-105 transition-transform duration-300">
        {/* Sweet Image/Icon */}
        <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
          {/* Dynamic Sweet Emoji */}
          <div className="text-6xl group-hover:animate-bounce">
            {getSweetEmoji()}
          </div>
          
          {/* Stock Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
              {stockStatus.label}
            </span>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="absolute top-3 left-3 flex space-x-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
                title="Edit Sweet"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 bg-white/90 hover:bg-red-50 rounded-lg shadow-sm transition-colors"
                title="Delete Sweet"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* Sweet Details */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {sweet.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 capitalize">
            {sweet.category}
          </p>

          {/* Price and Stock */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-primary-500" />
              <span className="text-xl font-bold text-primary-600">
                {sweet.price.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {sweet.quantity} in stock
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => onPurchase(sweet.id)}
              disabled={sweet.quantity === 0}
              className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onRestock(sweet.id)}
                className="btn-outline flex items-center justify-center"
                title="Restock"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Low Stock Warning */}
          {sweet.quantity <= 5 && sweet.quantity > 0 && (
            <div className="mt-3 flex items-center space-x-2 text-yellow-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Low stock alert</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditSweetModal
          sweet={sweet}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false)
            queryClient.invalidateQueries('sweets')
          }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Sweet
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{sweet.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SweetCard