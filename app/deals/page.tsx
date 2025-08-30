"use client"

import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import ProductCard from "@/components/product-card"
import Navbar from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Clock, Percent } from "lucide-react"
import type { Product } from "@/lib/products"

export default function DealsPage() {
  const [deals, setDeals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const dealsData = await dataService.getDeals()
        setDeals(dealsData)
      } catch (error) {
        console.error("Failed to load deals:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDeals()
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
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Flame className="w-4 h-4 mr-2" />
              Limited Time Only
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">🔥 Hot Deals</h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8">Save up to 70% on premium products</p>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{deals.length}</div>
                <div className="text-red-200">Active Deals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">70%</div>
                <div className="text-red-200">Max Discount</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24h</div>
                <div className="text-red-200">Time Left</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Flash Sale Products</h2>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Ends Soon!
            </Badge>
          </div>
        </div>

        {deals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Percent className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No deals available</h3>
              <p className="text-muted-foreground">Check back later for amazing deals!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
