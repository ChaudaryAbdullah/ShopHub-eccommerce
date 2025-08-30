"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getCategoryBySlug } from "@/lib/categories";
import {
  getProducts,
  type ProductFilters,
  type ProductSort,
} from "@/lib/products";
import ProductCard from "@/components/product-card";
import ProductFiltersComponent from "@/components/product-filters";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Filter, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = getCategoryBySlug(slug);

  const [filters, setFilters] = useState<ProductFilters>({
    category: category?.name,
    subcategory: category?.parentId ? category.name : undefined,
  });
  const [sort, setSort] = useState<ProductSort>({
    field: "name",
    direction: "asc",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { products, total, hasMore } = getProducts(
    filters,
    sort,
    currentPage,
    12
  );

  useEffect(() => {
    if (category) {
      setFilters({
        category: category.parentId ? undefined : category.name,
        subcategory: category.parentId ? category.name : undefined,
      });
    }
  }, [category]);

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split("-") as [
      ProductSort["field"],
      ProductSort["direction"]
    ];
    setSort({ field, direction });
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground">
            The category you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Category Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
              <p className="text-xl text-gray-300 mb-6">
                {category.description}
              </p>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {total} Products Available
              </Badge>
            </div>
            <div className="relative aspect-video">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ProductFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <div className="flex items-center space-x-4">
                <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden bg-transparent"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <ProductFiltersComponent
                      filters={filters}
                      onFiltersChange={(newFilters) => {
                        handleFiltersChange(newFilters);
                        setIsFiltersOpen(false);
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

                <Select
                  value={`${sort.field}-${sort.direction}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating-desc">
                      Rating: High to Low
                    </SelectItem>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid/List */}
            {products.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <SlidersHorizontal className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button onClick={() => handleFiltersChange({})}>
                    Clear All Filters
                  </Button>
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
                    <ProductCard
                      key={product.id}
                      product={product}
                      className={viewMode === "list" ? "flex-row" : ""}
                    />
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
  );
}
