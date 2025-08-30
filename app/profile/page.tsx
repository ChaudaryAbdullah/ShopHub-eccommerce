"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { User, Calendar, Edit, Save, X, Shield } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    storeName: "",
    storeDescription: "",
  })

  useEffect(() => {
    if (!user || user.role !== "customer") {
      router.push("/login")
      return
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      storeName: user.storeName || "",
      storeDescription: user.storeDescription || "",
    })
  }, [user, router])

  if (!user || user.role !== "customer") {
    return null
  }

  const handleSave = () => {
    // In a real app, this would update the user data
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      storeName: user.storeName || "",
      storeDescription: user.storeDescription || "",
    })
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src="/placeholder.svg?height=96&width=96&text=User"
                      alt="Profile"
                      fill
                      className="object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
                  <p className="text-muted-foreground mb-4">{user.email}</p>

                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Badge className={getStatusColor(user.status)}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Verified</span>
                      <Badge className="bg-green-500">Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Account Status</span>
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Auth</span>
                      <Badge variant="outline">Disabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </CardTitle>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleSave} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm p-2 bg-muted rounded">{user.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm p-2 bg-muted rounded">{user.email}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">Receive updates about your orders and account</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Privacy Settings</h4>
                          <p className="text-sm text-muted-foreground">Manage your privacy and data preferences</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Security</h4>
                          <p className="text-sm text-muted-foreground">Change password and security settings</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order History Summary */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-muted-foreground">Total Orders</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">$1,234</div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">8</div>
                      <div className="text-sm text-muted-foreground">Reviews Given</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Orders
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
