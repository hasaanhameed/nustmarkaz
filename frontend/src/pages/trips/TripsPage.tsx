import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/ui/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, Plus, MapPin } from "lucide-react";
import { getAllTrips, Trip } from "@/api/trip";
import { getCurrentUser, User } from "@/api/user";

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchTrips();
    fetchCurrentUser();
  }, []);

  const fetchTrips = async () => {
    try {
      const data = await getAllTrips();
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setCurrentUser(null);
    }
  };

  const filteredTrips = trips.filter((trip) =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Trips & Events</h1>
            <p className="text-muted-foreground mt-1">
              Explore adventures with fellow students
            </p>
          </div>
          {currentUser ? (
            <Link to="/trips/create">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <Plus className="h-4 w-4" />
                Organize Trip
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <Plus className="h-4 w-4" />
                Log in to Post
              </Button>
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="text-center py-12">Loading trips...</div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <ListingCard
                key={trip.id}
                id={trip.id.toString()}
                title={trip.title}
                description={trip.description}
                image={
                  trip.images[0]?.image_path ||
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
                }
                type="trip"
                price={trip.cost_per_person}
                location={trip.destination}
                author={{ name: trip.creator.username }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MapPin}
            title="No trips found"
            description="Be the first to organize an adventure!"
            actionLabel="Organize Trip"
            actionHref="/trips/create"
          />
        )}
      </div>
    </Layout>
  );
}
