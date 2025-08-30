"use client"

import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import ProductCard from "@/components/product-card"
import Navbar from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap, FlameIcon as Fire } from "lucide-react"
import type { Product } from "@/lib/products"

export default function TrendingPage() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrendingProducts = async () => {
      try {
        const trendingData = await dataService.getTrendingProducts()
        setTrendingProducts(trendingData)
      } catch (error) {
        console.error("Failed to load trending products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTrendingProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Fire className="w-4 h-4 mr-2" />
              What's Hot Right Now
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">📈 Trending Now</h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8">
              Discover what everyone is talking about this week
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{trendingProducts.length}</div>
                <div className="text-orange-200">Trending Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Hot</div>
                <div className="text-orange-200">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.5+</div>
                <div className="text-orange-200">Min Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Products Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">What's Trending</h2>
            <Badge className="text-lg px-4 py-2 bg-orange-500">
              <Zap className="w-4 h-4 mr-2" />
              Hot Right Now
            </Badge>
          </div>
        </div>

        {trendingProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No trending products</h3>
              <p className="text-muted-foreground">Check back soon for trending items!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
