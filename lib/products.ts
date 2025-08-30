import { productService, realtimeService } from "./firebase-service";

// Type for Firestore Timestamp-like objects
interface TimestampLike {
  toDate(): Date;
  seconds: number;
  nanoseconds: number;
}

export interface Product {
  id: string;
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
  updatedAt?: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  brand?: string;
  specifications?: Record<string, string>;
  featured?: boolean;
  onSale?: boolean;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  search?: string;
}

export interface ProductSort {
  field: "name" | "price" | "rating" | "createdAt";
  direction: "asc" | "desc";
}

// Enhanced mock products data with multiple images

export const mockProducts: Product[] = [
  // Electronics - Smartphones
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    description:
      "The most advanced iPhone with titanium design, A17 Pro chip, and professional camera system. Features include Dynamic Island, Always-On display, and advanced computational photography.",
    price: 1199.99,
    originalPrice: 1299.99,
    image: "/placeholder.svg?height=400&width=400&text=iPhone+15+Pro",
    images: [
      "/placeholder.svg?height=400&width=400&text=iPhone+15+Pro+Front",
      "/placeholder.svg?height=400&width=400&text=iPhone+15+Pro+Back",
      "/placeholder.svg?height=400&width=400&text=iPhone+15+Pro+Side",
      "/placeholder.svg?height=400&width=400&text=iPhone+15+Pro+Camera",
    ],
    category: "Electronics",
    subcategory: "Smartphones",
    vendorId: "2",
    vendorName: "TechWorld Store",
    stock: 25,
    createdAt: "2024-01-01",
    rating: 4.8,
    reviewCount: 1247,
    tags: ["smartphone", "apple", "5g", "premium"],
    brand: "Apple",
    featured: true,
    onSale: true,
    specifications: {
      Display: "6.7-inch Super Retina XDR",
      Chip: "A17 Pro",
      Storage: "256GB",
      Camera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      Battery: "Up to 29 hours video playback",
      "Operating System": "iOS 17",
      "Water Resistance": "IP68",
      "Wireless Charging": "MagSafe and Qi",
    },
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    description:
      "Premium Android smartphone with S Pen, advanced AI features, and exceptional camera quality. Built with titanium frame and Gorilla Glass Victus 2.",
    price: 1099.99,
    image: "/placeholder.svg?height=400&width=400&text=Galaxy+S24+Ultra",
    images: [
      "/placeholder.svg?height=400&width=400&text=Galaxy+S24+Ultra+Front",
      "/placeholder.svg?height=400&width=400&text=Galaxy+S24+Ultra+Back",
      "/placeholder.svg?height=400&width=400&text=Galaxy+S24+Ultra+SPen",
      "/placeholder.svg?height=400&width=400&text=Galaxy+S24+Ultra+Camera",
    ],
    category: "Electronics",
    subcategory: "Smartphones",
    vendorId: "2",
    vendorName: "TechWorld Store",
    stock: 18,
    createdAt: "2024-01-02",
    rating: 4.7,
    reviewCount: 892,
    tags: ["smartphone", "samsung", "android", "s-pen"],
    brand: "Samsung",
    featured: true,
    specifications: {
      Display: "6.8-inch Dynamic AMOLED 2X",
      Processor: "Snapdragon 8 Gen 3",
      Storage: "256GB",
      Camera: "200MP Main + 50MP Periscope + 12MP Ultra Wide + 10MP Telephoto",
      Battery: "5000mAh",
      "Operating System": "Android 14 with One UI 6.1",
      "S Pen": "Included",
      "Water Resistance": "IP68",
    },
  },
  // Electronics - Laptops
  {
    id: "3",
    name: "MacBook Pro 16-inch M3 Max",
    description:
      "Professional laptop with M3 Max chip, stunning Liquid Retina XDR display, and all-day battery life. Perfect for creative professionals and developers.",
    price: 2499.99,
    image: "/placeholder.svg?height=400&width=400&text=MacBook+Pro+16",
    images: [
      "/placeholder.svg?height=400&width=400&text=MacBook+Pro+16+Closed",
      "/placeholder.svg?height=400&width=400&text=MacBook+Pro+16+Open",
      "/placeholder.svg?height=400&width=400&text=MacBook+Pro+16+Side",
      "/placeholder.svg?height=400&width=400&text=MacBook+Pro+16+Ports",
    ],
    category: "Electronics",
    subcategory: "Laptops",
    vendorId: "2",
    vendorName: "TechWorld Store",
    stock: 12,
    createdAt: "2024-01-03",
    rating: 4.9,
    reviewCount: 456,
    tags: ["laptop", "apple", "professional", "m3"],
    brand: "Apple",
    featured: true,
    specifications: {
      Chip: "Apple M3 Max",
      Display: "16.2-inch Liquid Retina XDR",
      Memory: "36GB Unified Memory",
      Storage: "1TB SSD",
      Battery: "Up to 22 hours",
      "Operating System": "macOS Sonoma",
      Ports: "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3",
      Weight: "4.7 pounds",
    },
  },
  {
    id: "4",
    name: "Dell XPS 13 Plus",
    description:
      "Ultra-thin laptop with InfinityEdge display, premium materials, and exceptional performance. Features a seamless glass palm rest and invisible touchpad.",
    price: 1299.99,
    originalPrice: 1499.99,
    image: "/placeholder.svg?height=400&width=400&text=Dell+XPS+13",
    images: [
      "/placeholder.svg?height=400&width=400&text=Dell+XPS+13+Closed",
      "/placeholder.svg?height=400&width=400&text=Dell+XPS+13+Open",
      "/placeholder.svg?height=400&width=400&text=Dell+XPS+13+Keyboard",
      "/placeholder.svg?height=400&width=400&text=Dell+XPS+13+Ports",
    ],
    category: "Electronics",
    subcategory: "Laptops",
    vendorId: "3",
    vendorName: "Computer Hub",
    stock: 8,
    createdAt: "2024-01-04",
    rating: 4.6,
    reviewCount: 324,
    tags: ["laptop", "dell", "ultrabook", "windows"],
    brand: "Dell",
    onSale: true,
    specifications: {
      Processor: "Intel Core i7-1360P",
      Display: "13.4-inch OLED InfinityEdge",
      Memory: "16GB LPDDR5",
      Storage: "512GB SSD",
      Graphics: "Intel Iris Xe",
      "Operating System": "Windows 11 Pro",
      Weight: "2.73 pounds",
      "Battery Life": "Up to 12 hours",
    },
  },
  // Electronics - Audio
  {
    id: "5",
    name: "Sony WH-1000XM5 Headphones",
    description:
      "Industry-leading noise canceling wireless headphones with exceptional sound quality. Features 30-hour battery life and quick charge capability.",
    price: 349.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=400&width=400&text=Sony+WH-1000XM5",
    images: [
      "/placeholder.svg?height=400&width=400&text=Sony+WH-1000XM5+Front",
      "/placeholder.svg?height=400&width=400&text=Sony+WH-1000XM5+Side",
      "/placeholder.svg?height=400&width=400&text=Sony+WH-1000XM5+Folded",
      "/placeholder.svg?height=400&width=400&text=Sony+WH-1000XM5+Case",
    ],
    category: "Electronics",
    subcategory: "Audio",
    vendorId: "2",
    vendorName: "TechWorld Store",
    stock: 45,
    createdAt: "2024-01-05",
    rating: 4.7,
    reviewCount: 2156,
    tags: ["headphones", "sony", "wireless", "noise-canceling"],
    brand: "Sony",
    onSale: true,
    specifications: {
      Driver: "30mm",
      "Frequency Response": "4Hz-40kHz",
      "Battery Life": "Up to 30 hours",
      Connectivity: "Bluetooth 5.2",
      Weight: "250g",
      "Noise Canceling": "Industry-leading",
      "Quick Charge": "3 min for 3 hours playback",
      "Voice Assistant": "Alexa, Google Assistant",
    },
  },
  // Fashion - Men's Clothing
  {
    id: "6",
    name: "Premium Cotton T-Shirt",
    description:
      "Comfortable and stylish cotton t-shirt perfect for everyday wear. Made from 100% organic cotton with a modern fit.",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=400&text=Cotton+T-Shirt",
    images: [
      "/placeholder.svg?height=400&width=400&text=Cotton+T-Shirt+Front",
      "/placeholder.svg?height=400&width=400&text=Cotton+T-Shirt+Back",
      "/placeholder.svg?height=400&width=400&text=Cotton+T-Shirt+Detail",
    ],
    category: "Fashion",
    subcategory: "Men's Clothing",
    vendorId: "4",
    vendorName: "Fashion Forward",
    stock: 150,
    createdAt: "2024-01-06",
    rating: 4.4,
    reviewCount: 789,
    tags: ["t-shirt", "cotton", "casual", "mens"],
    brand: "StyleCo",
    specifications: {
      Material: "100% Organic Cotton",
      Fit: "Regular",
      Care: "Machine Washable",
      Sizes: "S, M, L, XL, XXL",
      Colors: "White, Black, Navy, Gray",
      Origin: "Made in USA",
    },
  },
  {
    id: "7",
    name: "Slim Fit Jeans",
    description:
      "Modern slim fit jeans with premium denim and comfortable stretch. Features classic five-pocket styling with contemporary fit.",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=400&width=400&text=Slim+Fit+Jeans",
    images: [
      "/placeholder.svg?height=400&width=400&text=Slim+Fit+Jeans+Front",
      "/placeholder.svg?height=400&width=400&text=Slim+Fit+Jeans+Back",
      "/placeholder.svg?height=400&width=400&text=Slim+Fit+Jeans+Detail",
    ],
    category: "Fashion",
    subcategory: "Men's Clothing",
    vendorId: "4",
    vendorName: "Fashion Forward",
    stock: 85,
    createdAt: "2024-01-07",
    rating: 4.5,
    reviewCount: 456,
    tags: ["jeans", "denim", "slim-fit", "mens"],
    brand: "DenimCo",
    onSale: true,
    specifications: {
      Material: "98% Cotton, 2% Elastane",
      Fit: "Slim",
      Rise: "Mid-rise",
      Sizes: "28-38 waist",
      Colors: "Dark Blue, Light Blue, Black",
      Care: "Machine wash cold",
    },
  },
  // Fashion - Women's Clothing
  {
    id: "8",
    name: "Elegant Summer Dress",
    description:
      "Beautiful floral summer dress perfect for any occasion. Features a flattering A-line silhouette and breathable fabric.",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=400&text=Summer+Dress",
    images: [
      "/placeholder.svg?height=400&width=400&text=Summer+Dress+Front",
      "/placeholder.svg?height=400&width=400&text=Summer+Dress+Back",
      "/placeholder.svg?height=400&width=400&text=Summer+Dress+Detail",
    ],
    category: "Fashion",
    subcategory: "Women's Clothing",
    vendorId: "4",
    vendorName: "Fashion Forward",
    stock: 65,
    createdAt: "2024-01-08",
    rating: 4.6,
    reviewCount: 234,
    tags: ["dress", "summer", "floral", "womens"],
    brand: "ElegantWear",
    featured: true,
    specifications: {
      Material: "Polyester Blend",
      Length: "Midi",
      Sleeve: "Short Sleeve",
      Sizes: "XS, S, M, L, XL",
      Pattern: "Floral",
      Care: "Hand wash recommended",
    },
  },
  // Home & Garden - Furniture
  {
    id: "9",
    name: "Modern Ergonomic Office Chair",
    description:
      "Comfortable office chair with lumbar support and adjustable features. Designed for long hours of comfortable seating.",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=400&width=400&text=Office+Chair",
    images: [
      "/placeholder.svg?height=400&width=400&text=Office+Chair+Front",
      "/placeholder.svg?height=400&width=400&text=Office+Chair+Side",
      "/placeholder.svg?height=400&width=400&text=Office+Chair+Back",
      "/placeholder.svg?height=400&width=400&text=Office+Chair+Detail",
    ],
    category: "Home & Garden",
    subcategory: "Furniture",
    vendorId: "5",
    vendorName: "Home Essentials",
    stock: 32,
    createdAt: "2024-01-09",
    rating: 4.3,
    reviewCount: 567,
    tags: ["chair", "office", "ergonomic", "furniture"],
    brand: "ComfortSeating",
    onSale: true,
    specifications: {
      Material: "Mesh and Fabric",
      "Weight Capacity": "300 lbs",
      "Adjustable Height": "Yes",
      "Lumbar Support": "Yes",
      Warranty: "5 years",
      Assembly: "Required",
      Dimensions: '26" W x 26" D x 40-44" H',
    },
  },
  // Sports & Fitness
  {
    id: "10",
    name: "Adjustable Dumbbell Set",
    description:
      "Space-saving adjustable dumbbells perfect for home workouts. Quick-select dial system for easy weight changes.",
    price: 199.99,
    image: "/placeholder.svg?height=400&width=400&text=Dumbbell+Set",
    images: [
      "/placeholder.svg?height=400&width=400&text=Dumbbell+Set+Pair",
      "/placeholder.svg?height=400&width=400&text=Dumbbell+Set+Single",
      "/placeholder.svg?height=400&width=400&text=Dumbbell+Set+Dial",
      "/placeholder.svg?height=400&width=400&text=Dumbbell+Set+Stand",
    ],
    category: "Sports & Fitness",
    subcategory: "Fitness Equipment",
    vendorId: "6",
    vendorName: "FitGear Pro",
    stock: 28,
    createdAt: "2024-01-10",
    rating: 4.5,
    reviewCount: 345,
    tags: ["dumbbells", "fitness", "home-gym", "adjustable"],
    brand: "FitPro",
    specifications: {
      "Weight Range": "5-50 lbs per dumbbell",
      Material: "Cast Iron with Rubber Coating",
      Adjustment: "Quick-Select Dial",
      "Space Required": "Minimal",
      "Total Weight": "100 lbs (pair)",
      Warranty: "2 years",
    },
  },
];

