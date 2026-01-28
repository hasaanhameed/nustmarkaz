import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getProductById, updateProduct, type Product } from "@/api/product";
import { toast } from "sonner";

const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    condition: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        navigate("/marketplace");
        return;
      }

      try {
        const data = await getProductById(parseInt(id));
        setProduct(data);
        setFormData({
          description: data.description || "",
          price: data.price.toString(),
          condition: data.condition || "",
        });
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
        navigate("/marketplace");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !product) return;

    if (!formData.description.trim() || !formData.price || !formData.condition) {
      toast.error("Please fill in all fields");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setSubmitting(true);
      await updateProduct(parseInt(id), {
        description: formData.description,
        price: price,
        condition: formData.condition,
      });
      toast.success("Product updated successfully!");
      navigate(`/marketplace/${id}`);
    } catch (error: any) {
      console.error("Failed to update product:", error);
      toast.error(error.response?.data?.detail || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/marketplace/${id}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Product
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Non-editable fields */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Title (Not Editable)</Label>
                <Input value={product.title} disabled />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Category (Not Editable)</Label>
                <Input value={product.category} disabled />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Contact (Not Editable)</Label>
                <Input value={product.contact_number} disabled />
              </div>

              {/* Editable fields */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs.) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/marketplace/${id}`)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Product"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}