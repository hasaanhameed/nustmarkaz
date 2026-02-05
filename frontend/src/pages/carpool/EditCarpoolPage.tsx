import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getRideById, updateRide, type Ride } from "@/api/ride";
import { toast } from "sonner";

export default function EditCarpoolPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [ride, setRide] = useState<Ride | null>(null);
  const [formData, setFormData] = useState({
    from_location: "",
    to_location: "",
    ride_date: "",
    ride_time: "",
    contact: "",
  });

  useEffect(() => {
    const fetchRide = async () => {
      if (!id) {
        navigate("/carpooling");
        return;
      }

      try {
        const data = await getRideById(parseInt(id));
        setRide(data);
        setFormData({
          from_location: data.from_location,
          to_location: data.to_location,
          ride_date: data.ride_date.split('T')[0],
          ride_time: data.ride_time,
          contact: data.contact,
        });
      } catch (error) {
        console.error("Failed to fetch ride request:", error);
        toast.error("Failed to load ride request");
        navigate("/carpooling");
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [id, navigate]);

  const validateTextInput = (value: string, fieldName: string): boolean => {
    if (!value.trim()) {
      toast.error(`${fieldName} cannot be empty`);
      return false;
    }

    // Check if input contains only numbers
    if (/^\d+$/.test(value.trim())) {
      toast.error(`${fieldName} cannot contain only numbers`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !ride) return;

    if (!formData.from_location.trim() || !formData.to_location.trim() ||
      !formData.ride_date || !formData.ride_time || !formData.contact.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate locations
    if (!validateTextInput(formData.from_location, "Pickup location")) return;
    if (!validateTextInput(formData.to_location, "Destination location")) return;

    try {
      setSubmitting(true);
      await updateRide(parseInt(id), {
        from_location: formData.from_location.trim(),
        to_location: formData.to_location.trim(),
        ride_date: formData.ride_date,
        ride_time: formData.ride_time,
        contact: formData.contact,
      });
      toast.success("Ride request updated successfully!");
      navigate(`/carpooling`);
    } catch (error: any) {
      console.error("Failed to update ride request:", error);
      toast.error(error.response?.data?.detail || "Failed to update ride request");
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

  if (!ride) {
    return null;
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/carpooling`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Ride Request
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Ride Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from_location">Pickup Location *</Label>
                  <Input
                    id="from_location"
                    value={formData.from_location}
                    onChange={(e) => setFormData({ ...formData, from_location: e.target.value })}
                    placeholder="e.g., F-7, Bahria Town"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to_location">Destination *</Label>
                  <Input
                    id="to_location"
                    value={formData.to_location}
                    onChange={(e) => setFormData({ ...formData, to_location: e.target.value })}
                    placeholder="e.g., NUST H-12, Blue Area"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ride_date">Date *</Label>
                  <Input
                    id="ride_date"
                    type="date"
                    value={formData.ride_date}
                    onChange={(e) => setFormData({ ...formData, ride_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ride_time">Time *</Label>
                  <Input
                    id="ride_time"
                    type="time"
                    value={formData.ride_time}
                    onChange={(e) => setFormData({ ...formData, ride_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="03XX-XXXXXXX"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/carpooling`)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Request"
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