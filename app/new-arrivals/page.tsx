"use client"

import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import ProductCard from "@/components/product-card"
import Navbar from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar, Package } from "lucide-react"
import type { Product } from "@/lib/products"

export default function NewArrivalsPage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        const newArrivalsData = await dataService.getNewArrivals()
        setNewArrivals(newArrivalsData)
      } catch (error) {
        console.error("Failed to load new arrivals:", error)
      } finally {
        setLoading(false)
      }
    }

    loadNewArrivals()
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
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Fresh & New
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">✨ New Arrivals</h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-8">
              Discover the latest products just added to our collection
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{newArrivals.length}</div>
                <div className="text-emerald-200">New Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Daily</div>
                <div className="text-emerald-200">Updates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Fresh</div>
                <div className="text-emerald-200">Collection</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Arrivals Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Latest Products</h2>
            <Badge className="text-lg px-4 py-2 bg-emerald-500">
              <Calendar className="w-4 h-4 mr-2" />
              Just Added
            </Badge>
          </div>
        </div>

        {newArrivals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No new arrivals</h3>
              <p className="text-muted-foreground">Check back soon for new products!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
