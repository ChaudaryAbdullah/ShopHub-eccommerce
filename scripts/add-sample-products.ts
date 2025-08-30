import { addSampleProductsToFirestore } from "../lib/firebase-service";

(async () => {
  try {
    await addSampleProductsToFirestore();
    console.log("Sample products added to Firestore!");
  } catch (err) {
    console.error("Failed to add sample products:", err);
  }
})();
