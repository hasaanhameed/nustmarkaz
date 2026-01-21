import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";
import { ArrowLeft, MapPin, Calendar, MessageCircle, Share2, Heart, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductDetailPage() {
  const { id } = useParams();
  
  // Mock data fetch - replace with API call later
  const product = mockProducts.find((p) => p.id === id) || mockProducts[0];

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
          {/* Image */}
          <div className="aspect-square rounded-xl overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <Badge className="bg-accent text-accent-foreground mb-4">Product</Badge>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-3xl font-bold text-accent mb-6">
              Rs. {product.price?.toLocaleString()}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              {product.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Listed 2 days ago</span>
              </div>
            </div>

            <div className="border-t border-b border-border py-6 mb-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Seller Info */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                    {product.author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{product.author.name}</p>
                    <p className="text-sm text-muted-foreground">NUST Student</p>
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
                Contact Seller
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
