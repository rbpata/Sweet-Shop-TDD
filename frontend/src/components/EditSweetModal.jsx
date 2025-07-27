import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { sweetsAPI } from '../services/api'
import toast from 'react-hot-toast'
import { X, Candy, Edit } from 'lucide-react'

const EditSweetModal = ({ sweet, isOpen, onClose, onSuccess }) => {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: sweet?.name || '',
      category: sweet?.category || '',
      price: sweet?.price || '',
      quantity: sweet?.quantity || '',
    },
  })

  const editSweetMutation = useMutation(
    (data) => sweetsAPI.updateSweet(sweet.id, data),
    {
      onSuccess: () => {
        toast.success('Sweet updated successfully!')
        onSuccess()
      },
      onError: (error) => {
        toast.error(error.response?.data?.msg || 'Failed to update sweet')
      },
    }
  )

  const onSubmit = (data) => {
    const updateData = {
      name: data.name,
      category: data.category,
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity),
    }
    editSweetMutation.mutate(updateData)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const categories = [
    'Chocolate',
    'Cake',
    'Candy',
    'Cookie',
    'Ice Cream',
    'Fudge',
    'Tart',
    'Pie',
    'Donut',
    'Other',
  ]

  if (!isOpen || !sweet) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="sweet-gradient p-2 rounded-lg">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Sweet
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Sweet Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              className="input-field"
              placeholder="Enter sweet name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              {...register('category', {
                required: 'Category is required',
              })}
              className="input-field"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Price Field */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register('price', {
                required: 'Price is required',
                min: {
                  value: 0,
                  message: 'Price must be positive',
                },
                max: {
                  value: 1000,
                  message: 'Price cannot exceed $1000',
                },
              })}
              className="input-field"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          {/* Quantity Field */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="0"
              {...register('quantity', {
                required: 'Quantity is required',
                min: {
                  value: 0,
                  message: 'Quantity must be non-negative',
                },
                max: {
                  value: 10000,
                  message: 'Quantity cannot exceed 10,000',
                },
              })}
              className="input-field"
              placeholder="0"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editSweetMutation.isLoading}
              className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editSweetMutation.isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Candy className="w-4 h-4" />
                  <span>Update Sweet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditSweetModal 