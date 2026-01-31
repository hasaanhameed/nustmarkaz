import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/ui/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Search, Plus, ShoppingBag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllProducts, Product } from "@/api/product";
import { getCurrentUser, User } from "@/api/user";

const categories = [
  "All",
  "Books",
  "Electronics",
  "Furniture",
  "Clothing",
  "Other",
];
const sortOptions = ["Latest", "Price: Low to High", "Price: High to Low"];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCurrentUser();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts(0, 100); // Fetch up to 100 products
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setCurrentUser(null);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    return 0; // Latest (default order from API)
  });

  return (
    <Layout>
      <div className="bg-background min-h-screen relative overflow-hidden">
        {/* Rich Background Treatment */}
        <div className="absolute inset-0 bg-grid-subtle opacity-100 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -ml-32 -mb-32" />

        <div className="container-custom py-12 relative z-10">
          {/* Marketplace Header */}
          {/* Marketplace Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-16 animate-entrance">
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tight leading-none">
              Explore the <span className="text-primary italic">Market.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium mb-10 leading-relaxed text-balance">
              Discover verified campus listings from your fellow NUSTians. Secure, sustainable, and student-powered.
            </p>
            <div className="flex justify-center">
              {currentUser ? (
                <Link to="/marketplace/create">
                  <Button className="h-16 px-10 rounded-full gap-3 font-bold text-lg shadow-xl shadow-primary/20 btn-hover-effect bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-6 w-6" />
                    List an Item
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="h-16 px-10 rounded-full gap-3 font-bold text-lg shadow-xl shadow-primary/20 btn-hover-effect bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-6 w-6" />
                    Sign in to Post
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-12 animate-entrance" style={{ animationDelay: '0.2s' }}>
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                <Input
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-16 h-16 bg-white/40 backdrop-blur-md border-border/50 focus:bg-white focus:border-primary/30 rounded-2xl text-foreground font-medium transition-all shadow-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full sm:w-[200px] h-16 bg-white/40 backdrop-blur-md border-border/50 rounded-2xl text-foreground/70 font-bold hover:bg-white transition-colors shadow-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="rounded-lg font-medium">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[200px] h-16 bg-white/40 backdrop-blur-md border-border/50 rounded-2xl text-foreground/70 font-bold hover:bg-white transition-colors shadow-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50">
                    {sortOptions.map((option) => (
                      <SelectItem key={option} value={option} className="rounded-lg font-medium">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Area */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-[400px] rounded-[2rem] bg-secondary/30 animate-pulse border border-border/50" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-32 animate-entrance bg-white/40 backdrop-blur-md rounded-[3rem] border border-border/50">
                <p className="text-destructive font-bold mb-6 text-lg">{error}</p>
                <Button onClick={fetchProducts} variant="outline" className="h-14 px-8 rounded-xl font-bold border-border/60 hover:border-primary/30">
                  Try Again
                </Button>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="animate-entrance"
                    style={{ animationDelay: `${0.3 + (i % 8) * 0.1}s` }}
                  >
                    <ListingCard
                      id={product.id.toString()}
                      title={product.title}
                      description={product.description}
                      image={
                        product.images[0]?.image_path ||
                        "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400"
                      }
                      type="product"
                      price={product.price}
                      location={product.pickup_location}
                      author={{ name: product.creator.username }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="animate-entrance">
                <EmptyState
                  icon={ShoppingBag}
                  title="No listings found"
                  description="Try adjusting your filters or search to discover what your campus has to offer."
                  onAction={() => { setCategory("All"); setSearchQuery(""); }}
                  actionLabel="Back to All"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
