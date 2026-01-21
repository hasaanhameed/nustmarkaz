import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";

export default function CreateGiveawayPage() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [rules, setRules] = useState(["Follow us on Instagram"]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    prizeValue: "",
    endDate: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = () => {
    setImage("https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=400");
  };

  const addRule = () => {
    setRules((prev) => [...prev, ""]);
  };

  const updateRule = (index: number, value: string) => {
    setRules((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const removeRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating giveaway:", { ...formData, image, rules });
    navigate("/giveaways");
  };

  return (
    <Layout>
      <div className="container-custom py-8 max-w-2xl">
        <Link
          to="/giveaways"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Giveaways
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Host a Giveaway</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Prize Image */}
              <div className="space-y-2">
                <Label>Prize Image</Label>
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
                    <span>Upload Prize Image</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Giveaway Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., iPhone 14 Pro Giveaway"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the giveaway and how to participate..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prize">Prize Name</Label>
                  <Input
                    id="prize"
                    placeholder="e.g., iPhone 14 Pro 128GB"
                    value={formData.prize}
                    onChange={(e) => handleChange("prize", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prizeValue">Prize Value (Rs.)</Label>
                  <Input
                    id="prizeValue"
                    type="number"
                    placeholder="150000"
                    value={formData.prizeValue}
                    onChange={(e) => handleChange("prizeValue", e.target.value)}
                  />
                </div>
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

              {/* Rules */}
              <div className="space-y-2">
                <Label>Participation Rules</Label>
                <div className="space-y-2">
                  {rules.map((rule, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g., Tag 2 friends in the post"
                        value={rule}
                        onChange={(e) => updateRule(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRule(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addRule} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Rule
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/giveaways")}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                  Create Giveaway
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
