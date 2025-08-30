export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  icon: string
  parentId?: string
  subcategories?: Category[]
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets and electronic devices",
    image: "/placeholder.svg?height=400&width=600&text=Electronics",
    icon: "Smartphone",
    subcategories: [
      {
        id: "1-1",
        name: "Smartphones",
        slug: "smartphones",
        description: "Latest smartphones and accessories",
        image: "/placeholder.svg?height=300&width=400&text=Smartphones",
        icon: "Smartphone",
        parentId: "1",
      },
      {
        id: "1-2",
        name: "Laptops",
        slug: "laptops",
        description: "High-performance laptops and notebooks",
        image: "/placeholder.svg?height=300&width=400&text=Laptops",
        icon: "Laptop",
        parentId: "1",
      },
      {
        id: "1-3",
        name: "Audio",
        slug: "audio",
        description: "Headphones, speakers, and audio equipment",
        image: "/placeholder.svg?height=300&width=400&text=Audio",
        icon: "Headphones",
        parentId: "1",
      },
    ],
  },
  {
    id: "2",
    name: "Fashion",
    slug: "fashion",
    description: "Trendy clothing and accessories",
    image: "/placeholder.svg?height=400&width=600&text=Fashion",
    icon: "Shirt",
    subcategories: [
      {
        id: "2-1",
        name: "Men's Clothing",
        slug: "mens-clothing",
        description: "Stylish clothing for men",
        image: "/placeholder.svg?height=300&width=400&text=Men's+Clothing",
        icon: "Shirt",
        parentId: "2",
      },
      {
        id: "2-2",
        name: "Women's Clothing",
        slug: "womens-clothing",
        description: "Fashion-forward clothing for women",
        image: "/placeholder.svg?height=300&width=400&text=Women's+Clothing",
        icon: "Shirt",
        parentId: "2",
      },
      {
        id: "2-3",
        name: "Shoes",
        slug: "shoes",
        description: "Comfortable and stylish footwear",
        image: "/placeholder.svg?height=300&width=400&text=Shoes",
        icon: "Footprints",
        parentId: "2",
      },
    ],
  },
  {
    id: "3",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Everything for your home and garden",
    image: "/placeholder.svg?height=400&width=600&text=Home+%26+Garden",
    icon: "Home",
    subcategories: [
      {
        id: "3-1",
        name: "Furniture",
        slug: "furniture",
        description: "Quality furniture for every room",
        image: "/placeholder.svg?height=300&width=400&text=Furniture",
        icon: "Armchair",
        parentId: "3",
      },
      {
        id: "3-2",
        name: "Kitchen",
        slug: "kitchen",
        description: "Kitchen appliances and accessories",
        image: "/placeholder.svg?height=300&width=400&text=Kitchen",
        icon: "ChefHat",
        parentId: "3",
      },
      {
        id: "3-3",
        name: "Garden",
        slug: "garden",
        description: "Gardening tools and outdoor equipment",
        image: "/placeholder.svg?height=300&width=400&text=Garden",
        icon: "TreePine",
        parentId: "3",
      },
    ],
  },
  {
    id: "4",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Sports equipment and fitness gear",
    image: "/placeholder.svg?height=400&width=600&text=Sports+%26+Fitness",
    icon: "Dumbbell",
    subcategories: [
      {
        id: "4-1",
        name: "Fitness Equipment",
        slug: "fitness-equipment",
        description: "Home gym and fitness equipment",
        image: "/placeholder.svg?height=300&width=400&text=Fitness+Equipment",
        icon: "Dumbbell",
        parentId: "4",
      },
      {
        id: "4-2",
        name: "Outdoor Sports",
        slug: "outdoor-sports",
        description: "Equipment for outdoor activities",
        image: "/placeholder.svg?height=300&width=400&text=Outdoor+Sports",
        icon: "Mountain",
        parentId: "4",
      },
    ],
  },
  {
    id: "5",
    name: "Books & Media",
    slug: "books-media",
    description: "Books, movies, and digital media",
    image: "/placeholder.svg?height=400&width=600&text=Books+%26+Media",
    icon: "Book",
    subcategories: [
      {
        id: "5-1",
        name: "Books",
        slug: "books",
        description: "Fiction, non-fiction, and educational books",
        image: "/placeholder.svg?height=300&width=400&text=Books",
        icon: "Book",
        parentId: "5",
      },
      {
        id: "5-2",
        name: "Movies & TV",
        slug: "movies-tv",
        description: "Movies, TV shows, and entertainment",
        image: "/placeholder.svg?height=300&width=400&text=Movies+%26+TV",
        icon: "Film",
        parentId: "5",
      },
    ],
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  for (const category of categories) {
    if (category.slug === slug) return category
    if (category.subcategories) {
      const subcategory = category.subcategories.find((sub) => sub.slug === slug)
      if (subcategory) return subcategory
    }
  }
  return undefined
}

export function getAllCategories(): Category[] {
  return categories
}

export function getSubcategories(parentId: string): Category[] {
  const parent = categories.find((cat) => cat.id === parentId)
  return parent?.subcategories || []
}
