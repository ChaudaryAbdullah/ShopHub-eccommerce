"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getProducts, type ProductFilters, type ProductSort } from "@/lib/products"
import ProductCard from "@/components/product-card"
import ProductFiltersComponent from "@/components/product-filters"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Grid, List, Filter, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<ProductFilters>({ search: initialQuery })
  const [sort, setSort] = useState<ProductSort>({ field: "name", direction: "asc" })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const { products, total, hasMore } = getProducts(filters, sort, currentPage, 12)

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: initialQuery }))
    setSearchQuery(initialQuery)
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, search: searchQuery }))
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split("-") as [ProductSort["field"], ProductSort["direction"]]
    setSort({ field, direction })
    setCurrentPage(1)
  }

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters({ ...newFilters, search: searchQuery })
    setCurrentPage(1)
  }

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Search Header */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Search Results</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-12 text-lg"
              />
              <Button type="submit" size="sm" className="absolute right-2 top-2 h-8 w-8 p-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {initialQuery && (
            <div className="mt-4">
              <p className="text-muted-foreground">
                Showing results for: <span className="font-semibold">"{initialQuery}"</span>
              </p>
              <Badge variant="secondary" className="mt-2">
                {total} Results Found
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ProductFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <div className="flex items-center space-x-4">
                <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <ProductFiltersComponent
                      filters={filters}
                      onFiltersChange={(newFilters) => {
                        handleFiltersChange(newFilters)
                        setIsFiltersOpen(false)
                      }}
                      className="border-0 shadow-none"
                    />
                  </SheetContent>
                </Sheet>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Showing {products.length} of {total} products
                </span>

                <Select value={`${sort.field}-${sort.direction}`} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid/List */}
            {!initialQuery ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Start your search</h3>
                  <p className="text-muted-foreground">Enter a search term to find products</p>
                </CardContent>
              </Card>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <SlidersHorizontal className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    No products match your search criteria. Try different keywords or adjust your filters.
                  </p>
                  <Button onClick={() => handleFiltersChange({})}>Clear All Filters</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} className={viewMode === "list" ? "flex-row" : ""} />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <Button onClick={loadMore} variant="outline" size="lg">
                      Load More Products
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
