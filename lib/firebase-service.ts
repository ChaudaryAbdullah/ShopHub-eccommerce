import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { db, auth, storage } from "./firebase";
// import { mockProducts } from "./products";

// Types
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  vendorId: string;
  vendorName: string;
  stock: number;
  createdAt: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  brand?: string;
  specifications?: Record<string, string>;
  featured?: boolean;
  onSale?: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: "customer" | "vendor" | "admin";
  createdAt: any;
  updatedAt: any;
}

export interface Order {
  id?: string;
  userId: string;
  products: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: any;
  updatedAt: any;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: any;
}

// Authentication Services
export const authService = {
  // Register new user
  async register(
    email: string,
    password: string,
    displayName: string,
    role: "customer" | "vendor" | "admin" = "customer"
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, { displayName });

      // Create user document in Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        displayName,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return user;
    } catch (error) {
      throw error;
    }
  },

  // Sign in
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};

// Product Services
export const productService = {
  // Get all products with pagination
  async getProducts(
    limitCount: number = 1000,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ) {
    try {
      let q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const products: Product[] = [];

      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });

      return { products, lastDoc: snapshot.docs[snapshot.docs.length - 1] };
    } catch (error) {
      throw error;
    }
  },

  // Get product by ID
  async getProduct(id: string) {
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(category: string, limitCount: number = 20) {
    try {
      const q = query(
        collection(db, "products"),
        where("category", "==", category),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const products: Product[] = [];

      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });

      return products;
    } catch (error) {
      throw error;
    }
  },

  // Search products
  async searchProducts(searchTerm: string, limitCount: number = 20) {
    try {
      const q = query(
        collection(db, "products"),
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const products: Product[] = [];

      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });

      return products;
    } catch (error) {
      throw error;
    }
  },

  // Add new product
  async addProduct(product: Omit<Product, "id" | "createdAt">) {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Update product
  async updateProduct(id: string, updates: Partial<Product>) {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: string) {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      throw error;
    }
  },

  // Get featured products
  async getFeaturedProducts(limitCount: number = 10) {
    try {
      const q = query(
        collection(db, "products"),
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const products: Product[] = [];

      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });

      return products;
    } catch (error) {
      throw error;
    }
  },
};

// Order Services
export const orderService = {
  // Create new order
  async createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">) {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Get user orders
  async getUserOrders(userId: string) {
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const orders: Order[] = [];

      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });

      return orders;
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  async getOrder(id: string) {
    try {
      const docRef = doc(db, "orders", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Order;
      } else {
        throw new Error("Order not found");
      }
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(id: string, status: Order["status"]) {
    try {
      const docRef = doc(db, "orders", id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw error;
    }
  },
};

// Cart Services
export const cartService = {
  // Get user cart
  async getUserCart(userId: string) {
    try {
      const docRef = doc(db, "carts", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().items as CartItem[];
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  },

  // Update user cart
  async updateUserCart(userId: string, items: CartItem[]) {
    try {
      const docRef = doc(db, "carts", userId);
      await updateDoc(docRef, { items });
    } catch (error) {
      // If document doesn't exist, create it
      await addDoc(collection(db, "carts"), {
        userId,
        items,
        updatedAt: serverTimestamp(),
      });
    }
  },

  // Add item to cart
  async addToCart(userId: string, item: CartItem) {
    try {
      const currentCart = await this.getUserCart(userId);
      const existingItemIndex = currentCart.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existingItemIndex >= 0) {
        currentCart[existingItemIndex].quantity += item.quantity;
      } else {
        currentCart.push(item);
      }

      await this.updateUserCart(userId, currentCart);
      return currentCart;
    } catch (error) {
      throw error;
    }
  },

  // Remove item from cart
  async removeFromCart(userId: string, productId: string) {
    try {
      const currentCart = await this.getUserCart(userId);
      const updatedCart = currentCart.filter(
        (item) => item.productId !== productId
      );

      await this.updateUserCart(userId, updatedCart);
      return updatedCart;
    } catch (error) {
      throw error;
    }
  },

  // Update cart item quantity
  async updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ) {
    try {
      const currentCart = await this.getUserCart(userId);
      const itemIndex = currentCart.findIndex(
        (item) => item.productId === productId
      );

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          currentCart.splice(itemIndex, 1);
        } else {
          currentCart[itemIndex].quantity = quantity;
        }

        await this.updateUserCart(userId, currentCart);
        return currentCart;
      }

      throw new Error("Item not found in cart");
    } catch (error) {
      throw error;
    }
  },

  // Clear user cart
  async clearCart(userId: string) {
    try {
      await this.updateUserCart(userId, []);
    } catch (error) {
      throw error;
    }
  },
};

