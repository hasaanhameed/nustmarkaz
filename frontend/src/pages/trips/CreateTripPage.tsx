import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [inclusions, setInclusions] = useState(["Transport"]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    price: "",
    spots: "",
    meetingPoint: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = () => {
    setImage("https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400");
  };

  const addInclusion = () => {
    setInclusions((prev) => [...prev, ""]);
  };

  const updateInclusion = (index: number, value: string) => {
    setInclusions((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const removeInclusion = (index: number) => {
    setInclusions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating trip:", { ...formData, image, inclusions });
    navigate("/trips");
  };

  return (
    <Layout>
      <div className="container-custom py-8 max-w-2xl">
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trips
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Organize a Trip</CardTitle>
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
                <Label htmlFor="title">Trip Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Hunza Valley Adventure"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the trip experience..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Hunza, Gilgit-Baltistan"
                    value={formData.destination}
                    onChange={(e) => handleChange("destination", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingPoint">Meeting Point</Label>
                  <Input
                    id="meetingPoint"
                    placeholder="e.g., NUST Main Gate"
                    value={formData.meetingPoint}
                    onChange={(e) => handleChange("meetingPoint", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => handleChange("departureDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => handleChange("returnDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Person (Rs.)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="25000"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spots">Total Spots</Label>
                  <Input
                    id="spots"
                    type="number"
                    placeholder="30"
                    value={formData.spots}
                    onChange={(e) => handleChange("spots", e.target.value)}
                  />
                </div>
              </div>

              {/* Inclusions */}
              <div className="space-y-2">
                <Label>What's Included</Label>
                <div className="space-y-2">
                  {inclusions.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g., Transport, Meals, Accommodation"
                        value={item}
                        onChange={(e) => updateInclusion(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeInclusion(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addInclusion} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Inclusion
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/trips")}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                  Create Trip
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
