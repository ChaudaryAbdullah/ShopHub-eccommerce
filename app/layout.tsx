import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopHub - Your Ultimate Shopping Destination",
  description:
    "Discover amazing products from verified vendors. Shop electronics, fashion, home goods, and more with fast shipping and great prices.",
  keywords: "ecommerce, online shopping, electronics, fashion, home goods, deals",
  authors: [{ name: "ShopHub Team" }],
  openGraph: {
    title: "ShopHub - Your Ultimate Shopping Destination",
    description: "Discover amazing products from verified vendors",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopHub - Your Ultimate Shopping Destination",
    description: "Discover amazing products from verified vendors",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
