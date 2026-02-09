import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  AlertCircle,
  User,
  Navigation,
  MessageCircle,
  Share2,
  Trash2,
} from "lucide-react";
import { Ride, getRideById } from "@/api/ride";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";
import { useUser } from "@/contexts/UserContext";

export default function RideDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  const fetchRideDetails = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await getRideById(Number(id));
      setRide(data);
    } catch (error) {
      toast.error("Failed to load ride request details.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-8 flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!ride) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Ride Request Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The ride request you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/carpooling")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Carpooling
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-6 md:py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/carpooling")}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Requests
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky/20 to-blue-500/20 flex items-center justify-center border">
                      <User className="h-6 w-6 text-sky" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Ride Request</h1>
                      <p className="text-sm text-muted-foreground">
                        Posted by {ride.requester?.username || "Requester"}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge variant="default" className="text-xs">
                  Looking for Ride
                </Badge>
              </div>

              {/* Route Information */}
              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center border border-success/20">
                      <Navigation className="h-5 w-5 text-success" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      PICKUP LOCATION
                    </p>
                    <p className="font-semibold text-lg">{ride.from_location}</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="h-8 w-0.5 bg-border"></div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20">
                      <MapPin className="h-5 w-5 text-destructive" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      DESTINATION
                    </p>
                    <p className="font-semibold text-lg">{ride.to_location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Details Card */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Travel Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Date
                    </p>
                    <p className="font-semibold">
                      {ride.ride_date
                        ? format(new Date(ride.ride_date), "EEEE, MMMM dd, yyyy")
                        : "Date not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Preferred Time
                    </p>
                    <p className="font-semibold">
                      {ride.ride_time || "Time not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requester & Contact Information */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Requester Contact Information</h2>

              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-xl font-bold border-2">
                  {ride.requester?.username?.charAt(0).toUpperCase() || "R"}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {ride.requester?.username || "Requester"}
                  </h3>

                  <div className="space-y-2 mt-3">
                    {ride.contact && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Contact:</span>
                        <a
                          href={`tel:${ride.contact}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {ride.contact}
                        </a>
                      </div>
                    )}

                    {ride.requester?.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Email:</span>
                        <a
                          href={`mailto:${ride.requester.email}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {ride.requester.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Action Buttons */}
              {ride.requester?.id === currentUser?.id ? (
                <div className="space-y-3">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      toast.error("Delete functionality not implemented in this view yet");
                    }}
                    className="w-full gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Request
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share Ride Request
                </Button>
              )}

              {/* Safety Tips */}
              <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                  <h3 className="font-semibold text-sm">Safety Tips</h3>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground ml-6">
                  <li>• Verify identity before pickup</li>
                  <li>• Share trip details with friends</li>
                  <li>• Meet in a public place</li>
                  <li>• Agree on pricing beforehand</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div >
    </Layout >
  );
}