let productsInitialized = false;

function initializeFirebaseProductListener() {
  if (productsInitialized) return;
  productsInitialized = true;

  // Listen to real-time product changes from Firebase
  realtimeService.listenToProducts((fproducts) => {
    mockProducts.length = 0;
    mockProducts.push(
      ...fproducts
        .filter(
          (p): p is Product & { createdAt: unknown } => typeof p.id === "string"
        )
        .map((p) => {
          // Convert Firestore timestamp to ISO string if it exists
          const createdAt =
            typeof p.createdAt === "object" &&
            p.createdAt &&
            "toDate" in p.createdAt
              ? (p.createdAt as TimestampLike).toDate().toISOString()
              : new Date().toISOString();

          // Remove any Firestore-specific fields and ensure type safety
          const { id, ...rest } = p;
          const product: Product = {
            ...rest,
            id: id as string,
            createdAt,
          };

          return product;
        })
    );
    console.log("[mockProducts] Synced from Firebase:", mockProducts.length);
  });
}

// initializeFirebaseProductListener();

export function getProducts(
  filters?: ProductFilters,
  sort?: ProductSort,
  page = 1,
  limit = 12
): {
  products: Product[];
  total: number;
  hasMore: boolean;
} {
  let filteredProducts = [...mockProducts];

  // Apply filters
  if (filters) {
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filters.category
      );
    }
    if (filters.subcategory) {
      filteredProducts = filteredProducts.filter(
        (p) => p.subcategory === filters.subcategory
      );
    }
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= filters.minPrice!
      );
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= filters.maxPrice!
      );
    }
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(
        (p) => p.brand === filters.brand
      );
    }
    if (filters.rating !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.rating >= filters.rating!
      );
    }
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter((p) => p.stock > 0);
    }
    if (filters.onSale) {
      filteredProducts = filteredProducts.filter((p) => p.onSale);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
          p.brand?.toLowerCase().includes(searchTerm)
      );
    }
  }

  // Apply sorting
  if (sort) {
    filteredProducts.sort((a, b) => {
      let aValue: any = a[sort.field];
      let bValue: any = b[sort.field];

      if (sort.field === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sort.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    total: filteredProducts.length,
    hasMore: endIndex < filteredProducts.length,
  };
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return mockProducts.filter((p) => p.featured).slice(0, 8);
}

export function getProductsByVendor(vendorId: string): Product[] {
  return mockProducts.filter((product) => product.vendorId === vendorId);
}

export function getBrands(): string[] {
  const brands = new Set<string>();
  mockProducts.forEach((product) => {
    if (product.brand) brands.add(product.brand);
  });
  return Array.from(brands).sort();
}

export function addProduct(
  product: Omit<Product, "id" | "createdAt">
): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  mockProducts.push(newProduct);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): boolean {
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...updates };
    return true;
  }
  return false;
}

export function deleteProduct(id: string): boolean {
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index !== -1) {
    mockProducts.splice(index, 1);
    return true;
  }
  return false;
}
