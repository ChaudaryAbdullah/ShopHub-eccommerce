"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { wishlistService } from "@/lib/firebase-service";
import { useAuth } from "./auth-context";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt?: any;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, "addedAt">) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) {
      setItems([]);
      return;
    }

    // Load wishlist from Firebase
    const loadWishlist = async () => {
      try {
        const wishlistItems = await wishlistService.getUserWishlist(user.uid);
        setItems(wishlistItems);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };

    loadWishlist();
  }, [user?.uid]);

  const addToWishlist = async (item: Omit<WishlistItem, "addedAt">) => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      await wishlistService.addToWishlist(user.uid, item);
      // Update local state
      setItems((prev) => [...prev, { ...item, addedAt: new Date() }]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      await wishlistService.removeFromWishlist(user.uid, productId);
      // Update local state
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  const clearWishlist = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      // Remove all items from wishlist
      for (const item of items) {
        await wishlistService.removeFromWishlist(user.uid, item.productId);
      }
      setItems([]);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
