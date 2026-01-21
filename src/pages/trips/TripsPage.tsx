import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/ui/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockTrips } from "@/data/mockData";
import { Search, Plus, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const destinations = ["All Destinations", "Northern Areas", "Kashmir", "Punjab", "Sindh"];

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [destination, setDestination] = useState("All Destinations");

  const filteredTrips = mockTrips.filter((trip) =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Trips & Events</h1>
            <p className="text-muted-foreground mt-1">Explore adventures with fellow students</p>
          </div>
          <Link to="/trips/create">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Plus className="h-4 w-4" />
              Organize Trip
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((dest) => (
                <SelectItem key={dest} value={dest}>{dest}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <ListingCard key={trip.id} {...trip} />
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
