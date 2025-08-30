// This service layer will make it easy to switch to Firebase later
export interface DataService {
  getProducts: (filters?: any) => Promise<any[]>;
  getCategories: () => Promise<any[]>;
  getFeaturedProducts: () => Promise<any[]>;
  getDeals: () => Promise<any[]>;
  getNewArrivals: () => Promise<any[]>;
  getBestSellers: () => Promise<any[]>;
  getTrendingProducts: () => Promise<any[]>;
}

import { getProducts, getFeaturedProducts, mockProducts } from "./products";
import { categories } from "./categories";

// Mock implementation - easily replaceable with Firebase
class MockDataService implements DataService {
  async getProducts(filters?: any) {
    // This will be replaced with Firebase queries
    return getProducts(filters).products;
  }

  async getCategories() {
    return categories;
  }

  async getFeaturedProducts() {
    return getFeaturedProducts();
  }

  async getDeals() {
    return mockProducts.filter((p) => p.onSale).slice(0, 12);
  }

  async getNewArrivals() {
    return mockProducts
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 12);
  }

  async getBestSellers() {
    return mockProducts
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 12);
  }

  async getTrendingProducts() {
    return mockProducts
      .filter((p) => p.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 12);
  }
}

// Export singleton instance
export const dataService: DataService = new MockDataService();

// Firebase service implementation (for future use)
export class FirebaseDataService implements DataService {
  async getProducts(filters?: any): Promise<any[]> {
    // Firebase implementation
    // const db = getFirestore()
    // const productsRef = collection(db, 'products')
    // Apply filters and return results
    throw new Error("Firebase not implemented yet");
  }

  async getCategories(): Promise<any[]> {
    // Firebase implementation
    throw new Error("Firebase not implemented yet");
  }

  async getFeaturedProducts(): Promise<any[]> {
    // Firebase implementation
    throw new Error("Firebase not implemented yet");
  }

  async getDeals(): Promise<any[]> {
    // Firebase implementation
    throw new Error("Firebase not implemented yet");
  }

  async getNewArrivals(): Promise<any[]> {
    // Firebase implementation
    throw new Error("Firebase not implemented yet");
  }

  async getBestSellers(): Promise<any[]> {
    // Firebase implementation
    throw new Error("Firebase not implemented yet");
  }

  async getTrendingProducts(): Promise<any[]> {
    // Firebase implementation
    throw new Error("Firebase not implemented yet");
  }
}
