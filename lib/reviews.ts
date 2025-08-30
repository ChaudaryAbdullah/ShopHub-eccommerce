import { reviewService, type Review } from "./firebase-service";

export type { Review };

// Firebase-based review functions
export async function getReviewsByProduct(
  productId: string
): Promise<Review[]> {
  try {
    return await reviewService.getProductReviews(productId);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    // Fallback to mock data when Firebase query fails
    return mockReviews.filter((review) => review.productId === productId);
  }
}

export async function addReview(
  review: Omit<Review, "id" | "createdAt" | "helpful">
): Promise<string> {
  try {
    return await reviewService.addReview(review);
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

export async function getAverageRating(
  productId: string
): Promise<{ rating: number; count: number }> {
  try {
    return await reviewService.getProductRating(productId);
  } catch (error) {
    console.error("Error getting average rating:", error);
    return { rating: 0, count: 0 };
  }
}

// Mock reviews data for fallback or initial seeding
export const mockReviews: Review[] = [
  {
    id: "1",
    productId: "1",
    userId: "3",
    userName: "John D.",
    rating: 5,
    title: "Excellent product!",
    comment:
      "Exactly as described and fast shipping. The quality is outstanding and I'm very satisfied with my purchase.",
    createdAt: "2024-01-15",
    verified: true,
    helpful: 12,
  },
  {
    id: "2",
    productId: "1",
    userId: "4",
    userName: "Sarah M.",
    rating: 4,
    title: "Good quality",
    comment:
      "Good quality product, though delivery took a bit longer than expected. Overall satisfied with the purchase.",
    createdAt: "2024-01-10",
    verified: true,
    helpful: 8,
  },
  {
    id: "3",
    productId: "1",
    userId: "5",
    userName: "Mike R.",
    rating: 5,
    title: "Outstanding value",
    comment:
      "Outstanding value for money. Highly recommended! The features are exactly what I needed.",
    createdAt: "2024-01-05",
    verified: false,
    helpful: 15,
  },
  {
    id: "4",
    productId: "2",
    userId: "6",
    userName: "Emily K.",
    rating: 4,
    title: "Great smartphone",
    comment:
      "Amazing camera quality and battery life. The display is crisp and colors are vibrant.",
    createdAt: "2024-01-12",
    verified: true,
    helpful: 9,
  },
  {
    id: "5",
    productId: "2",
    userId: "7",
    userName: "David L.",
    rating: 5,
    title: "Perfect upgrade",
    comment:
      "This phone exceeded my expectations. Fast performance and excellent build quality.",
    createdAt: "2024-01-08",
    verified: true,
    helpful: 11,
  },
  {
    id: "6",
    productId: "3",
    userId: "8",
    userName: "Lisa W.",
    rating: 5,
    title: "Love these headphones!",
    comment:
      "Incredible sound quality and noise cancellation. Perfect for work and travel.",
    createdAt: "2024-01-14",
    verified: true,
    helpful: 7,
  },
];
