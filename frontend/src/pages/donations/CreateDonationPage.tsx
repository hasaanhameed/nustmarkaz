import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDonation } from "@/api/donation";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateDonationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal_amount: "",
    end_date: "",
    beneficiary: "",
    contact_number: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.beneficiary ||
      !formData.goal_amount ||
      !formData.end_date
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await createDonation({
        title: formData.title,
        description: formData.description,
        beneficiary: formData.beneficiary,
        goal_amount: parseFloat(formData.goal_amount),
        end_date: formData.end_date,
        contact_number: formData.contact_number,
      });

      toast({
        title: "Success",
        description: "Donation drive created successfully!",
      });

      navigate("/donations");
    } catch (error) {
      console.error("Error creating donation:", error);
      toast({
        title: "Error",
        description: "Failed to create donation drive. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                  placeholder="Explain the cause and how funds will be used. You can also add a Bank Account/Digital Payment Number."
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

              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number (Optional)</Label>
                <Input
                  id="contact_number"
                  type="tel"
                  placeholder="03XX-XXXXXXX"
                  value={formData.contact_number}
                  onChange={(e) => handleChange("contact_number", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal_amount">Fundraising Goal (Rs.)</Label>
                  <Input
                    id="goal_amount"
                    type="number"
                    placeholder="150000"
                    value={formData.goal_amount}
                    onChange={(e) =>
                      handleChange("goal_amount", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleChange("end_date", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/donations")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Start Drive"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}