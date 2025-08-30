"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Star,
  Truck,
  Shield,
  Headphones,
  Zap,
  Gift,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Main Hero */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  Limited Time Offers Available
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight text-shadow">
                  Shop Smart,
                  <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Save More
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-indigo-100 leading-relaxed">
                  Discover premium products from trusted vendors with unbeatable
                  prices and lightning-fast delivery.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link href="/deals" className="flex items-center">
                    Shop Hot Deals
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent hover:scale-105 transition-all duration-300"
                >
                  <Link href="/category/electronics">Explore Categories</Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-6 w-6 text-yellow-400 mr-1" />
                    <span className="text-2xl font-bold">4.9</span>
                  </div>
                  <p className="text-sm text-indigo-200">Customer Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">1M+</div>
                  <p className="text-sm text-indigo-200">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">50K+</div>
                  <p className="text-sm text-indigo-200">Products</p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-3xl opacity-30 animate-float"></div>
                <Image
                  src="/placeholder.svg?height=600&width=700&text=Premium+Shopping+Experience"
                  alt="Shopping Hero"
                  width={700}
                  height={600}
                  className="relative rounded-3xl shadow-2xl"
                />
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-2xl shadow-lg animate-bounce">
                  <div className="text-sm font-semibold">Up to 70% OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  Free Shipping
                </h3>
                <p className="text-sm text-gray-600">
                  Free shipping on orders over $50 worldwide
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  Secure Payment
                </h3>
                <p className="text-sm text-gray-600">
                  100% secure payment with SSL encryption
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  24/7 Support
                </h3>
                <p className="text-sm text-gray-600">
                  Round-the-clock customer support
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  Quality Guarantee
                </h3>
                <p className="text-sm text-gray-600">
                  30-day money-back guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600"></div>
              <CardContent className="relative p-8 text-white text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Hot Deals</h3>
                <p className="mb-6 opacity-90">
                  Up to 70% off on trending products
                </p>
                <Button
                  variant="secondary"
                  className="bg-white text-red-600 hover:bg-gray-100"
                  asChild
                >
                  <Link href="/deals">Shop Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600"></div>
              <CardContent className="relative p-8 text-white text-center">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">New Arrivals</h3>
                <p className="mb-6 opacity-90">
                  Latest products just added to our store
                </p>
                <Button
                  variant="secondary"
                  className="bg-white text-green-600 hover:bg-gray-100"
                  asChild
                >
                  <Link href="/new-arrivals">Explore</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600"></div>
              <CardContent className="relative p-8 text-white text-center">
                <Gift className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Best Sellers</h3>
                <p className="mb-6 opacity-90">
                  Most popular products loved by customers
                </p>
                <Button
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  asChild
                >
                  <Link href="/best-sellers">View All</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
