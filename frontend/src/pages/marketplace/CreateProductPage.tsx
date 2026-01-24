import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X } from "lucide-react";
import { createProduct, ProductCreateRequest } from "@/api/product";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Books",
  "Electronics",
  "Furniture",
  "Clothing",
  "Sports",
  "Stationery",
  "Other",
];

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    condition: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert files to data URLs for preview
    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: "Please upload image files only.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload images smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImages((prev) => [...prev, base64String].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (images.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const productData: ProductCreateRequest = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        pickup_location: formData.location,
        condition: formData.condition,
        image_paths: images,
      };

      await createProduct(productData);

      toast({
        title: "Success!",
        description: "Your product has been listed successfully.",
      });

      navigate("/marketplace");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.detail ||
          "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container-custom py-8 max-w-2xl">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>List a Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Images */}
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-background"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Upload className="h-6 w-6" />
                        <span className="text-xs">Upload</span>
                      </button>
                    </>
                  )}
                </div>
                {errors.images && (
                  <p className="text-sm text-destructive">{errors.images}</p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Engineering Textbooks Bundle"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product in detail..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Rs.)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="2500"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value)}
                  >
                    <SelectTrigger
                      className={errors.category ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Pickup Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., SEECS Building, H-12 Hostel"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => handleChange("condition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/marketplace")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "List Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
