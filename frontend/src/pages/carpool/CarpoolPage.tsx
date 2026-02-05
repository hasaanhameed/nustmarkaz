import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
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
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
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
      toast.error("Failed to load ride requests.");
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
      toast.error("Failed to load ride requests.");
      console.error(error);
    }
  };

  const filteredRides = rides.filter((ride) => {
    const matchesFrom =
      !fromFilter || ride.from_location.toLowerCase().includes(fromFilter.toLowerCase());
    const matchesTo = 
      !toFilter || ride.to_location.toLowerCase().includes(toFilter.toLowerCase());
    const matchesDate =
      !dateFilter || ride.ride_date === format(dateFilter, "yyyy-MM-dd");
    return matchesFrom && matchesTo && matchesDate;
  });

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
          <Input
            placeholder="From Location"
            className="bg-background"
            value={fromFilter}
            onChange={(e) => setFromFilter(e.target.value)}
          />

          <Input
            placeholder="To Location"
            className="bg-background"
            value={toFilter}
            onChange={(e) => setToFilter(e.target.value)}
          />

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
              setFromFilter("");
              setToFilter("");
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
                setFromFilter("");
                setToFilter("");
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