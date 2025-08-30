import { useState, useEffect } from "react";
import {
  productService,
  orderService,
  cartService,
  wishlistService,
  authService,
  storageService,
  realtimeService,
  type Product,
  type Order,
  type CartItem,
  type WishlistItem,
} from "@/lib/firebase-service";
import { useAuth } from "@/contexts/auth-context";

export function useProducts(limit: number = 20) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const { products } = await productService.getProducts(limit);
        setProducts(products);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [limit]);

  return { products, loading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProduct(id);
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  return { product, loading, error };
}

export function useFeaturedProducts(limit: number = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const featuredProducts = await productService.getFeaturedProducts(
          limit
        );
        setProducts(featuredProducts);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load featured products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
}

export function useSearchProducts(searchTerm: string, limit: number = 20) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setProducts([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const searchResults = await productService.searchProducts(
          searchTerm,
          limit
        );
        setProducts(searchResults);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search products"
        );
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, limit]);

  return { products, loading, error };
}

export function useUserOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        const userOrders = await orderService.getUserOrders(user.uid);
        setOrders(userOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.uid]);

  return { orders, loading, error };
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (
    file: File,
    path: string
  ): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);
      const downloadURL = await storageService.uploadImage(file, path);
      return downloadURL;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload image";
      setError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
}

export function useRealtimeProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = realtimeService.listenToProducts((updatedProducts) => {
      setProducts(updatedProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { products, loading };
}

export function useRealtimeCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const unsubscribe = realtimeService.listenToUserCart(user.uid, (items) => {
      setCartItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return { cartItems, loading };
}

export function useRealtimeOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const unsubscribe = realtimeService.listenToUserOrders(
      user.uid,
      (userOrders) => {
        setOrders(userOrders);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return { orders, loading };
}

// Admin hooks
export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        setLoading(true);
        const { products } = await productService.getProducts(100); // Load more for admin
        setProducts(products);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAllProducts();
  }, []);

  const addProduct = async (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const productId = await productService.addProduct(productData);
      return productId;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to add product"
      );
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await productService.updateProduct(id, updates);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update product"
      );
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to delete product"
      );
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}

// Vendor hooks
export function useVendorProducts(vendorId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVendorProducts = async () => {
      try {
        setLoading(true);
        // You would need to add a method to get products by vendor
        // For now, we'll use the general getProducts method
        const { products } = await productService.getProducts(50);
        const vendorProducts = products.filter((p) => p.vendor === vendorId);
        setProducts(vendorProducts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load vendor products"
        );
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      loadVendorProducts();
    }
  }, [vendorId]);

  return { products, loading, error };
}
