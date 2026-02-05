import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CAMPUS_LOCATIONS, CITY_LOCATIONS } from "@/data/mockCarpool";
import { RideCard } from "@/components/ui/RideCard";
import { RequestRideDialog } from "./RequestRideDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllRides, Ride } from "@/api/ride";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useUser } from "@/contexts/UserContext";

export default function CarpoolPage() {
  const [searchParams] = useSearchParams();
  const [rides, setRides] = useState<Ride[]>([]);
  const { user: currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [fromFilter, setFromFilter] = useState("All");
  const [toFilter, setToFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<Date>();
  const [autoOpenDialog, setAutoOpenDialog] = useState(false);

  useEffect(() => {
    fetchData();
    // Check if we should auto-open the dialog
    const create = searchParams.get("create");
    if (create === "true") {
      setAutoOpenDialog(true);
    }
  }, [searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const ridesData = await getAllRides(0, 50);
      setRides(ridesData);
    } catch (error) {
      toast.error("Failed to load ride requests");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRides = async () => {
    try {
      const data = await getAllRides(0, 50);
      setRides(data);
    } catch (error) {
      toast.error("Failed to load ride requests");
      console.error(error);
    }
  };

  const filteredRides = rides.filter((ride) => {
    const matchesFrom =
      fromFilter === "All" || ride.from_location === fromFilter;
    const matchesTo = toFilter === "All" || ride.to_location === toFilter;
    const matchesDate =
      !dateFilter || ride.ride_date === format(dateFilter, "yyyy-MM-dd");
    return matchesFrom && matchesTo && matchesDate;
  });

  const allLocations = [...CAMPUS_LOCATIONS, ...CITY_LOCATIONS].sort();

  return (
    <Layout>
      <div className="container-custom py-8 space-y-8">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-entrance">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Student Carpooling
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Looking for a ride? Post your travel details and connect with fellow NUSTians heading your way.
          </p>
          <div className="flex justify-center">
            <RequestRideDialog
              onRideCreated={fetchRides}
              autoOpen={autoOpenDialog}
              onOpenChange={(open) => {
                if (!open) setAutoOpenDialog(false);
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border">
          <Select value={fromFilter} onValueChange={setFromFilter}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="From Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Any Pickup Point</SelectItem>
              {allLocations.map((loc) => (
                <SelectItem key={`filter-from-${loc}`} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={toFilter} onValueChange={setToFilter}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="To Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Any Destination</SelectItem>
              {allLocations.map((loc) => (
                <SelectItem key={`filter-to-${loc}`} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-background",
                  !dateFilter && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, "PPP") : <span>Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            onClick={() => {
              setFromFilter("All");
              setToFilter("All");
              setDateFilter(undefined);
            }}
          >
            Reset Filters
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                currentUserId={currentUser?.id}
                onRideDeleted={fetchRides}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No ride requests available matching your criteria.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setFromFilter("All");
                setToFilter("All");
                setDateFilter(undefined);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}