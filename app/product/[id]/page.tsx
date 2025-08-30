"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, getProducts } from "@/lib/products";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Plus,
  Minus,
  ChevronRight,
  Zap,
  Award,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

import { getReviewsByProduct } from "@/lib/reviews";
import ReviewForm from "@/components/review-form";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = getProductById(productId);
        if (!productData) {
          router.push("/404");
          return;
        }

        setProduct(productData);

        // Load reviews from Firebase
        const productReviews = await getReviewsByProduct(productId);
        setReviews(productReviews);

        // Update product rating based on reviews
        if (productReviews.length > 0) {
          const averageRating =
            productReviews.reduce((acc, review) => acc + review.rating, 0) /
            productReviews.length;
          productData.rating = Number(averageRating.toFixed(1));
          productData.reviewCount = productReviews.length;
        }

        // Get related products
        const { products: allProducts } = getProducts();
        const related = allProducts
          .filter(
            (p) =>
              p.id !== productId &&
              (p.category === productData.category ||
                p.brand === productData.brand ||
                p.subcategory === productData.subcategory)
          )
          .slice(0, 8);

        setRelatedProducts(related);
      } catch (error) {
        console.error("Failed to load product:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, router]);

  const handleAddToCart = () => {
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

    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }

    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (!user || user.role !== "customer") {
      toast({
        title: "Access Denied",
        description: "Please login as a customer to manage wishlist.",
        variant: "error",
      });
      return;
    }

    if (!product) return;

    const wishlistItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard!",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                <div className="bg-gray-200 h-20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const images = product.images || [product.image];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/category/${product.category.toLowerCase()}`}
            className="hover:text-primary"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.onSale && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {product.featured && (
                <Badge className="absolute top-4 right-4 bg-yellow-500 text-white">
                  Featured
                </Badge>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-gray-200"
                    )}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">{product.brand}</Badge>
                {product.stock > 0 ? (
                  <Badge className="bg-green-500">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">by {product.vendorName}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {product.onSale && (
                <p className="text-green-600 font-medium">
                  You save $
                  {(product.originalPrice! - product.price).toFixed(2)} (
                  {discountPercentage}% off)
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock} available
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                size="lg"
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""
                  )}
                />
              </Button>
              <Button variant="outline" onClick={handleShare} size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">
                  On orders over $50
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% protected</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Product Specifications
                </h3>
                {product.specifications ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b"
                        >
                          <span className="font-medium">{key}:</span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No specifications available.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} out of 5 ({reviews.length} reviews)
                    </span>
                  </div>
                </div>

                {/* Write Review Button */}
                {user && user.role === "customer" && (
                  <div className="border-b pb-4">
                    <Button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      variant={showReviewForm ? "outline" : "default"}
                    >
                      {showReviewForm ? "Cancel" : "Write a Review"}
                    </Button>
                  </div>
                )}

                {/* Review Form */}
                {showReviewForm && (
                  <ReviewForm
                    productId={productId}
                    onReviewAdded={async () => {
                      setShowReviewForm(false);
                      // Reload reviews to show the new one along with existing ones
                      const updatedReviews = await getReviewsByProduct(
                        productId
                      );
                      setReviews(updatedReviews);

                      // Update product rating with the new review
                      if (updatedReviews.length > 0) {
                        const averageRating =
                          updatedReviews.reduce(
                            (acc, review) => acc + review.rating,
                            0
                          ) / updatedReviews.length;
                        const updatedProduct = { ...product };
                        updatedProduct.rating = Number(
                          averageRating.toFixed(1)
                        );
                        updatedProduct.reviewCount = updatedReviews.length;
                        setProduct(updatedProduct);
                      }
                    }}
                  />
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No reviews yet. Be the first to review this product!
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {review.userName}
                            </span>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-3 w-3",
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-medium mb-1">{review.title}</h4>
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <button className="text-xs text-muted-foreground hover:text-foreground">
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Shipping Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Free Standard Shipping</p>
                        <p className="text-sm text-muted-foreground">
                          On orders over $50 • 5-7 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Express Shipping</p>
                        <p className="text-sm text-muted-foreground">
                          $9.99 • 2-3 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Same Day Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          $19.99 • Available in select areas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Returns & Exchanges
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <RotateCcw className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">30-Day Returns</p>
                        <p className="text-sm text-muted-foreground">
                          Free returns on all orders
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Quality Guarantee</p>
                        <p className="text-sm text-muted-foreground">
                          100% satisfaction guaranteed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Related Products</h2>
                <p className="text-muted-foreground">
                  You might also like these products
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/category/${product.category.toLowerCase()}`}>
                  View All in {product.category}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