// Wishlist Services
export const wishlistService = {
  // Get user wishlist
  async getUserWishlist(userId: string) {
    try {
      const q = query(
        collection(db, "wishlists"),
        where("userId", "==", userId),
        orderBy("addedAt", "desc")
      );

      const snapshot = await getDocs(q);
      const wishlist: WishlistItem[] = [];

      snapshot.forEach((doc) => {
        wishlist.push({ ...doc.data() } as WishlistItem);
      });

      return wishlist;
    } catch (error) {
      throw error;
    }
  },

  // Add item to wishlist
  async addToWishlist(userId: string, item: Omit<WishlistItem, "addedAt">) {
    try {
      await addDoc(collection(db, "wishlists"), {
        userId,
        ...item,
        addedAt: serverTimestamp(),
      });
    } catch (error) {
      throw error;
    }
  },

  // Remove item from wishlist
  async removeFromWishlist(userId: string, productId: string) {
    try {
      const q = query(
        collection(db, "wishlists"),
        where("userId", "==", userId),
        where("productId", "==", productId)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        await deleteDoc(doc(db, "wishlists", snapshot.docs[0].id));
      }
    } catch (error) {
      throw error;
    }
  },

  // Check if item is in wishlist
  async isInWishlist(userId: string, productId: string) {
    try {
      const q = query(
        collection(db, "wishlists"),
        where("userId", "==", userId),
        where("productId", "==", productId)
      );

      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      throw error;
    }
  },
};

// Storage Services
export const storageService = {
  // Upload image
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      throw error;
    }
  },

  // Delete image
  async deleteImage(path: string) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      throw error;
    }
  },
};

// Real-time listeners
export const realtimeService = {
  // Listen to products changes
  listenToProducts(callback: (products: Product[]) => void) {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      callback(products);
    });
  },

  // Listen to user cart changes
  listenToUserCart(userId: string, callback: (items: CartItem[]) => void) {
    const docRef = doc(db, "carts", userId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data().items || []);
      } else {
        callback([]);
      }
    });
  },

  // Listen to user orders
  listenToUserOrders(userId: string, callback: (orders: Order[]) => void) {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      callback(orders);
    });
  },
};

// export async function addSampleProductsToFirestore() {
//   for (const product of mockProducts) {
//     // Remove id and createdAt to let Firestore generate them
//     const { id, createdAt, ...rest } = product;
//     await addDoc(collection(db, "products"), {
//       ...rest,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//   }
//   return true;
// }

// Fetch user by UID
export async function getUserByUid(uid: string) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

// Fetch all users
export async function getAllUsers() {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
}

// Update user status
export async function updateUserStatus(userId: string, newStatus: string) {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { status: newStatus });
    return true;
  } catch (error) {
    return false;
  }
}

// Review interface
export interface Review {
  id?: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: any;
  verified: boolean;
  helpful: number;
}

// Review Services
export const reviewService = {
  // Get reviews for a product
  async getProductReviews(productId: string) {
    try {
      // First get all reviews for the product
      const q = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      );

      const snapshot = await getDocs(q);
      const reviews: Review[] = [];

      snapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() } as Review);
      });

      // Sort reviews by createdAt in memory
      return reviews.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      throw error;
    }
  },

  // Add a new review
  async addReview(review: Omit<Review, "id" | "createdAt" | "helpful">) {
    try {
      const docRef = await addDoc(collection(db, "reviews"), {
        ...review,
        createdAt: serverTimestamp(),
        helpful: 0,
      });

      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Get average rating for a product
  async getProductRating(productId: string) {
    try {
      const reviews = await this.getProductReviews(productId);

      if (reviews.length === 0) {
        return { rating: 0, count: 0 };
      }

      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      return {
        rating: totalRating / reviews.length,
        count: reviews.length,
      };
    } catch (error) {
      throw error;
    }
  },

  // Update review helpful count
  async updateReviewHelpful(reviewId: string, helpfulCount: number) {
    try {
      const docRef = doc(db, "reviews", reviewId);
      await updateDoc(docRef, {
        helpful: helpfulCount,
      });
    } catch (error) {
      throw error;
    }
  },

  // Delete a review
  async deleteReview(reviewId: string) {
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
    } catch (error) {
      throw error;
    }
  },

  // Listen to product reviews changes
  listenToProductReviews(
    productId: string,
    callback: (reviews: Review[]) => void
  ) {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const reviews: Review[] = [];
      snapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() } as Review);
      });
      callback(reviews);
    });
  },
};
