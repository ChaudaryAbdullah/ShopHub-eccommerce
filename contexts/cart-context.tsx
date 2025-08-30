"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { cartService, realtimeService } from "@/lib/firebase-service";
import { useAuth } from "./auth-context";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) {
      setItems([]);
      return;
    }

    // Listen to real-time cart changes
    const unsubscribe = realtimeService.listenToUserCart(
      user.uid,
      (cartItems) => {
        setItems(cartItems);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      await cartService.addToCart(user.uid, { ...item, quantity: 1 });
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      await cartService.removeFromCart(user.uid, productId);
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      await cartService.updateCartItemQuantity(user.uid, productId, quantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      await cartService.clearCart(user.uid);
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
