import React from 'react'
import { Search, Filter, X } from 'lucide-react'

const SearchFilter = ({ filters, onFiltersChange, onClearFilters }) => {
  const handleInputChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

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

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary-500" />
          <span>Search & Filter</span>
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              placeholder="Search sweets..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={filters.price_min}
            onChange={(e) => handleInputChange('price_min', e.target.value)}
            placeholder="0.00"
            className="input-field"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={filters.price_max}
            onChange={(e) => handleInputChange('price_max', e.target.value)}
            placeholder="100.00"
            className="input-field"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                Search: {filters.search}
                <button
                  onClick={() => handleInputChange('search', '')}
                  className="ml-2 hover:text-primary-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-100 text-secondary-800">
                Category: {filters.category}
                <button
                  onClick={() => handleInputChange('category', '')}
                  className="ml-2 hover:text-secondary-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.price_min && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Min: ₹{filters.price_min}
                <button
                  onClick={() => handleInputChange('price_min', '')}
                  className="ml-2 hover:text-green-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.price_max && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Max: ₹{filters.price_max}
                <button
                  onClick={() => handleInputChange('price_max', '')}
                  className="ml-2 hover:text-green-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilter 