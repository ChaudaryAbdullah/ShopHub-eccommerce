"use client";

import { useAuth } from "@/contexts/auth-context";
import {
  getAllUsers,
  updateUserStatus,
  productService,
} from "@/lib/firebase-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Store, Package, TrendingUp } from "lucide-react";
import Navbar from "@/components/navbar";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // Memoize user filtering to prevent unnecessary recalculations
  const { customers, vendors, pendingUsers } = useMemo(() => {
    return {
      customers: users.filter((u) => u.role === "customer"),
      vendors: users.filter((u) => u.role === "vendor"),
      pendingUsers: users.filter((u) => u.status === "pending"),
    };
  }, [users]);

  // Check authentication on mount and user changes
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "error",
      });
      router.push("/");
      return;
    }
  }, [user, router, toast]);

  // Refresh data when component mounts
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      const fetchedProducts = await productService.getProducts();
      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
      setProducts(
        Array.isArray(fetchedProducts.products) ? fetchedProducts.products : []
      );
    } catch (error) {
      console.error("Error loading data:", error);
      setUsers([]);
      setProducts([]);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please refresh the page.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = useCallback(
    async (userId: string, newStatus: string) => {
      setIsLoading(true);
      try {
        const success = await updateUserStatus(userId, newStatus);
        if (success) {
          await fetchData(); // Refresh users data
          toast({
            title: "Status Updated",
            description: `User status has been updated to ${newStatus}.`,
          });
        } else {
          throw new Error("Failed to update user status");
        }
      } catch (error) {
        console.error("Error updating user status:", error);
        toast({
          title: "Error",
          description: "Failed to update user status. Please try again.",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, fetchData]
  );

  const getStatusBadgeVariant = useCallback((status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  }, []);

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Return null if not admin (will redirect)
  if (user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, vendors, and monitor platform performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingUsers.length} pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">
                {customers.filter((c) => c.status === "approved").length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendors</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendors.length}</div>
              <p className="text-xs text-muted-foreground">
                {vendors.filter((v) => v.status === "approved").length} approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                {Array.isArray(products)
                  ? products.reduce(
                      (sum: number, p: { stock?: number }) =>
                        sum + (p?.stock ?? 0),
                      0
                    )
                  : 0}{" "}
                total stock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Approve or reject user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Store Info</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id || user.uid}>
                        <TableCell className="font-medium">
                          {user.name || "N/A"}
                        </TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role === "vendor" && user.storeName ? (
                            <div className="max-w-xs">
                              <p className="font-medium truncate">
                                {user.storeName}
                              </p>
                              {user.storeDescription && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {user.storeDescription}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.role !== "admin" ? (
                            <Select
                              value={user.status}
                              onValueChange={(value: string) =>
                                handleStatusUpdate(user.id || user.uid, value)
                              }
                              disabled={isLoading}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">
                                  Approved
                                </SelectItem>
                                <SelectItem value="rejected">
                                  Rejected
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Admin
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Key metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div className="text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">
                  Orders This Month
                </p>
              </div>
              <div className="text-center">
                <Store className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">$45,678</p>
                <p className="text-sm text-muted-foreground">
                  Revenue This Month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
