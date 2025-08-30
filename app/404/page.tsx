import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search } from "lucide-react"
import Navbar from "@/components/navbar"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="mb-8">
                <div className="text-8xl font-bold text-primary mb-4">404</div>
                <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
                <p className="text-muted-foreground text-lg">
                  Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered
                  the wrong URL.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/">
                    <Home className="mr-2 h-5 w-5" />
                    Back to Home
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/search">
                    <Search className="mr-2 h-5 w-5" />
                    Search Products
                  </Link>
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground mb-4">Or try one of these popular categories:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/category/electronics">Electronics</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/category/fashion">Fashion</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/category/home-garden">Home & Garden</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/deals">Hot Deals</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
