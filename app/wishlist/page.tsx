"use client"

import { useAuth } from "@/contexts/auth-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WishlistPage() {
  const { user } = useAuth()
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "customer") {
      router.push("/login")
    }
  }, [user, router])

  if (!user || user.role !== "customer") {
    return null
  }

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      vendorId: item.vendorId,
      vendorName: item.vendorName,
    })

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const handleRemoveFromWishlist = (itemId: string, itemName: string) => {
    removeFromWishlist(itemId)
    toast({
      title: "Removed from Wishlist",
      description: `${itemName} has been removed from your wishlist.`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearWishlist}>
              Clear All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">Save items you love to your wishlist and shop them later</p>
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="group">
                <div className="relative aspect-square overflow-hidden">
                  <Link href={`/product/${item.id}`}>
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">by {item.vendorName}</p>
                  <p className="text-lg font-bold mb-4">${item.price}</p>

                  <div className="flex gap-2">
                    <Button onClick={() => handleAddToCart(item)} className="flex-1" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
