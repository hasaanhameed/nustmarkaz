import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  MessageCircle,
  Share2,
  Heart,
  Flag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getProductById, Product } from "@/api/product";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const productData = await getProductById(parseInt(id));
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-8 flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || "Product not found"}</p>
            <Link to="/marketplace">
              <Button variant="outline">Back to Marketplace</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const creatorInitial = product.user.username.charAt(0).toUpperCase();
  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.image_path)
      : ["https://images.unsplash.com/photo-1516826957135-700dedea698c?w=500"];

  const currentImage = images[currentImageIndex];

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Back button */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-muted relative mb-4">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Navigation arrows - only show if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-accent"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <Badge className="bg-accent text-accent-foreground mb-4">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-3xl font-bold text-accent mb-6">
              Rs. {product.price?.toLocaleString()}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{product.pickup_location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Condition: {product.condition}</span>
              </div>
            </div>

            <div className="border-t border-b border-border py-6 mb-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Creator Info */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">
                  Posted by
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                    {creatorInitial}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{product.user.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.user.department}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <MessageCircle className="h-4 w-4" />
                Contact Creator
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
