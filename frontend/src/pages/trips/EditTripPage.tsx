import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getTripById, updateTrip, type Trip } from "@/api/trip";
import { toast } from "sonner";

export default function EditTripPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    start_date: "",
    end_date: "",
    departure_location: "",
    max_participants: "",
    cost_per_person: "",
    contact_number: "",
  });

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) {
        navigate("/trips");
        return;
      }

      try {
        const data = await getTripById(id);
        setTrip(data);
        setFormData({
          title: data.title,
          description: data.description,
          destination: data.destination,
          start_date: data.start_date.split('T')[0],
          end_date: data.end_date.split('T')[0],
          departure_location: data.departure_location,
          max_participants: data.max_participants ? data.max_participants.toString() : "",
          cost_per_person: data.cost_per_person.toString(),
          contact_number: data.contact_number,
        });
      } catch (error) {
        console.error("Failed to fetch trip:", error);
        toast.error("Failed to load trip.");
        navigate("/trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !trip) return;

    if (!formData.title.trim() || !formData.description.trim() ||
      !formData.destination.trim() || !formData.start_date || !formData.end_date ||
      !formData.departure_location.trim() ||
      !formData.cost_per_person || !formData.contact_number.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const maxParticipants = formData.max_participants ? parseInt(formData.max_participants) : undefined;
    const costPerPerson = parseFloat(formData.cost_per_person);

    if (maxParticipants !== undefined && (isNaN(maxParticipants) || maxParticipants <= 0)) {
      toast.error("Please enter a valid number of participants.");
      return;
    }

    if (isNaN(costPerPerson) || costPerPerson < 0) {
      toast.error("Please enter a valid cost.");
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast.error("End date must be after start date.");
      return;
    }

    try {
      setSubmitting(true);
      await updateTrip(parseInt(id), {
        title: formData.title,
        description: formData.description,
        destination: formData.destination,
        start_date: formData.start_date,
        end_date: formData.end_date,
        departure_location: formData.departure_location,
        max_participants: maxParticipants,
        cost_per_person: costPerPerson,
        contact_number: formData.contact_number,
      });
      toast.success("Trip updated successfully.");
      navigate(`/trips/${id}`);
    } catch (error: any) {
      console.error("Failed to update trip:", error);
      toast.error(error.response?.data?.detail || "Failed to update trip.");
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

  if (!trip) {
    return null;
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/trips/${id}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Trip
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Trip title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="Where are you going?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your trip"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="departure_location">Departure Location *</Label>
                <Input
                  id="departure_location"
                  value={formData.departure_location}
                  onChange={(e) => setFormData({ ...formData, departure_location: e.target.value })}
                  placeholder="Where will you depart from?"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_participants">Max Participants (Optional)</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost_per_person">Cost per Person (Rs.) *</Label>
                  <Input
                    id="cost_per_person"
                    type="number"
                    step="0.01"
                    value={formData.cost_per_person}
                    onChange={(e) => setFormData({ ...formData, cost_per_person: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number *</Label>
                <Input
                  id="contact_number"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  placeholder="Your contact number"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/trips/${id}`)}
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
                    "Update Trip"
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