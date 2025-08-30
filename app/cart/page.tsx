"use client";

import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } =
    useCart();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "customer") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "customer") {
    return null;
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Add some items to your cart before checkout.",
        variant: "error",
      });
      return;
    }

    // Simulate checkout process
    clearCart();
    toast({
      title: "Order Placed!",
      description:
        "Your order has been placed successfully. Thank you for shopping with us!",
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">
                Your cart is empty
              </p>
              <Button onClick={() => router.push("/")}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.productId}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        {/* <p className="text-sm text-muted-foreground">by {item.vendorName}</p> */}
                        <p className="text-lg font-bold">${item.price}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.productId,
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                  <Button onClick={handleCheckout} className="w-full">
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full bg-transparent"
                  >
                    Clear Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
