"use client";

import type React from "react";

import { useAuth } from "@/contexts/auth-context";
import { productService, type Product } from "@/lib/firebase-service";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/navbar";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImageUpload from "@/components/image-upload";

export default function VendorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    brand: "",
    stock: "",
    images: [] as string[],
    tags: "",
    specifications: "",
    featured: false,
    onSale: false,
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Check if user is a vendor
    if (user.role !== "vendor") {
      router.push("/");
      toast({
        title: "Access Denied",
        description: "This page is only for vendors.",
        variant: "error",
      });
      return;
    }

    // Load vendor products
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Get products by vendor (you'll need to implement this in firebase-service)
        const allProducts = await productService.getProducts();
        const vendorProducts = allProducts.products.filter(
          (product) =>
            product.vendorId === user.uid || product.vendor === user.uid
        );
        setProducts(vendorProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "Failed to load products.",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [user, router, toast]);

  if (!user || user.role !== "vendor") {
    return null;
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      subcategory: "",
      brand: "",
      stock: "",
      images: [],
      tags: "",
      specifications: "",
      featured: false,
      onSale: false,
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? Number.parseFloat(formData.originalPrice)
          : undefined,
        image: formData.images[0] || "/placeholder.svg",
        images:
          formData.images.length > 0 ? formData.images : ["/placeholder.svg"],
        category: formData.category,
        subcategory: formData.subcategory || "",
        vendorId: user.uid,
        vendorName: user.storeName || user.displayName || "",
        stock: Number.parseInt(formData.stock),
        rating: 0,
        reviewCount: 0,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
        brand: formData.brand || "",
        specifications: formData.specifications
          ? JSON.parse(formData.specifications)
          : {},
        featured: !!formData.featured,
        onSale: !!formData.onSale,
        createdAt: new Date().toISOString(),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id!, productData);
        toast({
          title: "Product Updated",
          description: "Product has been updated successfully.",
        });
      } else {
        await productService.addProduct(productData);
        toast({
          title: "Product Added",
          description: "Product has been added successfully.",
        });
        setIsAddDialogOpen(false);
      }

      // Reload products
      const allProducts = await productService.getProducts();
      const vendorProducts = allProducts.products.filter(
        (product) =>
          product.vendorId === user.uid || product.vendor === user.uid
      );
      setProducts(vendorProducts);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "error",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice
        ? product.originalPrice.toString()
        : "",
      category: product.category,
      subcategory: product.subcategory || "",
      brand: product.brand || "",
      stock: product.stock.toString(),
      images: product.images || [],
      tags: product.tags.join(", "),
      specifications: JSON.stringify(product.specifications, null, 2),
      featured: !!product.featured,
      onSale: !!product.onSale,
    });
  };

  const handleDelete = async (productId: string) => {
    try {
      await productService.deleteProduct(productId);
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      });

      // Reload products
      const allProducts = await productService.getProducts();
      const vendorProducts = allProducts.products.filter(
        (product) =>
          product.vendorId === user.uid || product.vendor === user.uid
      );
      setProducts(vendorProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "error",
      });
    }
  };

  const totalRevenue = products.reduce(
    (sum, p) => sum + p.price * (100 - p.stock),
    0
  );
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your store</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                {products.filter((p) => p.stock > 0).length} in stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
              <p className="text-xs text-muted-foreground">Items available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estimated Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">From sold items</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your store products</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Add a new product to your store
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">
                          Original Price ($)
                        </Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          value={formData.originalPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              originalPrice: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({ ...formData, stock: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={formData.brand}
                          onChange={(e) =>
                            setFormData({ ...formData, brand: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Input
                          id="subcategory"
                          value={formData.subcategory}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subcategory: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                          id="tags"
                          value={formData.tags}
                          onChange={(e) =>
                            setFormData({ ...formData, tags: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specifications">
                        Specifications (JSON)
                      </Label>
                      <Textarea
                        id="specifications"
                        value={formData.specifications}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: e.target.value,
                          })
                        }
                        placeholder='{"Display":"6.7-inch","Chip":"A17 Pro"}'
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Product Images</Label>
                      <ImageUpload
                        value={formData.images}
                        onChange={(images) =>
                          setFormData({ ...formData, images })
                        }
                        maxImages={5}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              featured: e.target.checked,
                            })
                          }
                        />
                        <span>Featured</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.onSale}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              onSale: e.target.checked,
                            })
                          }
                        />
                        <span>On Sale</span>
                      </label>
                    </div>
                    <Button type="submit" className="w-full">
                      Add Product
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">No products yet</p>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first product
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12">
                            <Image
                              src={product.images?.[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.stock > 0 ? "default" : "destructive"
                          }
                        >
                          {product.stock} units
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id!)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Product Dialog */}
        {editingProduct && (
          <Dialog open={!!editingProduct} onOpenChange={() => resetForm()}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Update product information
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price ($)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-originalPrice">
                      Original Price ($)
                    </Label>
                    <Input
                      id="edit-originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-stock">Stock</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-brand">Brand</Label>
                    <Input
                      id="edit-brand"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-subcategory">Subcategory</Label>
                    <Input
                      id="edit-subcategory"
                      value={formData.subcategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subcategory: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                    <Input
                      id="edit-tags"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-specifications">
                    Specifications (JSON)
                  </Label>
                  <Textarea
                    id="edit-specifications"
                    value={formData.specifications}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: e.target.value,
                      })
                    }
                    placeholder='{"Display":"6.7-inch","Chip":"A17 Pro"}'
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <ImageUpload
                    value={formData.images}
                    onChange={(images) => setFormData({ ...formData, images })}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.onSale}
                      onChange={(e) =>
                        setFormData({ ...formData, onSale: e.target.checked })
                      }
                    />
                    <span>On Sale</span>
                  </label>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Update Product
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}
