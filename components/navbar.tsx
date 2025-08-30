"use client";

import type React from "react";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  ShoppingCart,
  User,
  Store,
  Settings,
  Search,
  Heart,
  Menu,
} from "lucide-react";
import { categories } from "@/lib/categories";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="text-2xl font-bold text-primary">
            ShopHub
          </Link>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* User actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {user.role === "customer" && (
                  <>
                    <Link href="/wishlist">
                      <Button variant="ghost" size="sm" className="relative">
                        <Heart className="h-4 w-4" />
                        {wishlistItems.length > 0 && (
                          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {wishlistItems.length}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                    <Link href="/cart">
                      <Button variant="ghost" size="sm" className="relative">
                        <ShoppingCart className="h-4 w-4" />
                        {getTotalItems() > 0 && (
                          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {getTotalItems()}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">
                        {user.displayName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {user.role === "vendor" && user.status === "approved" && (
                      <DropdownMenuItem asChild>
                        <Link href="/vendor">
                          <Store className="h-4 w-4 mr-2" />
                          Vendor Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {user.role === "customer" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/orders">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            My Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <form onSubmit={handleSearch} className="md:hidden">
                    <div className="relative">
                      <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>

                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Navigation menu */}
        <div className="hidden md:flex items-center justify-between py-2 border-t">
          <NavigationMenu>
            <NavigationMenuList>
              {categories.map((category) => (
                <NavigationMenuItem key={category.id}>
                  <NavigationMenuTrigger className="h-auto py-2">
                    <Link href={`/category/${category.slug}`}>
                      {category.name}
                    </Link>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {category.subcategories?.map((subcategory) => (
                        <NavigationMenuLink key={subcategory.id} asChild>
                          <Link
                            href={`/category/${subcategory.slug}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {subcategory.name}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {subcategory.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4 text-sm">
            <Link href="/deals" className="hover:text-primary font-medium">
              🔥 Hot Deals
            </Link>
            <Link
              href="/new-arrivals"
              className="hover:text-primary font-medium"
            >
              ✨ New Arrivals
            </Link>
            <Link
              href="/best-sellers"
              className="hover:text-primary font-medium"
            >
              🏆 Best Sellers
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
