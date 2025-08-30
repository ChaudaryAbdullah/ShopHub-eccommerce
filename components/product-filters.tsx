"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import { getBrands, type ProductFilters } from "@/lib/products"
import { categories } from "@/lib/categories"

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  className?: string
}

export default function ProductFiltersComponent({ filters, onFiltersChange, className }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 5000])
  const brands = getBrands()

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    })
  }

  const clearFilters = () => {
    setPriceRange([0, 5000])
    onFiltersChange({})
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category) count++
    if (filters.subcategory) count++
    if (filters.brand) count++
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++
    if (filters.rating) count++
    if (filters.inStock) count++
    if (filters.onSale) count++
    return count
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.category === category.name}
                    onCheckedChange={(checked) => handleFilterChange("category", checked ? category.name : undefined)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm">
                    {category.name}
                  </Label>
                </div>
                {filters.category === category.name && category.subcategories && (
                  <div className="ml-6 mt-2 space-y-2">
                    {category.subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subcategory-${sub.id}`}
                          checked={filters.subcategory === sub.name}
                          onCheckedChange={(checked) =>
                            handleFilterChange("subcategory", checked ? sub.name : undefined)
                          }
                        />
                        <Label htmlFor={`subcategory-${sub.id}`} className="text-sm">
                          {sub.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={5000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div>
          <h3 className="font-medium mb-3">Brands</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brand === brand}
                  onCheckedChange={(checked) => handleFilterChange("brand", checked ? brand : undefined)}
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div>
          <h3 className="font-medium mb-3">Minimum Rating</h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => handleFilterChange("rating", checked ? rating : undefined)}
                />
                <Label htmlFor={`rating-${rating}`} className="text-sm">
                  {rating}+ Stars
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Other Filters */}
        <div>
          <h3 className="font-medium mb-3">Other</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock || false}
                onCheckedChange={(checked) => handleFilterChange("inStock", checked)}
              />
              <Label htmlFor="in-stock" className="text-sm">
                In Stock Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={filters.onSale || false}
                onCheckedChange={(checked) => handleFilterChange("onSale", checked)}
              />
              <Label htmlFor="on-sale" className="text-sm">
                On Sale
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
