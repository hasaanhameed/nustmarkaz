import { useState, useEffect } from "react";
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
import { OfferRideDialog } from "@/components/ui/OfferRideDialog";
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

export default function CarpoolPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromFilter, setFromFilter] = useState("All");
  const [toFilter, setToFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<Date>();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setIsLoading(true);
    try {
      const data = await getAllRides(0, 50);
      setRides(data);
    } catch (error) {
      toast.error("Failed to load rides");
      console.error(error);
    } finally {
      setIsLoading(false);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Student Car Pooling
            </h1>
            <p className="text-muted-foreground mt-1">
              Find a ride, share a commute, and save money.
            </p>
          </div>
          <OfferRideDialog onRideCreated={fetchRides} />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border">
          <Select value={fromFilter} onValueChange={setFromFilter}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="From Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Any Origin</SelectItem>
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
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No rides available matching your criteria.
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
