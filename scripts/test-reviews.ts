import { reviewService } from "../lib/firebase-service";

async function testReview() {
  try {
    const testReview = {
      productId: "test-product",
      userId: "test-user",
      userName: "Test User",
      rating: 5,
      title: "Test Review",
      comment: "This is a test review",
      verified: true,
    };

    console.log("Adding test review...");
    const reviewId = await reviewService.addReview(testReview);
    console.log("Review added successfully with ID:", reviewId);

    console.log("\nRetrieving reviews...");
    const reviews = await reviewService.getProductReviews("test-product");
    console.log("Retrieved reviews:", JSON.stringify(reviews, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testReview();
