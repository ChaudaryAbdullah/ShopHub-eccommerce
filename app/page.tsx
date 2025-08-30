import { getFeaturedProducts } from "@/lib/products";
import { categories } from "@/lib/categories";
import ProductCard from "@/components/product-card";
import HeroSection from "@/components/hero-section";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Zap, Gift } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover products in your favorite categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-muted-foreground">
                Hand-picked products just for you
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"></div>
              <CardContent className="relative p-10 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Trending Now</h3>
                <p className="mb-6 opacity-90 text-lg">
                  Discover what's popular this week
                </p>
                <Button
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3"
                  asChild
                >
                  <Link href="/trending">Shop Trending</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-pink-600 to-rose-700"></div>
              <CardContent className="relative p-10 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Flash Sale</h3>
                <p className="mb-6 opacity-90 text-lg">
                  Limited time offers up to 70% off
                </p>
                <Button
                  variant="secondary"
                  className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-6 py-3"
                  asChild
                >
                  <Link href="/deals">Shop Deals</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700"></div>
              <CardContent className="relative p-10 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Gift className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Best Sellers</h3>
                <p className="mb-6 opacity-90 text-lg">
                  Most popular products loved by customers
                </p>
                <Button
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-3"
                  asChild
                >
                  <Link href="/best-sellers">View All</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-indigo-900/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)] animate-pulse-slow"></div>
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.3),transparent_50%)] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float"></div>
          <div
            className="absolute top-3/4 right-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
            Stay in the Loop
          </h2>
          <p className="text-xl mb-8 text-blue-100/90">
            Get exclusive deals and new arrivals delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-400/50 bg-white/95 backdrop-blur-sm border border-white/20"
            />
            <Button
              size="lg"
              className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ShopHub</h3>
              <p className="text-gray-400 mb-4">
                Your ultimate shopping destination with thousands of products
                from verified vendors.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  Facebook
                </Button>
                <Button variant="ghost" size="sm">
                  Twitter
                </Button>
                <Button variant="ghost" size="sm">
                  Instagram
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white">
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/investors" className="hover:text-white">
                    Investors
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
