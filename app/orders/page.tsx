"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, CheckCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Mock orders data
const mockOrders = [
  {
    id: "1",
    date: "2024-01-15",
    status: "delivered",
    total: 249.98,
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 199.99 },
      { name: "Laptop Stand", quantity: 1, price: 49.99 },
    ],
  },
  {
    id: "2",
    date: "2024-01-10",
    status: "shipped",
    total: 299.99,
    items: [{ name: "Smart Watch", quantity: 1, price: 299.99 }],
  },
  {
    id: "3",
    date: "2024-01-05",
    status: "processing",
    total: 199.99,
    items: [{ name: "Wireless Headphones", quantity: 1, price: 199.99 }],
  },
]

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "customer") {
      router.push("/login")
    }
  }, [user, router])

  if (!user || user.role !== "customer") {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "shipped":
        return <Package className="h-4 w-4 text-blue-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "processing":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track your order history and status</p>
        </div>

        {mockOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl font-medium mb-2">No orders yet</p>
              <p className="text-muted-foreground">Start shopping to see your orders here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-3 font-bold text-lg">
                      <span>Total:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
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
