import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getDonationById, updateDonation, type Donation } from "@/api/donation";
import { toast } from "sonner";

export default function EditDonationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [donation, setDonation] = useState<Donation | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal_amount: "",
    end_date: "",
  });

  useEffect(() => {
    const fetchDonation = async () => {
      if (!id) {
        navigate("/donations");
        return;
      }

      try {
        const data = await getDonationById(id);
        setDonation(data);
        setFormData({
          title: data.title,
          description: data.description,
          goal_amount: data.goal_amount.toString(),
          end_date: data.end_date.split('T')[0],
        });
      } catch (error) {
        toast.error("Failed to load donation");
        navigate("/donations");
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !donation) return;

    if (!formData.title.trim() || !formData.description.trim() || !formData.goal_amount || !formData.end_date) {
      toast.error("Please fill in all fields");
      return;
    }

    const goalAmount = parseFloat(formData.goal_amount);
    if (isNaN(goalAmount) || goalAmount <= 0) {
      toast.error("Please enter a valid goal amount");
      return;
    }

    try {
      setSubmitting(true);
      await updateDonation(parseInt(id), {
        title: formData.title,
        description: formData.description,
        goal_amount: goalAmount,
        end_date: formData.end_date,
      });
      toast.success("Donation updated successfully!");
      navigate(`/donations`);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update donation");
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

  if (!donation) {
    return null;
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/donations`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Donations
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal_amount">Goal Amount *</Label>
                <Input
                  id="goal_amount"
                  type="number"
                  value={formData.goal_amount}
                  onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/donations`)}
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
                    "Update Donation"
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