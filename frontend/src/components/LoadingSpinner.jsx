import React from 'react'
import { Candy } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-bounce-slow mb-4">
          <Candy className="w-16 h-16 text-primary-500 mx-auto" />
        </div>
        <div className="text-lg font-medium text-gray-600">
          Loading Sweet Shop...
        </div>
        <div className="mt-4">
          <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner 