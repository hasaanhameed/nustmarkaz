import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Share2,
  Phone,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getTripById, deleteTrip, Trip } from "@/api/trip";
import { useUser } from "@/contexts/UserContext";

import { toast } from "sonner";

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const { user: currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (tripId: string) => {
    try {
      const tripData = await getTripById(tripId);
      setTrip(tripData);
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!trip) return;

    try {
      setIsDeleting(true);
      await deleteTrip(trip.id);
      toast.success("Trip deleted successfully");
      navigate("/trips");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="text-center py-12">Loading trip details...</div>
        </div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="text-center py-12">Trip not found</div>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const creatorInitial = trip.creator.username.charAt(0).toUpperCase();
  const isCreator = currentUser?.id === trip.creator_id;

  return (
    <Layout>
      <div className="container-custom py-8">
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trips
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-6">
              <img
                src={
                  trip.images[0]?.image_path ||
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
                }
                alt={trip.title}
                className="w-full h-full object-cover"
              />
            </div>

            <Badge className="bg-success text-success-foreground mb-4">
              Trip
            </Badge>
            <h1 className="text-3xl font-bold mb-4">{trip.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{trip.max_participants} spots</span>
              </div>
            </div>

            <div className="border-t border-border py-6 mb-6">
              <h2 className="font-semibold text-lg mb-3">About This Trip</h2>
              <p className="text-muted-foreground leading-relaxed">
                {trip.description}
              </p>
            </div>

            {/* Creator Info */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">
                  Posted by
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                    {creatorInitial}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{trip.creator.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {trip.creator.department}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="border-t border-border py-6">
              <h2 className="font-semibold text-lg mb-4">Trip Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Departure Location
                  </span>
                  <span className="font-medium">{trip.departure_location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium">{trip.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">
                    {formatDate(trip.start_date)} to {formatDate(trip.end_date)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Rs. {trip.cost_per_person.toLocaleString()}
                </CardTitle>
                <p className="text-sm text-muted-foreground">per person</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Spots</span>
                  <span className="font-medium">{trip.max_participants}</span>
                </div>

                {/* Contact Information */}
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sm">Contact Organizer</h3>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="font-medium">{trip.contact_number}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Call to book your spot or ask questions
                    </p>
                  </CardContent>
                </Card>

                {/* Edit/Delete or Share buttons */}
                {isCreator ? (
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate(`/trips/edit/${trip.id}`)}
                      className="w-full gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Trip
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full gap-2">
                          <Trash2 className="h-4 w-4" />
                          Delete Trip
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Trip</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this trip? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Trip
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}