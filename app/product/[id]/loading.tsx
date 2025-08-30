import Navbar from "@/components/navbar"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-4"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Product details skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="bg-gray-200 aspect-square rounded-2xl"></div>
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>

            {/* Info skeleton */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>

              <div className="space-y-2">
                <div className="h-10 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>

              <div className="h-20 bg-gray-200 rounded"></div>

              <div className="flex space-x-4">
                <div className="h-12 bg-gray-200 rounded flex-1"></div>
                <div className="h-12 bg-gray-200 rounded w-12"></div>
                <div className="h-12 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="bg-gray-200 h-64 rounded-lg mb-16"></div>

          {/* Related products skeleton */}
          <div className="space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="bg-gray-200 aspect-square rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
