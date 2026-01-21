import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X } from "lucide-react";

export default function CreateDonationPage() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    endDate: "",
    beneficiary: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = () => {
    setImage("https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating donation:", { ...formData, image });
    navigate("/donations");
  };

  return (
    <Layout>
      <div className="container-custom py-8 max-w-2xl">
        <Link
          to="/donations"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Donations
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Start a Donation Drive</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cover Image */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
                {image ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-accent flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Upload className="h-8 w-8" />
                    <span>Upload Cover Image</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Drive Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Winter Clothes for Orphanage"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Explain the cause and how funds will be used..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiary">Beneficiary</Label>
                <Input
                  id="beneficiary"
                  placeholder="e.g., Local Orphanage, Community School"
                  value={formData.beneficiary}
                  onChange={(e) => handleChange("beneficiary", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Fundraising Goal (Rs.)</Label>
                  <Input
                    id="goal"
                    type="number"
                    placeholder="150000"
                    value={formData.goal}
                    onChange={(e) => handleChange("goal", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/donations")}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                  Start Drive
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
