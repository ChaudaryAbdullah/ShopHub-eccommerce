"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { authService, getUserByUid } from "@/lib/firebase-service";
import { User as FirebaseUser } from "firebase/auth";

export type UserRole = "customer" | "vendor" | "admin";
export type AccountStatus = "pending" | "approved" | "rejected";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: any;
  storeName?: string;
  storeDescription?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: Partial<User> & { password: string }
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  firebaseUser: FirebaseUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Get user data from Firestore
        try {
          const userDoc = await getUserByUid(firebaseUser.uid);
          if (userDoc) {
            setUser({ ...(userDoc as User) });
          } else {
            // fallback if user doc not found
            const fallbackUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || "",
              role: "customer",
              status: "approved",
              createdAt: new Date(),
            };
            setUser(fallbackUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await authService.signIn(email, password);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    userData: Partial<User> & { password: string }
  ): Promise<boolean> => {
    try {
      await authService.register(
        userData.email!,
        userData.password,
        userData.name || "",
        userData.role || "customer"
      );
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading, firebaseUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
