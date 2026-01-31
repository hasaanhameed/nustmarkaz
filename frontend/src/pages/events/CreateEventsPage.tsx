import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X } from "lucide-react";
import { createEvent } from "@/api/event";
import { useToast } from "@/hooks/use-toast";

export default function CreateEventsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    society: "",
    location: "",
    event_date: "",
    event_time: "",
    contact_number: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const datetime = `${formData.event_date}T${formData.event_time}:00`;

      await createEvent({
        title: formData.title,
        description: formData.description,
        society: formData.society,
        location: formData.location,
        event_date: datetime,
        contact_number: formData.contact_number,
        image_paths: image ? [image] : [],
      });

      toast({
        title: "Success!",
        description: "Event created successfully",
      });

      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
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
          to="/events"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Post an Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Image */}
              <div className="space-y-2">
                <Label>Event Image</Label>
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
                  <label className="w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8" />
                    <span>Upload Event Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., ACM Tech Talk"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the event and what attendees can expect..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="society">Organizing Society *</Label>
                <Input
                  id="society"
                  placeholder="e.g., ACM NUST"
                  value={formData.society}
                  onChange={(e) => handleChange("society", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Main Auditorium"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number *</Label>
                <Input
                  id="contact_number"
                  type="tel"
                  placeholder="03XX-XXXXXXX"
                  value={formData.contact_number}
                  onChange={(e) => handleChange("contact_number", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Event Date *</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => handleChange("event_date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_time">Event Time *</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => handleChange("event_time", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/events")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}