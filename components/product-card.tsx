"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || user.role !== "customer") {
      toast({
        title: "Access Denied",
        description: "Please login as a customer to add items to cart.",
        variant: "error",
      });
      return;
    }

    if (user.status !== "approved") {
      toast({
        title: "Account Pending",
        description: "Your account is pending approval.",
        variant: "error",
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || user.role !== "customer") {
      toast({
        title: "Access Denied",
        description: "Please login as a customer to manage wishlist.",
        variant: "error",
      });
      return;
    }

    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(wishlistItem);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Link href={`/product/${product.id}`}>
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 bg-white border-0 shadow-lg overflow-hidden",
          className
        )}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="aspect-square relative">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.onSale && (
              <Badge className="bg-red-500 hover:bg-red-600">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-yellow-500 hover:bg-yellow-600">
                Featured
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isInWishlist(product.id)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600"
              )}
            />
          </Button>

          {/* Quick view button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {product.brand}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              by {product.vendorName}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
